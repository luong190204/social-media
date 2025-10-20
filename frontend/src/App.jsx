import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import EditProfile from "./pages/EditProfile";
import ProfilePage from "./pages/ProfilePage";
import Notification from "./pages/Notification";
import MessagesInterface from "./components/messages/MessagesInterface";

import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { UseNotificationStore } from "./store/useNotificationStore";
import { connectNotificationSocket } from "./lib/notificationSocket";
import { toast } from "sonner";
import { connectSocket, disconnectSocket } from "./lib/socket";
import { useChatStore } from "./store/useChatStore";
import MessageToast from "./components/toast/MessageToast";

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  const { addNotification } = UseNotificationStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Realtime message
  useEffect(() => {
    if (!authUser) return;

    connectSocket(authUser.id, (newMessage) => {
      const { selectConversation, conversations, messages, setSelectConversation, fetchConversations } = useChatStore.getState();

      // Kiểm tra xem user hiện tại có đang ở đúng conversation đó không
      const isInCurrentChat = selectConversation && selectConversation.id === newMessage.conversationId;

      const isInMessagePage = location.pathname.startsWith("/messages");

      if (isInCurrentChat && isInMessagePage) {
        // Nếu đang mở đúng cuộc trò chuyện -> realtime tin nhắn
        useChatStore.setState({
          messages: [...messages, newMessage],
        });
      } else {
        toast.custom(
          (t) => (
            <MessageToast
              message={newMessage}
              onClick={() => {
                toast.dismiss(t.id); // tắt toast
                setSelectConversation(
                  conversations.find((c) => c.id === newMessage.conversationId)
                );
                window.location.href = `/messages/${newMessage.conversationId}`;
              }}
            />
          ),
          { duration: 4000 }
        );

        fetchConversations();
      }
    })

    return () => {
      disconnectSocket();
    }
  }, [authUser, location])

  // Realtime notification 
  useEffect(() => {
    if (!authUser) return;

    connectNotificationSocket((newNotification) => {
      addNotification(newNotification);

      toast.success(
        <div
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => navigate("/notification")}
        >
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
        <Route path="/messages/:conversationId" element={<MessagesInterface />} />
        <Route path="/notification" element={<Notification />}/>
      </Route>
      {/* Người dùng đã đăng nhập sẽ không cần truy cập trang Auth */}
      <Route path="/login" element={<Navigate to="/" />} />
      <Route path="/signup" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
