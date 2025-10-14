import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import EditProfile from "./pages/editProfile";
import ProfilePage from "./pages/ProfilePage";
import Notification from "./pages/Notification";
import MessagesInterface from "./components/messages/MessagesInterface";

import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { UseNotificationStore } from "./store/useNotificationStore";
import { connectNotificationSocket, disconnectNotificationSocket } from "./lib/notificationSocket";
import { toast } from "sonner";

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  const { addNotification } = UseNotificationStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Realtime notification 
  useEffect(() => {
    if (!authUser) return;

    connectNotificationSocket((newNotification) => {
      addNotification(newNotification);

      toast.success(
        <div className="flex items-center space-x-3">
          <img
            src={newNotification.senderAvatar || "/assets/avatar.jpg"}
            alt="avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-sm">
              {newNotification.senderName}
            </p>
            <p className="text-xs text-gray-600">{newNotification.message}</p>
          </div>
        </div>,
        { duration: 4000 }
      );
    });

    return () => disconnectNotificationSocket();
  }, [authUser]);

  // Hiển thị Loader nếu đang trong quá trình kiểm tra
  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  // Nếu đã kiểm tra xong và không có authUser, chuyển hướng về trang login
  if (!authUser) {
    return (
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Route>
        {/* Đảm bảo người dùng chưa đăng nhập không thể truy cập các trang chính */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  // Nếu đã kiểm tra xong và có authUser, hiển thị layout chính
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/:userId" element={<ProfilePage />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/messages" element={<MessagesInterface />} />
        <Route path="/notification" element={<Notification />}/>
      </Route>
      {/* Người dùng đã đăng nhập sẽ không cần truy cập trang Auth */}
      <Route path="/login" element={<Navigate to="/" />} />
      <Route path="/signup" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
