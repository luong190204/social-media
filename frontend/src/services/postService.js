import { axiosInstance } from "@/lib/axios"

export const postService = {
    createPost: async (data, file) => {
        return await axiosInstance.post("/posts", data, file)
    },

    getAllPostByUser: async () => {
        return await axiosInstance.get("/posts/user")
    },

    getPostById: async (postId) => {
        return await axiosInstance.get("/${postId}")
    }
}