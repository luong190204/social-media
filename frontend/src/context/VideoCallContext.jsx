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

  // Load ngay khi mount
  useEffect(() => {
    // Load token from localStorage
    const storedToken = localStorage.getItem("token");

    if (storedToken && authUser) {
      setToken(storedToken);
      setUser(authUser);

      // ✅ LOG để check
      console.log("🔵 VideoCallProvider initialized:");
      console.log("   - User ID:", authUser?.id);
      console.log("   - User Name:", authUser?.fullName);
      console.log("   - Token:", storedToken ? "present" : "missing");
    } else {
      console.warn("⚠️ VideoCallProvider - Missing auth data");
    }
  }, [authUser]);

  // ✅ Log khi user/token thay đổi
  useEffect(() => {
    if (user?.id && token) {
      console.log("🟢 VideoCallProvider ready for user:", user.id);
    }
  }, [user, token]);

  const webRTC = useWebRTC(user?.id, token);

  const initiateVideoCall = (targetUser) => {
    console.log("🎥 Initiating video call to:", targetUser);
    console.log("🎥 Current user:", user);

    if (!user?.id) {
      console.error("❌ No user ID available");
      return;
    }

    // ✅ Lấy đúng targetUser.id
    const calleeId = targetUser.id || targetUser.partnerId;

    if (!calleeId) {
      console.error("❌ Invalid target user:", targetUser);
      return;
    }

    webRTC.initiateCall(
      calleeId,
      user?.fullName || "Unknown",
      user?.profilePic || null,
      "VIDEO"
    );
  };

  const initiateAudioCall = (targetUser) => {
    console.log("📞 Initiating audio call to:", targetUser);

    if (!user?.id) {
      console.error("❌ No user ID available");
      return;
    }

    const calleeId = targetUser.id || targetUser.partnerId;

    if (!calleeId) {
      console.error("❌ Invalid target user:", targetUser);
      return;
    }

    webRTC.initiateCall(
      calleeId,
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