// src/hooks/useWebRTC.js
import { useEffect, useRef, useState, useCallback } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
  ],
};

export const useWebRTC = (userId, token) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const [callStatus, setCallStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);

  const peerConnection = useRef(null);
  const stompClient = useRef(null);
  const currentCallId = useRef(null);
  const currentCalleeId = useRef(null);
  const iceCandidatesQueue = useRef([]);
  const callTimeout = useRef(null);

  // Kết nối WebSocket với stompjs (version cũ)
  useEffect(() => {
    if (!userId || !token) {
      console.log("❌ Missing userId or token");
      return;
    }

    console.log("🔌 Connecting to WebSocket with userId:", userId);

    try {
      // ✅ Tạo SockJS connection
      const socket = new SockJS(`http://localhost:8085/ws?token=${token}`);

      // ✅ Tạo STOMP client với stompjs v2
      const client = Stomp.over(socket);

      // Tắt debug log (nếu muốn bật thì set = console.log)
      client.debug = null;

      // ✅ Connect với headers
      client.connect(
        {
          Authorization: `Bearer ${token}`,
        },
        // onConnect callback
        () => {
          console.log("✅ Connected to WebSocket");

          // Subscribe to incoming calls
          client.subscribe(`/user/queue/call.incoming`, (message) => {
            console.log("📞 Incoming call:", message.body);
            const notification = JSON.parse(message.body);
            handleIncomingCall(notification);
          });

          // Subscribe to call initiated
          client.subscribe(`/user/queue/call.initiated`, (message) => {
            console.log("📞 Call initiated:", message.body);
            const call = JSON.parse(message.body);
            currentCallId.current = call.id;
          });

          // Subscribe to call accepted
          client.subscribe(`/user/queue/call.accepted`, (message) => {
            console.log("✅ Call accepted:", message.body);
            setCallStatus("connecting");
          });

          // Subscribe to call rejected
          client.subscribe(`/user/queue/call.rejected`, (message) => {
            console.log("❌ Call rejected:", message.body);
            handleCallEnded();
            setError("Call was rejected");
          });

          // Subscribe to signaling
          client.subscribe(`/user/queue/call.signal`, (message) => {
            const signal = JSON.parse(message.body);
            handleSignal(signal);
          });

          // Subscribe to call ended
          client.subscribe(`/user/queue/call.ended`, (message) => {
            console.log("📴 Call ended:", message.body);
            handleCallEnded();
          });

          // Subscribe to call cancelled
          client.subscribe(`/user/queue/call.cancelled`, (message) => {
            console.log("🚫 Call cancelled:", message.body);
            handleCallEnded();
            setIncomingCall(null);
          });

          // Subscribe to errors
          client.subscribe(`/user/queue/errors`, (message) => {
            console.error("❌ Error:", message.body);
            setError(message.body);
            handleCallEnded();
          });
        },
        // onError callback
        (error) => {
          console.error("❌ STOMP connection error:", error);
          setError("Connection error");
        }
      );

      stompClient.current = client;
    } catch (err) {
      console.error("❌ Error creating WebSocket connection:", err);
      setError("Failed to connect to server");
    }

    // Cleanup
    return () => {
      console.log("🧹 Cleaning up WebSocket connection");
      if (stompClient.current && stompClient.current.connected) {
        stompClient.current.disconnect(() => {
          console.log("Disconnected from WebSocket");
        });
      }
      cleanup();
    };
  }, [userId, token]);

  // Xử lý cuộc gọi đến
  const handleIncomingCall = (notification) => {
    setIncomingCall(notification);
    setCallStatus("ringing");

    // Auto-reject after 30 seconds
    callTimeout.current = setTimeout(() => {
      if (incomingCall) {
        rejectCall();
      }
    }, 30000);
  };

  // Khởi tạo cuộc gọi
  const initiateCall = useCallback(
    async (calleeId, callerName, callerAvatar, type = "VIDEO") => {
      try {
        console.log(`📞 Initiating ${type} call to:`, calleeId);
        setCallStatus("calling");
        setError(null);
        currentCalleeId.current = calleeId;

        // Get local media
        const constraints = {
          video: type === "VIDEO" ? { width: 1280, height: 720 } : false,
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        setLocalStream(stream);

        // Create peer connection
        createPeerConnection(stream);

        // ✅ Send initiate request với stompjs v2
        stompClient.current.send(
          "/app/call.initiate",
          {},
          JSON.stringify({
            calleeId,
            callerName,
            callerAvatar,
            type,
          })
        );

        // Set timeout
        callTimeout.current = setTimeout(() => {
          if (callStatus === "calling") {
            cancelCall();
            setError("No answer");
          }
        }, 30000);
      } catch (err) {
        console.error("Error initiating call:", err);
        setError(err.message || "Failed to access camera/microphone");
        setCallStatus("idle");
      }
    },
    [callStatus]
  );

  // Tạo peer connection
  const createPeerConnection = (stream) => {
    console.log("🔗 Creating peer connection");

    peerConnection.current = new RTCPeerConnection(ICE_SERVERS);

    // Add local tracks
    stream.getTracks().forEach((track) => {
      peerConnection.current.addTrack(track, stream);
    });

    // Handle remote stream
    peerConnection.current.ontrack = (event) => {
      console.log("📺 Received remote track");
      setRemoteStream(event.streams[0]);
      setCallStatus("ongoing");
      clearTimeout(callTimeout.current);
    };

    // Handle ICE candidates
    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("🧊 Sending ICE candidate");
        stompClient.current.send(
          "/app/call.ice-candidate",
          {},
          JSON.stringify({
            callId: currentCallId.current,
            targetUserId: currentCalleeId.current,
            type: "ICE_CANDIDATE",
            candidate: event.candidate,
          })
        );
      }
    };

    // Handle connection state
    peerConnection.current.onconnectionstatechange = () => {
      console.log(
        "🔄 Connection state:",
        peerConnection.current.connectionState
      );

      if (peerConnection.current.connectionState === "connected") {
        setCallStatus("ongoing");
      } else if (peerConnection.current.connectionState === "failed") {
        setError("Connection failed");
        endCall();
      } else if (peerConnection.current.connectionState === "disconnected") {
        endCall();
      }
    };
  };

  // Trả lời cuộc gọi
  const answerCall = useCallback(async () => {
    try {
      if (!incomingCall) return;

      console.log("✅ Answering call:", incomingCall.callId);
      clearTimeout(callTimeout.current);

      currentCallId.current = incomingCall.callId;
      currentCalleeId.current = incomingCall.callerId;

      setCallStatus("connecting");

      // Get local media
      const constraints = {
        video:
          incomingCall.type === "VIDEO" ? { width: 1280, height: 720 } : false,
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setLocalStream(stream);

      // Create peer connection
      createPeerConnection(stream);

      // ✅ Send answer request
      stompClient.current.send(
        "/app/call.answer",
        {},
        JSON.stringify({
          callId: incomingCall.callId,
          accepted: true,
        })
      );

      setIncomingCall(null);
    } catch (err) {
      console.error("Error answering call:", err);
      setError(err.message || "Failed to access camera/microphone");
      rejectCall();
    }
  }, [incomingCall]);

  // Từ chối cuộc gọi
  const rejectCall = useCallback(() => {
    if (!incomingCall) return;

    console.log("❌ Rejecting call:", incomingCall.callId);
    clearTimeout(callTimeout.current);

    stompClient.current.send(
      "/app/call.answer",
      {},
      JSON.stringify({
        callId: incomingCall.callId,
        accepted: false,
      })
    );

    setIncomingCall(null);
    setCallStatus("idle");
  }, [incomingCall]);

  // Hủy cuộc gọi
  const cancelCall = useCallback(() => {
    if (!currentCallId.current) return;

    console.log("🚫 Cancelling call:", currentCallId.current);
    clearTimeout(callTimeout.current);

    stompClient.current.send(
      "/app/call.cancel",
      {},
      JSON.stringify({
        callId: currentCallId.current,
        reason: "Cancelled by caller",
      })
    );

    handleCallEnded();
  }, []);

  // Xử lý signal
  const handleSignal = async (signal) => {
    try {
      console.log("📡 Received signal:", signal.type);

      if (!peerConnection.current) {
        console.warn("⚠️ Peer connection not ready");
        if (signal.type === "ICE_CANDIDATE") {
          iceCandidatesQueue.current.push(signal.candidate);
        }
        return;
      }

      if (signal.type === "OFFER") {
        console.log("📨 Processing offer");

        await peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(signal.offer)
        );

        // Process queued ICE candidates
        while (iceCandidatesQueue.current.length > 0) {
          const candidate = iceCandidatesQueue.current.shift();
          await peerConnection.current.addIceCandidate(
            new RTCIceCandidate(candidate)
          );
        }

        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);

        console.log("📤 Sending answer");
        stompClient.current.send(
          "/app/call.answer-signal",
          {},
          JSON.stringify({
            callId: currentCallId.current,
            targetUserId: signal.senderId,
            type: "ANSWER",
            answer,
          })
        );
      } else if (signal.type === "ANSWER") {
        console.log("📨 Processing answer");

        await peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(signal.answer)
        );

        while (iceCandidatesQueue.current.length > 0) {
          const candidate = iceCandidatesQueue.current.shift();
          await peerConnection.current.addIceCandidate(
            new RTCIceCandidate(candidate)
          );
        }
      } else if (signal.type === "ICE_CANDIDATE") {
        console.log("🧊 Processing ICE candidate");

        if (peerConnection.current.remoteDescription) {
          await peerConnection.current.addIceCandidate(
            new RTCIceCandidate(signal.candidate)
          );
        } else {
          iceCandidatesQueue.current.push(signal.candidate);
        }
      }
    } catch (err) {
      console.error("Error handling signal:", err);
      setError("Signaling error");
    }
  };

  // Gửi offer
  useEffect(() => {
    const sendOffer = async () => {
      if (
        callStatus === "calling" &&
        peerConnection.current &&
        currentCallId.current
      ) {
        try {
          console.log("📤 Creating and sending offer");

          const offer = await peerConnection.current.createOffer();
          await peerConnection.current.setLocalDescription(offer);

          stompClient.current.send(
            "/app/call.offer",
            {},
            JSON.stringify({
              callId: currentCallId.current,
              targetUserId: currentCalleeId.current,
              type: "OFFER",
              offer,
            })
          );
        } catch (err) {
          console.error("Error sending offer:", err);
          setError("Failed to create offer");
        }
      }
    };

    sendOffer();
  }, [callStatus, currentCallId.current]);

  // Kết thúc cuộc gọi
  const endCall = useCallback(() => {
    if (!currentCallId.current) {
      handleCallEnded();
      return;
    }

    console.log("📴 Ending call:", currentCallId.current);
    clearTimeout(callTimeout.current);

    stompClient.current.send(
      "/app/call.end",
      {},
      JSON.stringify({
        callId: currentCallId.current,
        reason: "User ended call",
      })
    );

    handleCallEnded();
  }, []);

  // Cleanup
  const handleCallEnded = () => {
    console.log("🧹 Cleaning up call resources");

    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }

    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }

    currentCallId.current = null;
    currentCalleeId.current = null;
    iceCandidatesQueue.current = [];
    clearTimeout(callTimeout.current);

    setLocalStream(null);
    setRemoteStream(null);
    setCallStatus("idle");
    setIsAudioMuted(false);
    setIsVideoMuted(false);
  };

  const cleanup = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    if (peerConnection.current) {
      peerConnection.current.close();
    }
    clearTimeout(callTimeout.current);
  };

  // Toggle audio
  const toggleAudio = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioMuted(!audioTrack.enabled);
      }
    }
  }, [localStream]);

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoMuted(!videoTrack.enabled);
      }
    }
  }, [localStream]);

  // Switch camera
  const switchCamera = useCallback(async () => {
    if (!localStream) return;

    try {
      const videoTrack = localStream.getVideoTracks()[0];
      const currentFacingMode = videoTrack.getSettings().facingMode;

      videoTrack.stop();

      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: currentFacingMode === "user" ? "environment" : "user",
          width: 1280,
          height: 720,
        },
        audio: false,
      });

      const newVideoTrack = newStream.getVideoTracks()[0];

      const sender = peerConnection.current
        .getSenders()
        .find((s) => s.track && s.track.kind === "video");

      if (sender) {
        await sender.replaceTrack(newVideoTrack);
      }

      const updatedStream = new MediaStream([
        newVideoTrack,
        ...localStream.getAudioTracks(),
      ]);

      setLocalStream(updatedStream);
    } catch (err) {
      console.error("Error switching camera:", err);
      setError("Failed to switch camera");
    }
  }, [localStream]);

  return {
    localStream,
    remoteStream,
    incomingCall,
    callStatus,
    error,
    isAudioMuted,
    isVideoMuted,
    initiateCall,
    answerCall,
    rejectCall,
    cancelCall,
    endCall,
    toggleAudio,
    toggleVideo,
    switchCamera,
  };
};
