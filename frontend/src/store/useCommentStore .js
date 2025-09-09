import { postService } from "@/services/postService";
import { toast } from "sonner";
import { create } from "zustand";

export const useCommentStore = create((set) => ({
  commentsByPost: {}, // {"postId: [comments...], ...."}
  repliesByComment: {},
  isCommentLoading: false,
  isRepliesLoading: false,

  fetchCommentByPost: async (postId, page = 0, size = 8) => {
    set({ isCommentLoading: true });

    try {
      const res = await postService.fetchCommentByPost(postId);
      const newComments = res.data.result.content;

      set((state) => {
        const prevComments = state.commentsByPost[postId] || [];

        return {
          commentsByPost: {
            ...state.commentsByPost,
            [postId]:
              page === 0 ? newComments : [...prevComments, ...newComments], // gộp thêm
          },
          isCommentLoading: false,
        };
      });
      
      return res.data.result;
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
    set({ isRepliesLoading: true });

    try {
      const res = await postService.fetchRepliesByComment(commentId);
      set((state) => {
        const newState = {
          ...state.repliesByComment,
          [commentId]: {
            items: res.data.result.content,
          },
        };
        return { repliesByComment: newState };
      });
    } catch (error) {
      console.error("Lỗi khi fetch replies:", error);
      set({ isRepliesLoading: false });
    } finally {
      set({ isRepliesLoading: false });
    }
  },
}));
