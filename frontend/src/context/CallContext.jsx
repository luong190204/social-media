import { createContext, useContext, useEffect, useRef, useState } from "react";
import { getStompClient, connectSocket, disconnectSocket } from "../lib/socket";
import axios from "axios";

const CallContext = createContext();

export const useCall = () => useContext(CallContext);

export const CallProvider = ({ children, authUser, apiBase = "" }) => {
  const [isCalling, setIsCalling] = useState(false);
  const [isIncoming, setIsIncoming] = useState(false);
  const [inbound, setInbound] = useState(null);
  const [inCall, setInCall] = useState(false);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const stompReadyRef = useRef(false);

  // FIX: pendingIceRef phải là mảng để lưu các ICE candidates
  const pendingIceRef = useRef([]);
  // FIX: Thêm ref riêng để lưu pending offer
  const pendingOfferRef = useRef(null);

  const currentCallIdRef = useRef(null);
  const currentPeerRef = useRef(null);

  // kết nối socket 1 lần
  useEffect(() => {
    if (!authUser) return;

    connectSocket(authUser.id, null, onCallSignal);
    stompReadyRef.current = true;

    return () => {
      disconnectSocket();
      closePeerConnection();
      stompReadyRef.current = false;
    };
  }, [authUser]);

  // -----------------------------------------
  // Signaling message receiver
  // -----------------------------------------
  async function onCallSignal(payload) {
    console.log("onCallSignal received:", payload);
    const type = (payload.type || "").toLowerCase();

    if (type === "offer") {
      // FIX: Lưu offer vào pendingOfferRef, không phải pendingIceRef
      pendingOfferRef.current = payload;

      setInbound({
        from: payload.from,
        callId: payload.callId,
        metadata: payload.metadata,
      });
      setIsIncoming(true);
    } else if (type === "answer") {
      if (pcRef.current) {
        await pcRef.current.setRemoteDescription(
          new RTCSessionDescription(payload.sdp)
        );
      } else {
        console.warn("No pc when answer arrives");
      }
    } else if (type === "ice") {
      if (pcRef.current && pcRef.current.remoteDescription) {
        try {
          await pcRef.current.addIceCandidate(
            new RTCIceCandidate(payload.candidate)
          );
        } catch (error) {
          console.warn("addIceCandidate failed", error);
        }
      } else {
        // Buffer ICE candidates nếu chưa có remoteDescription
        pendingIceRef.current.push(payload.candidate);
      }
    } else if (type === "end") {
      handleRemoteHangup(payload);
    } else if (type === "reject") {
      handleReject(payload);
    } else {
      console.warn("unknown call signal:", payload);
    }
  }

  // -----------------------------------------
  // Helper: create PeerConnection
  // -----------------------------------------
  function createPeerConnection(remoteUserId) {
    const iceServers = [{ urls: "stun:stun.l.google.com:19302" }];

    const pc = new RTCPeerConnection({ iceServers });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        sendSignal({
          type: "ice",
          to: remoteUserId,
          candidate: event.candidate,
          callId: currentCallIdRef.current,
        });
      }
    };

    pc.ontrack = (event) => {
      console.log("ontrack received", event.streams);
      if (remoteVideoRef.current && event.streams[0]) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    pc.onconnectionstatechange = () => {
      const state = pc.connectionState;
      console.log("Connection state:", state);

      if (state === "connected") {
        setInCall(true);
        setIsCalling(false);
      } else if (
        state === "disconnected" ||
        state === "failed" ||
        state === "closed"
      ) {
        setInCall(false);
      }
    };

    pcRef.current = pc;

    // Apply buffered ICE candidates
    if (pendingIceRef.current.length > 0) {
      console.log(
        "Applying",
        pendingIceRef.current.length,
        "pending ICE candidates"
      );
      pendingIceRef.current.forEach(async (candidate) => {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (error) {
          console.warn("apply pending ice fail", error);
        }
      });
      pendingIceRef.current = [];
    }

    return pc;
  }

  // -----------------------------------------
  // Send signaling message
  // -----------------------------------------
  function sendSignal(msg) {
    const stomp = getStompClient();
    if (!stomp || !stomp.connected) {
      console.warn("stomp not ready");
      return;
    }
    console.log("Sending signal:", msg.type, "to:", msg.to);
    stomp.send("/app/call.send", {}, JSON.stringify(msg));
  }

  // -----------------------------------------
  // Caller: startCall
  // -----------------------------------------
  async function startCall(toUserId, { isVideo = true } = {}) {
    console.log("Starting call to:", toUserId);

    if (!stompReadyRef.current) {
      console.warn("Socket not ready");
      alert("Kết nối chưa sẵn sàng, vui lòng thử lại!");
      return;
    }

    currentPeerRef.current = toUserId;
    currentCallIdRef.current = crypto.randomUUID();

    const pc = createPeerConnection(toUserId);

    // Get local media
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: isVideo,
        audio: true,
      });
      localStreamRef.current = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });
    } catch (e) {
      console.error("getUserMedia failed", e);
      alert("Không thể truy cập camera/microphone!");
      cleanupAfterCall();
      return;
    }

    // Create offer
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    // Send offer signal
    sendSignal({
      type: "offer",
      from: authUser.id,
      to: toUserId,
      callId: currentCallIdRef.current,
      sdp: offer,
      metadata: { isVideo },
    });

    setIsCalling(true);
  }

  // -----------------------------------------
  // Callee: acceptCall
  // -----------------------------------------
  async function acceptCall() {
    console.log("Accepting call");

    const payload = pendingOfferRef.current;
    if (!payload) {
      console.warn("No pending offer");
      return;
    }

    const from = payload.from;
    currentPeerRef.current = from;
    currentCallIdRef.current = payload.callId || crypto.randomUUID();

    const pc = createPeerConnection(from);

    // Get media
    const wantVideo = payload.metadata?.isVideo ?? true;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: wantVideo,
        audio: true,
      });
      localStreamRef.current = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });
    } catch (e) {
      console.error("getUserMedia failed", e);
      alert("Không thể truy cập camera/microphone!");
      sendSignal({
        type: "reject",
        from: authUser.id,
        to: from,
        callId: currentCallIdRef.current,
      });
      cleanupAfterCall();
      return;
    }

    // Set remote description with incoming offer
    await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));

    // Create answer
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    // Send answer
    sendSignal({
      type: "answer",
      from: authUser.id,
      to: from,
      callId: currentCallIdRef.current,
      sdp: answer,
    });

    setIsIncoming(false);
    setInCall(true);
    pendingOfferRef.current = null;
  }

  // -----------------------------------------
  // Hangup
  // -----------------------------------------
  function hangup() {
    console.log("Hanging up");
    const peer = currentPeerRef.current;

    if (peer) {
      sendSignal({
        type: "end",
        from: authUser.id,
        to: peer,
        callId: currentCallIdRef.current,
      });
    }

    cleanupAfterCall();
  }

  // -----------------------------------------
  // Reject incoming call
  // -----------------------------------------
  function rejectCall() {
    console.log("Rejecting call");
    const payload = pendingOfferRef.current;

    if (payload) {
      sendSignal({
        type: "reject",
        from: authUser.id,
        to: payload.from,
        callId: payload.callId,
      });
    }

    cleanupAfterCall();
  }

  // -----------------------------------------
  // Handle remote hangup
  // -----------------------------------------
  function handleRemoteHangup(payload) {
    console.log("Remote hangup");
    cleanupAfterCall();
  }

  function handleReject(payload) {
    console.log("Call rejected");
    alert("Cuộc gọi bị từ chối!");
    cleanupAfterCall();
  }

  // -----------------------------------------
  // Cleanup
  // -----------------------------------------
  function cleanupAfterCall() {
    setIsCalling(false);
    setIsIncoming(false);
    setInCall(false);

    currentCallIdRef.current = null;
    currentPeerRef.current = null;
    pendingOfferRef.current = null;
    pendingIceRef.current = [];

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }

    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
  }

  function closePeerConnection() {
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
  }

  // -----------------------------------------
  // Mark missed call
  // -----------------------------------------
  async function markMissed(callId) {
    try {
      await axios.post(`${apiBase}/api/calls/${callId}/missed`);
    } catch (e) {
      console.warn("mark missed failed", e);
    }
  }

  return (
    <CallContext.Provider
      value={{
        localVideoRef,
        remoteVideoRef,
        isCalling,
        isIncoming,
        inbound,
        inCall,
        startCall,
        acceptCall,
        hangup,
        rejectCall,
        markMissed,
      }}
    >
      {children}
    </CallContext.Provider>
  );
};
