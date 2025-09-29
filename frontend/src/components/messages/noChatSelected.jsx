import { MoreVertical } from 'lucide-react';
import React from 'react'

const noChatSelected = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <div className="w-24 h-24 border-2 border-gray-300 rounded-full flex items-center justify-center mb-6">
        <MoreVertical className="w-8 h-8 text-gray-300" />
      </div>
      <h3 className="text-xl font-semibold mb-2">Tin nhắn của bạn</h3>
      <p className="text-gray-500 text-center mb-6">
        Gửi ảnh và tin nhắn riêng tư cho bạn bè hoặc nhóm
      </p>
      <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
        Gửi tin nhắn
      </button>
    </div>
  );
}

export default noChatSelected
