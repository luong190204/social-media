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
    }
}