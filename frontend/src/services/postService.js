import { axiosInstance } from "@/lib/axios"

export const postService = {
    createPost: async (formData) => {
        return await axiosInstance.post("/posts", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            },
        });
    },

    getAllPostByUser: async () => {
        return await axiosInstance.get("/posts/user")
    },

    getPostById: async (postId) => {
        return await axiosInstance.get("/${postId}")
    },

    updatePost: async (postId, data) => {
        const response = await axiosInstance.put(`/posts/${postId}`, data);
        return {
          data: response.data.result, 
        };
    },

    deletePost: async (postId) => {
        return await axiosInstance.delete(`/posts/${postId}`);
    },

    toggleLikePost: async (postId) => {
        return await axiosInstance.post(`/posts/${postId}/like`)
    },

    commentPost: async (postId, data) => {
      return await axiosInstance.post(`/posts/${postId}/comment`, data);
    },

    fetchCommentByPost: async (postId, page = 0, size = 8) => {
        return await axiosInstance.get(`/posts/${postId}/comments`, {
            params: { page, size },
        });
    },

    fetchRepliesByComment: async(commentId) => {
        return await axiosInstance.get(`/posts/comments/${commentId}/replies`);
    },

    updateComment: async (commentId, data) => {
        return await axiosInstance.put(`/posts/comments/${commentId}`, data);
    },

    deleteComment: async(commentId) => {
        return await axiosInstance.delete(`/posts/comments/${commentId}`);
    }
}