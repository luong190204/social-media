import { useWebRTC } from "@/hooks/useWebRTC";
import { useAuthStore } from "@/store/useAuthStore";
import { createContext, useContext, useState, useEffect } from "react";

const VideoCallContext = createContext();

export const useVideoCall = () => {
  const context = useContext(VideoCallContext);
  if (!context) {
    throw new Error("useVideoCall must be used within VideoCallProvider");
  }
  return context;
};

export const VideoCallProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    const { authUser } = useAuthStore();

    // Load token from localStorage 
    useEffect(() => {
        const storedToken = localStorage.getItem("token");

        if (storedToken && authUser) {
          setToken(storedToken);
          setUser(authUser);
        }
    }, [authUser]);

    const webRTC = useWebRTC(user?.id, token);

    const initiateVideoCall = (targetUser) => {
      webRTC.initiateCall(
        targetUser.id,
        user?.fullName || "Unknown",
        user?.profilePic || null,
        "VIDEO"
      );
    };

    const initiateAudioCall = (targetUser) => {
      webRTC.initiateCall(
        targetUser.id,
        user?.fullName || "Unknown",
        user?.profilePic || null,
        "AUDIO"
      );
    };

    return (
      <VideoCallContext.Provider
        value={{
          ...webRTC,
          initiateVideoCall,
          initiateAudioCall,
          currentUser: user,
        }}
      >
        {children}
      </VideoCallContext.Provider>
    );
};