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

  // ✅ FIX 1: Tách handleIncomingCall ra ngoài để tránh stale closure
  const handleIncomingCall = useCallback((notification) => {
    console.log("📞 HANDLING INCOMING CALL:", notification);
    setIncomingCall(notification);
    setCallStatus("ringing");

    // Auto-reject after 30 seconds
    const timeout = setTimeout(() => {
      console.log("⏰ Call timeout - auto rejecting");
      setIncomingCall(null);
      setCallStatus("idle");
    }, 30000);

    callTimeout.current = timeout;
  }, []);

  // ✅ FIX 2: Tách handleSignal ra ngoài
  const handleSignal = useCallback(async (signal) => {
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

        // ✅ FIX: Check stompClient trước khi send
        if (stompClient.current && stompClient.current.connected) {
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
        }
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
  }, []);

  // ✅ FIX 3: Tách handleCallEnded ra ngoài
  const handleCallEnded = useCallback(() => {
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

    if (callTimeout.current) {
      clearTimeout(callTimeout.current);
      callTimeout.current = null;
    }

    setLocalStream(null);
    setRemoteStream(null);
    setCallStatus("idle");
    setIsAudioMuted(false);
    setIsVideoMuted(false);
    setIncomingCall(null);
    setError(null);
  }, [localStream]);

  // Kết nối WebSocket
  useEffect(() => {
    if (!userId || !token) {
      console.log("❌ Missing userId or token:", {
        userId,
        token: token ? "present" : "missing",
      });
      return;
    }

    console.log("🔌 Connecting to WebSocket with userId:", userId);

    try {
      const socket = new SockJS(`http://localhost:8085/ws?token=${token}`);
      const client = Stomp.over(socket);

      // ✅ FIX 4: Tắt debug trong production, bật khi dev
      client.debug =
        process.env.NODE_ENV === "development" ? console.log : null;

      client.connect(
        {
          Authorization: `Bearer ${token}`,
        },
        () => {
          console.log("✅ WebSocket connected for user:", userId);

          // Subscribe to incoming calls
          client.subscribe(`/user/queue/call.incoming`, (message) => {
            console.log("📞 Incoming call RAW:", message.body);
            try {
              const notification = JSON.parse(message.body);
              console.log("📞 Parsed notification:", notification);
              handleIncomingCall(notification);
            } catch (err) {
              console.error("❌ Error parsing incoming call:", err);
            }
          });

          // Subscribe to call initiated
          client.subscribe(`/user/queue/call.initiated`, (message) => {
            console.log("📞 Call initiated:", message.body);
            try {
              const call = JSON.parse(message.body);
              currentCallId.current = call.id;
              console.log("✅ Call ID set:", call.id);
            } catch (err) {
              console.error("❌ Error parsing call initiated:", err);
            }
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
            try {
              const signal = JSON.parse(message.body);
              console.log("📡 Signal received:", signal);
              handleSignal(signal);
            } catch (err) {
              console.error("❌ Error parsing signal:", err);
            }
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
          });

          // Subscribe to errors
          client.subscribe(`/user/queue/errors`, (message) => {
            console.error("❌ Server error:", message.body);
            setError(message.body);
            handleCallEnded();
          });
        },
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

    return () => {
      console.log("🧹 Cleaning up WebSocket connection");
      if (stompClient.current && stompClient.current.connected) {
        stompClient.current.disconnect(() => {
          console.log("Disconnected from WebSocket");
        });
      }

      // Cleanup call resources
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
      if (peerConnection.current) {
        peerConnection.current.close();
      }
      if (callTimeout.current) {
        clearTimeout(callTimeout.current);
      }
    };
  }, [
    userId,
    token,
    handleIncomingCall,
    handleSignal,
    handleCallEnded,
    localStream,
  ]);

  // ✅ FIX 5: Tạo peer connection - tách ra thành function riêng
  const createPeerConnection = useCallback(
    (stream) => {
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
        if (callTimeout.current) {
          clearTimeout(callTimeout.current);
        }
      };

      // Handle ICE candidates
      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          console.log("🧊 Sending ICE candidate");

          // ✅ FIX: Check connection trước khi send
          if (stompClient.current && stompClient.current.connected) {
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
          handleCallEnded();
        } else if (peerConnection.current.connectionState === "disconnected") {
          handleCallEnded();
        }
      };

      // ✅ FIX 6: Thêm ICE connection state handler
      peerConnection.current.oniceconnectionstatechange = () => {
        console.log(
          "🧊 ICE connection state:",
          peerConnection.current.iceConnectionState
        );

        if (peerConnection.current.iceConnectionState === "failed") {
          setError("ICE connection failed");
          handleCallEnded();
        }
      };
    },
    [handleCallEnded]
  );

  // Khởi tạo cuộc gọi
  const initiateCall = useCallback(
    async (calleeId, callerName, callerAvatar, type = "VIDEO") => {
      try {
        console.log(`📞 Initiating ${type} call to:`, calleeId);
        console.log(`📞 Caller info:`, { callerName, callerAvatar });

        // ✅ FIX 7: Check WebSocket connection
        if (!stompClient.current || !stompClient.current.connected) {
          throw new Error("WebSocket not connected");
        }

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

        // Send initiate request
        const payload = {
          calleeId,
          callerName,
          callerAvatar,
          type,
        };

        console.log("📤 Sending call initiate:", payload);

        stompClient.current.send(
          "/app/call.initiate",
          {},
          JSON.stringify(payload)
        );

        console.log("✅ Call initiate message sent");

        // Set timeout
        callTimeout.current = setTimeout(() => {
          console.log("⏰ Call timeout - no answer");
          setError("No answer");
          handleCallEnded();
        }, 30000);
      } catch (err) {
        console.error("❌ Error initiating call:", err);
        setError(err.message || "Failed to access camera/microphone");
        setCallStatus("idle");

        // Cleanup on error
        if (localStream) {
          localStream.getTracks().forEach((track) => track.stop());
          setLocalStream(null);
        }
      }
    },
    [createPeerConnection, handleCallEnded, localStream]
  );

  // Trả lời cuộc gọi
  const answerCall = useCallback(async () => {
    try {
      if (!incomingCall) {
        console.warn("⚠️ No incoming call to answer");
        return;
      }

      console.log("✅ Answering call:", incomingCall.callId);

      if (callTimeout.current) {
        clearTimeout(callTimeout.current);
        callTimeout.current = null;
      }

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

      // Send answer request
      if (stompClient.current && stompClient.current.connected) {
        stompClient.current.send(
          "/app/call.answer",
          {},
          JSON.stringify({
            callId: incomingCall.callId,
            accepted: true,
          })
        );
      }

      setIncomingCall(null);
    } catch (err) {
      console.error("❌ Error answering call:", err);
      setError(err.message || "Failed to access camera/microphone");

      // Reject on error
      if (incomingCall) {
        rejectCall();
      }
    }
  }, [incomingCall, createPeerConnection]);

  // Từ chối cuộc gọi
  const rejectCall = useCallback(() => {
    if (!incomingCall) {
      console.warn("⚠️ No incoming call to reject");
      return;
    }

    console.log("❌ Rejecting call:", incomingCall.callId);

    if (callTimeout.current) {
      clearTimeout(callTimeout.current);
      callTimeout.current = null;
    }

    if (stompClient.current && stompClient.current.connected) {
      stompClient.current.send(
        "/app/call.answer",
        {},
        JSON.stringify({
          callId: incomingCall.callId,
          accepted: false,
        })
      );
    }

    setIncomingCall(null);
    setCallStatus("idle");
  }, [incomingCall]);

  // Hủy cuộc gọi
  const cancelCall = useCallback(() => {
    if (!currentCallId.current) {
      console.warn("⚠️ No call to cancel");
      handleCallEnded();
      return;
    }

    console.log("🚫 Cancelling call:", currentCallId.current);

    if (callTimeout.current) {
      clearTimeout(callTimeout.current);
      callTimeout.current = null;
    }

    if (stompClient.current && stompClient.current.connected) {
      stompClient.current.send(
        "/app/call.cancel",
        {},
        JSON.stringify({
          callId: currentCallId.current,
          reason: "Cancelled by caller",
        })
      );
    }

    handleCallEnded();
  }, [handleCallEnded]);

  // ✅ FIX 8: Gửi offer khi có callId
  useEffect(() => {
    const sendOffer = async () => {
      if (
        callStatus === "calling" &&
        peerConnection.current &&
        currentCallId.current &&
        stompClient.current &&
        stompClient.current.connected
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

          console.log("✅ Offer sent successfully");
        } catch (err) {
          console.error("❌ Error sending offer:", err);
          setError("Failed to create offer");
          handleCallEnded();
        }
      }
    };

    // ✅ Delay nhỏ để đảm bảo call.initiated đã được xử lý
    const timer = setTimeout(sendOffer, 100);
    return () => clearTimeout(timer);
  }, [callStatus, handleCallEnded]);

  // Kết thúc cuộc gọi
  const endCall = useCallback(() => {
    if (!currentCallId.current) {
      console.warn("⚠️ No call to end");
      handleCallEnded();
      return;
    }

    console.log("📴 Ending call:", currentCallId.current);

    if (callTimeout.current) {
      clearTimeout(callTimeout.current);
      callTimeout.current = null;
    }

    if (stompClient.current && stompClient.current.connected) {
      stompClient.current.send(
        "/app/call.end",
        {},
        JSON.stringify({
          callId: currentCallId.current,
          reason: "User ended call",
        })
      );
    }

    handleCallEnded();
  }, [handleCallEnded]);

  // Toggle audio
  const toggleAudio = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioMuted(!audioTrack.enabled);
        console.log(`🎤 Audio ${audioTrack.enabled ? "unmuted" : "muted"}`);
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
        console.log(`📹 Video ${videoTrack.enabled ? "on" : "off"}`);
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
        ?.getSenders()
        .find((s) => s.track && s.track.kind === "video");

      if (sender) {
        await sender.replaceTrack(newVideoTrack);
      }

      const updatedStream = new MediaStream([
        newVideoTrack,
        ...localStream.getAudioTracks(),
      ]);

      setLocalStream(updatedStream);
      console.log("📷 Camera switched");
    } catch (err) {
      console.error("❌ Error switching camera:", err);
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
