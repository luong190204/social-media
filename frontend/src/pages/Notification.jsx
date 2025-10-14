import { connectNotificationSocket, disconnectNotificationSocket } from '@/lib/notificationSocket';
import { UseNotificationStore } from '@/store/useNotificationStore'
import React, { useEffect } from 'react'
import { toast } from 'sonner';

const Notification = () => {

    const {
      notifications,
      fetchNotifications,
      markAsRead,
      isLoading,
    } = UseNotificationStore();

    useEffect(() => {
      // Load thông báo
      fetchNotifications();
  
    }, []);

  return (
    <div className="relative">
      <button onClick={() => console.log(notifications)
      }>vvv</button>
      <button className="relative">
        Thông báo
        {notifications.some((n) => !n.read) && (
          <span className="absolute top-0 w-2 h-2 bg-red-500 rounded-full"></span>
        )}
      </button>

      <div className="absolute bg-white shadow-md rounded-lg w-64 p-3">
        {isLoading ? (
          <p className="text-gray-400 text-sm">Đang tải...</p>
        ) : notifications.length === 0 ? (
          <p className="text-gray-500 text-sm">Không có thông báo mới</p>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`p-2 border-b text-sm cursor-pointer ${
                !n.isRead ? "bg-gray-100" : ""
              }`}
              onClick={() => markAsRead(n.id)}
            >
              <p>{n.message}</p>
              <span className="text-xs text-gray-400">{n.type}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Notification
