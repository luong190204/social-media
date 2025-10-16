import { feedService } from "@/services/feedService";
import { create } from "zustand";

export const useFeedStore = create((set, get) => ({
    feedPosts: [],
    page: 0,
    totalPages: 1,
    isLoading: false,

    fetchFeedPosts: async (reset = false) => {
        const { feedPosts, page, isLoading } = get();
        if (isLoading) return;

        set({ isLoading: true })

        try {
            const res = await feedService.getFeed(page, 10);
            const data = res.data.result;

            set({
              feedPosts: reset ? data.content : [...feedPosts, ...data.content],
              page: page + 1,
              totalPages: data.totalPages,
              isLoading: false,
            });
        } catch (error) {
            console.log("Lỗi khi tải feed:", error);
            set({ isLoading: false });
        }
    }
}))