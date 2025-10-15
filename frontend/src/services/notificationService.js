import { axiosInstance } from "@/lib/axios"

export const notificationService = {
    getUserNotifications: async () => {
        return await axiosInstance.get("/notifications");
    },

    markAsRead: async (notificationId) => {
        return await axiosInstance.post(
          `/notifications/${notificationId}/read`
        );
    },

    markAllAsRead: async () => {
        return await axiosInstance.post("/notifications/read-all")
    }
}