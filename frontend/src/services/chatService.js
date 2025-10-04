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
    },

    sendTextMessage: async (data) => {
        console.log("Payload gửi đi:", data);
        return await axiosInstance.post("/messages/text", data, {
          headers: { "Content-Type": "application/json" },
        });
    },

    sendImageMessage: async (conversationId, senderId, file) => {
        const formData = new FormData();
        formData.append("conversationId", conversationId);
        formData.append("senderId", senderId);
        formData.append("image", file);

        return await axiosInstance.post("/messages/image", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        });
    }
}