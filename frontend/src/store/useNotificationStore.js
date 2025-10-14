import { notificationService } from "@/services/notificationService";
import { create } from "zustand";

export const UseNotificationStore = create((set, get) => ({
    notifications: [],
    isLoading: false,

    fetchNotifications: async () => {
        set({ isLoading: true });
        try {
            const res = notificationService.getUserNotifications();
            set({ notifications: (await res).data.result, isLoading: false });
        } catch (error) {
            console.log("Lỗi khi tải thông báo", error);
            set({ isLoading: false })
        }
    },

    // Thêm 1 thông báo realtime
    addNotification: (notification) => {
        set((state) => ({
            notifications: [notification, ...state.notifications]
        }));
    },

    // đánh dấu đã đọc 1 thông báo
    markAsRead: async (notificationId) => {
        try {
            await notificationService.markAsRead(notificationId);
            set((state) => ({
                notifications: state.notifications.map((n) => 
                    n.id === notificationId ? { ...n, isRead: true } : n
                ),
            }))
        } catch (error) {
            console.log("Lỗi khi đã xem hết thông báo", error);
        }
    },

    // đánh dấu đọc tất cả thông báo
    markAllAsRead: async () => {
        const unRead = get().notifications((n) => !n.isRead);
        for (const n of unRead) {
            await get().markAsRead(n.id);
        }
    }
}))