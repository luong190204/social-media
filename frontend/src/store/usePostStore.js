import { postService } from "@/services/postService";
import { toast } from "sonner";
import { create } from "zustand";

export const usePostStore = create((set) => ({
    posts: [],
    isPostsLoading: false,

    getPosts: async () => {
        set({ isPostsLoading: true })
        try {
            const res = await postService.getAllPost();
            set({ posts: res.data })
        } catch (error) {
            toast.error("Lỗi khi tải")
        } finally {
            set ({ isPostsLoading: false })
        }
    }
}))