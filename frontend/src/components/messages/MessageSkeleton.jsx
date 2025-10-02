import React from 'react'

const MessageSkeleton = () => {
  const skeletonMessages = Array(5).fill(null);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {skeletonMessages.map((_, idx) => (
        <div
          key={idx}
          className={`flex items-start gap-3 ${
            idx % 2 === 0 ? "justify-start" : "justify-end"
          }`}
        >
          {/* Avatar - hiển thị bên trái cho tin nhắn chẵn */}
          {idx % 2 === 0 && (
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse flex-shrink-0" />
          )}

          <div
            className={`flex flex-col gap-1 ${
              idx % 2 === 0 ? "items-start" : "items-end"
            }`}
          >
            {/* Header skeleton */}
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />

            {/* Message bubble skeleton */}
            <div className="h-16 w-[200px] bg-gray-200 rounded-lg animate-pulse" />
          </div>

          {/* Avatar - hiển thị bên phải cho tin nhắn lẻ */}
          {idx % 2 !== 0 && (
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse flex-shrink-0" />
          )}
        </div>
      ))}
    </div>
  );
};

export default MessageSkeleton;
