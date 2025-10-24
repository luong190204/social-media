import { useEffect, useRef, useState } from "react";
import { Stomp } from "stompjs";

export const CallProvider = ({ children, authUser })  => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isIncoming, setIsIncoming] = useState(false);
  const [caller, setCaller] = useState(null);

  const pcRef = useRef(null);
  const stompClientRef = useRef(null);

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
      console.log("✅ Connected to WebSocket for calls");

      stompClient.subscribe(`/user/${authUser.id}/call`, (message) => {
        const signal = JSON.parse(message.body);
        handleSignal(signal);
      });
    });

    stompClientRef.current = stompClient;
  }, [authUser]);

  // Xử lý các loại tín hiệu WebRTC
  const handleSignal = async (signal) => {
    switch (signal.type) {
      case "OFFER":
        setIsIncoming(true);
        setCaller(signal.from);
        createPeerConnection(signal.from);
        await pcRef.current.setRemoteDescription(signal.sdp);
        const answer = await pcRef.current.createAnswer();
        await pcRef.current.setLocalDescription(answer);
        sendCallSignal(stompClientRef.current, {
          type: "ANSWER",
          sdp: answer,
          from: authUser.id,
          to: signal.from,
        });
        break;

      case "ANSWER":
        await pcRef.current.setRemoteDescription(signal.sdp);
        break;

      case "ICE":
        if (signal.candidate) {
          await pcRef.current.addIceCandidate(signal.candidate);
        }
        break;

      default:
        break;
    }
  };

  // Tạo PeerConnection
  const createPeerConnection = (remoteUserId) => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        sendCallSignal(stompClientRef.current, {
          type: "ICE",
          candidate: event.candidate,
          from: authUser.id,
          to: remoteUserId,
        });
      }
    };

    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    pcRef.current = pc;
  };

  // Gọi người khác
  const startCall = async (toUserId) => {
    createPeerConnection(toUserId);

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setLocalStream(stream);
    stream
      .getTracks()
      .forEach((track) => pcRef.current.addTrack(track, stream));

    const offer = await pcRef.current.createOffer();
    await pcRef.current.setLocalDescription(offer);

    sendCallSignal(stompClientRef.current, {
      type: "OFFER",
      sdp: offer,
      from: authUser.id,
      to: toUserId,
    });

    setIsCallActive(true);
  };

  // Kết thúc cuộc gọi
  const endCall = () => {
    setIsCallActive(false);
    setIsIncoming(false);
    pcRef.current?.close();
    localStream?.getTracks().forEach((t) => t.stop());
    setLocalStream(null);
    setRemoteStream(null);
  };

  return (
    <CallContext.Provider
      value={{
        startCall,
        endCall,
        isCallActive,
        isIncoming,
        localStream,
        remoteStream,
        caller,
      }}
    >
      {children}
    </CallContext.Provider>
  );
}

export const useCall = () => useContext(CallContext);