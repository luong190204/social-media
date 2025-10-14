import { Compass, Heart, Home, MessageCircle, PlusSquare, Search, User, Video } from "lucide-react";

// Dùng cho LeftSidebar (desktop)
export const sidebarItems = [
  { id: "home", label: "Trang chủ", icon: Home, path: "/" },
  { id: "search", label: "Tìm kiếm", icon: Search, action: "search" },
  { id: "explore", label: "Khám phá", icon: Compass, path: "/explore" },
  { id: "reels", label: "Reels", icon: Video, path: "/reels" },
  { id: "messages", label: "Tin nhắn", icon: MessageCircle, path: "/messages", hasBadge: true },
  { id: "notifications", label: "Thông báo", icon: Heart, path: "/notification" , action: "notifications", hasBadge: true },
  { id: "create", label: "Tạo", icon: PlusSquare, action: "create" },
  { id: "profile", label: "Trang cá nhân", icon: User, path: "/profile", isAvatar: true },
];

// Dùng cho BottomNavigation (mobile)
export const bottomNavItems = [
  { id: "home", icon: Home, path: "/" },
  { id: "explore", icon: Compass, path: "/explore" },
  { id: "reels", icon: Video, path: "/reels" },
  { id: "create", icon: PlusSquare, action: "create" },
  { id: "messages", icon: MessageCircle, path: "/messages", hasBadge: true },
  { id: "profile", icon: User, path: "/profile", isAvatar: true },
];