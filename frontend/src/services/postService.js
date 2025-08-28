import { axiosInstance } from "@/lib/axios"

export const postService = {
    createPost: async (data, file) => {
        return await axiosInstance.post("/posts", data, file)
    },

    getAllPost: async () => {
        return await axiosInstance.get("/posts")
    },

    getPostById: async (postId) => {
        return await axiosInstance.get("/${postId}")
    }
}