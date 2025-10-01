import { chatService } from "@/services/chatService";
import { toast } from "sonner";
import { create } from "zustand";

export const useChatStore = create((set) => ({
  conversations: [],
  messages: [],
  selectConversation: null,

  fetchConversations: async () => {
    try {
      const res = await chatService.fetchConversations();
      set({ conversations: res.data.result });
    } catch (error) {
      toast.error("Lỗi khi tải cuộc trò chuyện");
    }
  },

  fetchMessages: async (conversation) => {
    try {
      const res = await chatService.fetchMessages(conversation.id);
      set({
        messages: res.data.result,
        selectConversation: conversation, // Lưu thẳng object
      });
    } catch (error) {
      toast.error("Lỗi khi tải tin nhắn");
    }
  },
}));