import { UseNotificationStore } from '@/store/useNotificationStore'
import { ArrowLeft, Bell } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Notification = () => {
  const navigate = useNavigate();

  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);


    const {
      notifications,
      fetchNotifications,
      markAsRead,
      markAllAsRead,
    } = UseNotificationStore();

    useEffect(() => {
      // Load thông báo
      const loadInitial = async () => {
        setIsInitialLoading(true);
        await fetchNotifications(true); // true = reset
        setIsInitialLoading(false);
      };
      loadInitial();
    }, []);

  const handleScroll = async (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;

    if (
      scrollHeight - scrollTop <= clientHeight + 50 &&
      !isFetchingMore &&
      !isInitialLoading
    ) {
      setIsFetchingMore(true);
      await fetchNotifications(false); // false = load thêm
      setIsFetchingMore(false);
    }
  };
  // const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationClick = (id) => {
    markAsRead(id);
  }

  const handleAllNotificationClick = () => {
    markAllAsRead();
  }

  const handleGoBack = () => {
    navigate(-1); // Quay lại trang trước đó
  };

  

  return (
    <div className="fixed inset-0 flex items-end justify-end bg-black/30 z-50">
      <div
        className="bg-white w-full h-full sm:h-[100vh] sm:max-w-md sm:rounded-tl-2xl sm:shadow-lg
        overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
          <div className="flex items-center px-4 py-3">
            <button
              onClick={handleGoBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors -ml-2"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold ml-4">Thông báo</h1>
          </div>
        </div>

        {/* Notification Content */}
        <div
          className="overflow-y-auto h-[calc(100vh-57px)]"
          onScroll={handleScroll}
        >
          {isInitialLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-6">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Bell className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Không có thông báo</h2>
              <p className="text-gray-500 text-center">
                Khi có người thích hoặc bình luận về bài viết của bạn, bạn sẽ
                thấy ở đây.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {/* Section: Mới */}
              {notifications.some((n) => !n.read) && (
                <div>
                  <div className="px-4 py-3">
                    <h2 className="font-semibold text-base">Mới</h2>
                  </div>
                  {notifications
                    .filter((n) => !n.read)
                    .map((n) => (
                      <div
                        key={n.id}
                        className="flex items-start px-4 py-3 hover:bg-gray-50 cursor-pointer active:bg-gray-100 transition-colors"
                        onClick={() => handleNotificationClick(n.id)}
                      >
                        {/* Avatar */}
                        {n.senderAvatar ? (
                          <img
                            src={n.senderAvatar}
                            alt={n.senderName}
                            className="w-11 h-11 rounded-full object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-11 h-11 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex-shrink-0 flex items-center justify-center text-white font-semibold">
                            {n.senderName?.charAt(0) || "?"}
                          </div>
                        )}

                        {/* Content */}
                        <div className="ml-3 flex-1 min-w-0">
                          <p className="text-sm leading-5">{n.message}</p>
                          <p className="text-gray-500 text-xs mt-1">
                            {new Date(n.createdAt).toLocaleDateString("vi-VN", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>

                        {/* Unread indicator */}
                        <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-2 flex-shrink-0"></div>
                      </div>
                    ))}

                  <div
                    className="flex items-end text-xs leading-5 text-gray-700 pl-4 pt-4 cursor-pointer"
                    onClick={handleAllNotificationClick}
                  >
                    Đánh dấu đã đọc tất cả
                  </div>
                </div>
              )}

              {/* Section: Trước đó */}
              {notifications.some((n) => n.read) && (
                <div>
                  <div className="px-4 py-3">
                    <h2 className="font-semibold text-base">Trước đó</h2>
                  </div>
                  {notifications
                    .filter((n) => n.read)
                    .map((n) => (
                      <div
                        key={n.id}
                        className="flex items-start px-4 py-3 hover:bg-gray-50 cursor-pointer active:bg-gray-100 transition-colors"
                        onClick={() => handleNotificationClick(n.id)}
                      >
                        {/* Avatar placeholder */}
                        {n.senderAvatar ? (
                          <img
                            src={n.senderAvatar}
                            alt={n.senderName}
                            className="w-11 h-11 rounded-full object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-11 h-11 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex-shrink-0 flex items-center justify-center text-white font-semibold">
                            {n.senderName?.charAt(0) || "?"}
                          </div>
                        )}

                        {/* Content */}
                        <div className="ml-3 flex-1 min-w-0">
                          <p className="text-sm leading-5">{n.message}</p>
                          <p className="text-gray-500 text-xs mt-1">
                            {new Date(n.createdAt).toLocaleDateString("vi-VN", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                          {/* <p className="text-gray-500 text-xs mt-1">{n.type}</p> */}
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {/* Loading khi scroll xuống */}
              {isFetchingMore && (
                <div className="flex items-center justify-center py-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400"></div>
                  <span className="ml-2 text-sm text-gray-500">
                    Đang tải thêm...
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Notification
