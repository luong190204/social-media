import { chatService } from "@/services/chatService";
import { toast } from "sonner";
import { create } from "zustand";

export const useChatStore = create((set) => ({
  conversations: [],
  messages: [],
  selectConversation: null,
  isMessagesLoading: false,

  fetchConversations: async () => {
    try {
      const res = await chatService.fetchConversations();
      set({ conversations: res.data.result });
    } catch (error) {
      toast.error("Lỗi khi tải cuộc trò chuyện");
    }
  },

  fetchMessages: async (conversation) => {
    set({ isMessagesLoading: true });
    try {
      const res = await chatService.fetchMessages(conversation.id);
      set({
        messages: res.data.result.content || [], // Chỉ lấy array content
        selectConversation: conversation, // Lưu thẳng object
      });
    } catch (error) {
      toast.error("Lỗi khi tải tin nhắn");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendTextMessage: async ({ conversationId, senderId, content }) => {
    try {
      const res = await chatService.sendTextMessage({
        conversationId,
        senderId,
        content,
      });

      set((state) => ({
        messages: [...state.messages, res.data.result],
      }));
    } catch (error) {
      console.error("Send message error:", error);
      toast.error("Lỗi khi gửi tin nhắn!");
      throw error;
    }
  },

  sendImageMessage: async (conversationId, senderId, file) => {
    try {
      const res = await chatService.sendImageMessage({
        conversationId,
        senderId,
        file,
      });

      set((state) => ({
        messages: [...state.messages, res.data.result],
      }));
    } catch (error) {
      toast.error("Lỗi khi gửi ảnh!");
    }
  },
}));