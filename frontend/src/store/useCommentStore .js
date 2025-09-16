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
      const res = await postService.fetchCommentByPost(postId, page, size);
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
      console.log("comment response:", res.data);

      set((state) => {
        if (data.parentId) {
          // nếu có parentId thì thêm vào replies
          const prevReplies = state.repliesByComment[data.parentId] || [];
          return {
            repliesByComment: {
              ...state.repliesByComment,
              [data.parentId]: [...prevReplies || [], newComment],
            },
            isCommentLoading: false,
          };
        } else {
          // thêm vào list comment cha
          const prevComments = state.commentsByPost[postId] || [];
          return {
            commentsByPost: {
              ...state.commentsByPost,
              [postId]: [newComment, ...prevComments],
            },
            isCommentLoading: false,
          }
        }
      })

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

  updateComment: async (commentId, data) => {
    try {
      const res = await postService.updateComment(commentId, data);
      set((state) => {
        const updated = res.data.result;
        const newMap = { ...state.commentsByPost };

        // Vòng lặp map tìm kiếm bình luận có ID khớp và thay thế nó bằng dữ liệu mới nhất từ server.
        // lấy ra newMap bằng object key -> duyệt qua postId trong newMap -> nếu id cmt trùng viiuws commentId -> update
        Object.keys(newMap).forEach((postId) => {
          newMap[postId] = newMap[postId].map((c) => 
            c.id === commentId ? updated : c
          );
        });

        return { commentsByPost: newMap };
      })
      toast.success("Cập nhật bình luận thành công");
      return res.data.result;
    } catch (error) {
      toast.error("Cập nhật bình luận thất bại");
    }
  },

  deleteComment: async (postId, commentId) => {
    try {
      await postService.deleteComment(commentId);      

      set((state) => ({
        commentsByPost: {
          ...state.commentsByPost,
          [postId]: state.commentsByPost[postId].filter((c) => c.id !== commentId),
        }
      }));

      toast.success("Xóa bình luận thành công")
    } catch (error) {
      toast.error("Xóa bình luận thất bại")  
    }
  },

}));
