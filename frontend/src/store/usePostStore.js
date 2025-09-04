import { postService } from "@/services/postService";
import { toast } from "sonner";
import { create } from "zustand";

export const usePostStore = create((set, get) => ({
  posts: [],
  isPostsLoading: false,
  isCreatePostLoading: false,
  isUpdatePostLoading: false,
  isDeletePostLoading: false,

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

  deletePost: async (postId) => {
    set({ isDeletePostLoading: true });
    try {
      await postService.deletePost(postId);

      set((state) => ({
        posts: state.posts.filter((p) => p.id !== postId),
      }));

      toast.success("Xóa bài viết thành công!");
    } catch (error) {
      toast.error("Xóa bài viết không thành công!");
    } finally {
      set({ isDeletePostLoading: false });
    }
  },

  toggleLikePost: async (postId) => {
    try {
      const res = await postService.toggleLikePost(postId);
      const { postId: id, totalLikes, likeByMe } = res.data.result;

      set((state) => ({
        posts: state.posts.map((p) =>
          p.id === id ? { ...p, totalLikes, likeByMe: likeByMe } : p
        ),
      }));
    } catch (error) {
      throw error;
    }
  },
}));