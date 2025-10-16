import { notificationService } from "@/services/notificationService";
import { toast } from "sonner";
import { create } from "zustand";

export const UseNotificationStore = create((set, get) => ({
    notifications: [],
    page: 0,
    size: 10,
    totalPages: 1,
    isLoading: false,

    fetchNotifications: async (reset = false) => {
        const { notifications, page, size, totalPages, isLoading } = get();

        if (isLoading || (page >= totalPages && !reset)) return;
        set({ isLoading: true });

        try {
            const res = await notificationService.getUserNotifications(page, size);

            const data = res.data.result;

            set({
              notifications: reset
                ? data.content
                : [...notifications, ...data.content],
              totalPages: data.totalPages,
              page: reset ? 1 : page + 1,
              isLoading: false,
            });
            
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
                    n.id === notificationId ? { ...n, read: true } : n
                ),
            }))
        } catch (error) {
            console.log("Lỗi khi đã xem hết thông báo", error);
        }
    },

    // đánh dấu đọc tất cả thông báo
    markAllAsRead: async () => {
        try {
            await notificationService.markAllAsRead();
            set((state) => ({
                notifications: state.notifications.map((n) => ({ ...n, read: true }))
            }));
        } catch (error) {
            console.log(error);
        }
    }
}))