import { postService } from "@/services/postService";
import { toast } from "sonner";
import { create } from "zustand";

export const useCommentStore = create((set) => ({
  commentsByPost: {}, // {"postId: [comments...], ...."}
  repliesByComment: {},
  isCommentLoading: false,

  fetchCommentByPost: async (postId) => {
    set({ isCommentPostLoading: true });

    try {
      const res = await postService.fetchCommentByPost(postId);
      set((state) => ({
        commentsByPost: {
          ...state.commentsByPost,
          [postId]: res.data.result.content,
        },
      }));
    } catch (error) {
      toast.error("Lỗi khi tải");
      set({ isCommentLoading: false });
    }
  },

  commentPost: async (postId, data) => {
    set({ isCommentLoading: true });

    try {
      const res = await postService.commentPost(postId, data);
      const newComment = res.data.result;

      set((state) => ({
        commentsByPost: {
          ...state.commentsByPost,
          [postId]: [newComment, ...(state.commentsByPost[postId] || [])],
        },
        isCommentLoading: false,
      }));
      toast.success("Bình luận thành công!");

      return newComment;
    } catch (error) {
      toast.error("Lỗi khi bình luận");
      set({ isCommentLoading: false });
    }
  },

  fetchRepliesByComment: async (commentId) => {
    console.log("Fetching replies for commentId:", commentId);
    try {
      const res = await postService.fetchRepliesByComment(commentId);
      console.log("Check res:", res); // log toàn bộ
      console.log("Check res.data:", res.data.result);
      set((state) => ({
        repliesByComment: {
          ...state.repliesByComment,
          [commentId]: {
            items: res.data.result.content || [],
            total: res.data.result.totalElements || 0,
          },
        },
      }));
    } catch (error) {
      console.error("Lỗi khi fetch replies:", error);
    }
  },
  
}));
