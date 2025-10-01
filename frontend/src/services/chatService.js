import { axiosInstance } from "@/lib/axios"

export const chatService = {
    fetchConversations: async () => {
        return await axiosInstance.get("/conversations");
    },

    // TODO: implement later
    createConversation: async () => {

    },

    fetchMessages: async (conversationId) => {
        return await axiosInstance.get(
          `/messages/conversations/${conversationId}/messages`
        );
    }
}