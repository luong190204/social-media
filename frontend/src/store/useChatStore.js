import { chatService } from "@/services/chatService";
import { toast } from "sonner";
import { create } from "zustand";

export const useChatStore = create((set, get) => ({
  conversations: [],
  messages: [],
  selectConversation: null,
  isMessagesLoading: false,

  searchResult: [],
  isSearching: false,
  createConversations: async (participantIds) => {
    try {
      const res = await chatService.createConversation(participantIds);

      const newConversation = res.data.result;

      set((state) => ({
        conversations: [
          ...state.conversations.filter((c) => c.id !== newConversation.id),
          newConversation,
        ],
        selectConversation: newConversation,
      }));

      return newConversation;
    } catch (error) {
      toast.error("Lỗi khi tạo cuộc trò chuyện");
    }
  },

  setSelectConversation: (conv) => set({ selectConversation: conv }),

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

      // Không cần phải push vào state nữa vì Tin nhắn đã được socket trả về
      // set((state) => ({
      //   messages: [...state.messages, res.data.result],
      // }));
    } catch (error) {
      console.error("Send message error:", error);
      toast.error("Lỗi khi gửi tin nhắn!");
      throw error;
    }
  },

  sendImageMessage: async ({ conversationId, senderId, file }) => {
    try {
      const res = await chatService.sendImageMessage(
        conversationId,
        senderId,
        file
      );

      // set((state) => ({
      //   messages: [...state.messages, res.data.result],
      // }));
    } catch (error) {
      toast.error("Lỗi khi gửi ảnh!");
    }
  },

  markConversationAsRead: async (conversationId) => {
    // Update UI ngay lập tức
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId ? { ...conv, unReadCount: 0 } : conv
      ),
    }));

    try {
      await chatService.markConversationAsRead(conversationId);
    } catch (error) {
      console.error("Mark as read error:", error);
      get().fetchConversations(); // Đồng bộ lại nếu có lỗi
    }
  },

  searchUsers: async (username) => {
    if (!username.trim()) {
      set({ searchResult: []})
      return;
    }

    set({ isSearching: true })
    try {
      const res = await chatService.searchUsers(username);
      set({ searchResult: res.data.result || [] });
    } catch (error) {
      console.log("Lỗi khi tìm kiếm người dùng");
      set({ searchResult: [] });
    } finally {
      set({ isSearching: false });
    }
  },
}));