import { postService } from "@/services/postService";
import { toast } from "sonner";
import { create } from "zustand";

export const useCommentStore = create((set, get) => ({
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

      // kiểm tra trước có replies data chưa (dùng get())
      const hadRepliesBefore = get().repliesByComment?.[data.parentId];

      set((state) => {
        // Nếu là reply
        if (data.parentId) {
          const prevData = state.repliesByComment[data.parentId];

          const prevContent = prevData?.content || [];

          const newRepliesByComment = {
            ...state.repliesByComment,
            [data.parentId]: {
              content: [...prevContent, newComment], // Thêm vào mảng content
              page: prevData?.page ?? 0,
              totalPages: prevData?.totalPages ?? 0,
            },
          };

          // tăng countReplies cho comment cha trong commentsByPost
          const prevComments = state.commentsByPost?.[postId] || [];
          const updateComments = prevComments.map((c) => 
            c.id === data.parentId ? {...c, countReplies: (c.countReplies || 0) + 1} : c
          );

          return {
            repliesByComment: newRepliesByComment,
            commentsByPost: {...state.commentsPost, [postId]: updateComments},
            isCommentLoading: false,
          };
        } else {
          // Nếu là comment cha
          const prevComments = state.commentsByPost?.[postId] || [];
          return {
            commentsByPost: {
              ...state.commentsByPost,
              [postId]: [newComment, ...prevComments],
            },
            isCommentLoading: false,
          };
        }
      });

      // Nếu trước đó chưa fetch replies, gọi fetch page 0 để sync với server (merge + dedupe sẽ xử lý).
      if (data.parentId && !hadRepliesBefore) {
        // gọi không chờ (fire-and-forget)
        get().fetchRepliesByComment(data.parentId, 0, 2);
      }
      toast.success("Bình luận thành công!");
      return newComment;
    } catch (error) {
      console.error("Lỗi khi bình luận:", error);
      toast.error("Lỗi khi bình luận");
      set({ isCommentLoading: false });
    }
  },

  fetchRepliesByComment: async (commentId, page = 0, size = 2) => {
    // bật loading
    set({ isRepliesLoading: true });

    try {
      const res = await postService.fetchRepliesByComment(
        commentId,
        page,
        size
      );
      const newReplies = res?.data?.result?.content || [];
      const totalPages = res?.data?.result?.totalPages ?? 0;

      // dùng functional update, lấy prev content đúng là mảng
      set((state) => {
        const prevContent = state.repliesByComment?.[commentId]?.content || [];

        // nếu page === 0 thì ưu tiên server trả về (đảm bảo order), rồi thêm các optimistic replies không có trong server
        const merged =
          page === 0
            ? [
                ...newReplies,
                ...prevContent.filter(
                  (r) => !newReplies.some((n) => n.id === r.id)
                ),
              ]
            : [...prevContent, ...newReplies];    
        
        const seen = new Set();
        const unique = [];

        for (const r of merged) {
          if (!seen.has(r.id)) {
            seen.add(r.id);
            unique.push(r);
          }
        }

        return {
          repliesByComment: {
            ...state.repliesByComment,
            [commentId]: {
              content:unique,
              page,
              totalPages,
            },
          },
        };
      });
    } catch (error) {
      console.error("Lỗi khi fetch replies:", error);
    } finally {
      // tắt loading ở finally để đảm bảo luôn reset
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
      });
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
          [postId]: state.commentsByPost[postId].filter(
            (c) => c.id !== commentId
          ),
        },
      }));

      toast.success("Xóa bình luận thành công");
    } catch (error) {
      toast.error("Xóa bình luận thất bại");
    }
  },
}));
