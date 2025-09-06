import { axiosInstance } from "@/lib/axios";
import { postService } from "@/services/postService";
import { toast } from "sonner";
import { create } from "zustand";

export const useCommentStore = create((set) => ({
  commentsByPost: {}, // {"postId: [comments...], ...."}
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

//   commentPost: async (postId, data) => {
//     set({ isCommentLoading: true });

//     try {
//       const newComment = await postService.commentPost(postId, data);

//       set((state) => ({
//         comments: [...state.comments, res],
//         isCommentLoading: false,
//       }));
//       toast.success("Bình luận thành công!");

//       return newComment;
//     } catch (error) {
//       toast.error("Lỗi khi bình luận");
//       set({ isCommentLoading: false });
//     }
//   },

}));