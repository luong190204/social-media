import { useAuthStore } from '@/store/useAuthStore';
import { useChatStore } from '@/store/useChatStore';
import { Camera, Heart, Send, Smile, X } from 'lucide-react';
import React, { useRef, useState } from 'react'

const ChatInput = ({ selectConversation  }) => {
  const { authUser } = useAuthStore();
  const { sendTextMessage, sendImageMessage } = useChatStore();

  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const [isSending, setIsSending] = useState(false); // Thêm loading state

  const handleSendText = async () => {
    if (!text.trim() || isSending) return;

    setIsSending(true);
    
    try {
      await sendTextMessage({
        conversationId: selectConversation.id,
        senderId: authUser.id,
        content: text,
      });
      setText("");
    } catch (error) {
      // Error đã được xử lý trong store
      console.error("Failed to send text:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleSendImage = async () => {
    if (!imageFile) return;

    await sendImageMessage(selectConversation.id, authUser.id, imageFile);

    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSending) return;

    if (imageFile) {
      await handleSendImage();
    } else if (text.trim()) {
      await handleSendText();
    }
  };

  // Chọn file ảnh
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t bg-white">
      <div className="p-4">
        {imagePreview && (
          <div className="mb-3 flex items-center gap-2">
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-lg border border-gray-500"
              />
              <button
                type="button"
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center bg-gray-200 hover:bg-gray-300"
                onClick={() => {
                  setImagePreview(null);
                  setImageFile(null);
                }}
              >
                <X className="size-3" />
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex items-center space-x-3">
          <Camera
            className={`w-6 h-6 text-gray-600 cursor-pointer hover:text-blue-500 ${
              isSending ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => !isSending && fileInputRef.current.click()}
          />
          <div className="flex-1 relative">
            <input
              type="file"
              ref={fileInputRef}
              hidden
              onChange={handleFileChange}
              accept="image/*"
              disabled={isSending}
            />

            <div className="flex-1 relative">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhắn tin..."
                disabled={isSending}
                className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 break-words pr-16"
              />
            </div>

            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
              <Smile className="w-5 h-5 text-gray-400 cursor-pointer hover:text-blue-500" />
              {text.trim() || imageFile ? (
                <button type="submit" disabled={isSending}>
                  <Send
                    className={`w-5 h-5 ${
                      isSending ? "text-gray-400" : "text-blue-500"
                    } cursor-pointer`}
                  />
                </button>
              ) : (
                <Heart className="w-5 h-5 text-gray-400 cursor-pointer hover:text-red-500" />
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChatInput
