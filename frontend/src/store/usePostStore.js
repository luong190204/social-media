import { postService } from "@/services/postService";
import { toast } from "sonner";
import { create } from "zustand";

export const usePostStore = create((set) => ({
    posts: [],
    isPostsLoading: false,

    fetchPosts: async () => {
        set({ isPostsLoading: true })
        try {
            const res = await postService.getAllPostByUser();
            set({ posts: res.data.result });
        } catch (error) {
            toast.error("Lỗi khi tải")
        } finally {
            set ({ isPostsLoading: false })
        }
    }
}))