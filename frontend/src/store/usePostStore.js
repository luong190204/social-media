import { postService } from "@/services/postService";
import { toast } from "sonner";
import { create } from "zustand";

export const usePostStore = create((set, get) => ({
  posts: [],
  isPostsLoading: false,
  isCreatePostLoading: false,
  isUpdatePostLoading: false,

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

      return res.data.result;
    } catch (error) {
      toast.error("Lỗi đăng bài viết");
    } finally {
      set({ isCreatePostLoading: false });
    }
  },

  updatePost: async (postId, data) => {
    set({ isUpdatePostLoading: true });
    try {
      const res = await postService.updatePost(postId, data);

      set((state) => ({
        posts: state.posts.map((p) =>
          p.id === postId
            ? {
                ...p, // Giữ nguyên thông tin cũ
                ...res.data, // Override với data mới
                author: p.author, // Đảm bảo giữ nguyên author
              }
            : p
        ),
      }));

      return res.data;
    } catch (error) {
      toast.error("Lỗi chỉnh sửa bài viết");
    } finally {
      set({ isUpdatePostLoading: false });
    }
  },
}));