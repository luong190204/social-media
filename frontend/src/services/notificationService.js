import { axiosInstance } from "@/lib/axios"

export const notificationService = {
    getUserNotifications: async (page = 0, size = 8) => {
        return await axiosInstance.get(`/notifications`, {
            params: {page, size}
        });
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