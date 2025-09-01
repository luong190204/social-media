import { postService } from "@/services/postService";
import { toast } from "sonner";
import { create } from "zustand";

export const usePostStore = create((set, get) => ({
  posts: [],
  isPostsLoading: false,
  isCreatePostLoading: false,

  fetchPosts: async () => {
    set({ isPostsLoading: true });
    try {
      const res = await postService.getAllPostByUser();
      set({ posts: res.data.result });
    } catch (error) {
      toast.error("Lỗi khi tải");
    } finally {
      set({ isPostsLoading: false });
    }
  },

  createPost: async (formData) => {
    set({ isCreatePostLoading: true });
    try {
      const res = await postService.createPost(formData);
      set((state) => ({
        posts: [res.data.result, ...state.posts], 
      }));
    } catch (error) {
      toast.error("Lỗi đăng bài viết");
    } finally {
      set({ isCreatePostLoading: false });
    }
  },
}));