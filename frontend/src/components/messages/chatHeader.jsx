import { Info, MessageCircle, Phone, Video } from "lucide-react";

export default function ChatHeader({ user }) {
  const Avatar = ({ src, name, size = "md" }) => {
    const sizeClasses = {
      sm: "w-8 h-8",
      md: "w-12 h-12",
      lg: "w-16 h-16",
    };

    const initial = name?.charAt(0).toUpperCase() || "?";

    return (
      <div
        className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-200 flex items-center justify-center`}
      >
        {src ? (
          <img src={src} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-600 font-medium">{initial}</span>
        )}
      </div>
    );
  };

  return (
    <div className="flex items-center justify-between p-4 border-b bg-white">
      <div className="flex items-center">
        <Avatar src={user?.avatar} name={user?.name} size="sm" />
        <div className="ml-3">
          <h3 className="font-medium">{user?.name}</h3>
          <p className="text-xs text-gray-500">{user?.name?.toLowerCase()}</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Phone className="w-5 h-5 text-gray-600 cursor-pointer hover:text-blue-500" />
        <Video className="w-5 h-5 text-gray-600 cursor-pointer hover:text-blue-500" />
        <Info className="w-5 h-5 text-gray-600 cursor-pointer hover:text-blue-500" />
      </div>
    </div>
  );
}
