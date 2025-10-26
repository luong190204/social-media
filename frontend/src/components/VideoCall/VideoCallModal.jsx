import React, { useRef, useEffect } from "react";
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  SwitchCamera,
  X,
} from "lucide-react";
import "./VideoCallModal.css";

const VideoCallModal = ({
  localStream,
  remoteStream,
  incomingCall,
  callStatus,
  error,
  isAudioMuted,
  isVideoMuted,
  onAnswer,
  onReject,
  onEnd,
  onCancel,
  toggleAudio,
  toggleVideo,
  switchCamera,
}) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // Set local video stream
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // Set remote video stream
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // Don't render if idle
  if (callStatus === "idle" && !incomingCall) {
    return null;
  }

  return (
    <div className="video-call-modal">
      <div className="video-call-container">
        {/* Incoming call notification */}
        {incomingCall && callStatus === "ringing" && (
          <div className="incoming-call-notification">
            <div className="caller-info">
              {incomingCall.callerAvatar ? (
                <img
                  src={incomingCall.callerAvatar}
                  alt={incomingCall.callerName}
                  className="caller-avatar"
                />
              ) : (
                <div className="caller-avatar-placeholder">
                  {incomingCall.callerName?.charAt(0)?.toUpperCase()}
                </div>
              )}
              <h2>{incomingCall.callerName}</h2>
              <p>Incoming {incomingCall.type.toLowerCase()} call...</p>
            </div>

            <div className="incoming-call-actions">
              <button className="answer-button" onClick={onAnswer}>
                <Phone size={24} />
                <span>Answer</span>
              </button>

              <button className="reject-button" onClick={onReject}>
                <PhoneOff size={24} />
                <span>Decline</span>
              </button>
            </div>
          </div>
        )}

        {/* Video streams */}
        {(callStatus === "calling" ||
          callStatus === "connecting" ||
          callStatus === "ongoing") && (
          <div className="video-streams">
            {/* Remote video (main) */}
            <div className="remote-video-container">
              {remoteStream ? (
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="remote-video"
                />
              ) : (
                <div className="video-placeholder">
                  <div className="spinner"></div>
                  <p>
                    {callStatus === "calling" && "Calling..."}
                    {callStatus === "connecting" && "Connecting..."}
                    {callStatus === "ongoing" && "Waiting for video..."}
                  </p>
                </div>
              )}
            </div>

            {/* Local video (small) */}
            {localStream && (
              <div className="local-video-container">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="local-video"
                />
                {isVideoMuted && (
                  <div className="video-muted-overlay">
                    <VideoOff size={24} />
                  </div>
                )}
              </div>
            )}

            {/* Call controls */}
            <div className="call-controls">
              <div className="control-buttons">
                {/* Toggle Audio */}
                <button
                  className={`control-button ${isAudioMuted ? "muted" : ""}`}
                  onClick={toggleAudio}
                  title={isAudioMuted ? "Unmute" : "Mute"}
                >
                  {isAudioMuted ? <MicOff size={20} /> : <Mic size={20} />}
                </button>

                {/* Toggle Video */}
                <button
                  className={`control-button ${isVideoMuted ? "muted" : ""}`}
                  onClick={toggleVideo}
                  title={isVideoMuted ? "Turn on camera" : "Turn off camera"}
                >
                  {isVideoMuted ? <VideoOff size={20} /> : <Video size={20} />}
                </button>

                {/* Switch Camera (mobile) */}
                {/Mobi|Android/i.test(navigator.userAgent) && (
                  <button
                    className="control-button"
                    onClick={switchCamera}
                    title="Switch camera"
                  >
                    <SwitchCamera size={20} />
                  </button>
                )}

                {/* End/Cancel Call */}
                <button
                  className="control-button end-call"
                  onClick={callStatus === "calling" ? onCancel : onEnd}
                  title="End call"
                >
                  <PhoneOff size={20} />
                </button>
              </div>

              {/* Call duration or status */}
              <div className="call-status-text">
                {callStatus === "calling" && "Ringing..."}
                {callStatus === "connecting" && "Connecting..."}
                {callStatus === "ongoing" && <CallDuration />}
              </div>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="error-message">
            <X size={16} />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Component to show call duration
const CallDuration = () => {
  const [duration, setDuration] = React.useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs.toString().padStart(2, "0")}:${mins
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return <span>{formatDuration(duration)}</span>;
};

export default VideoCallModal;
