import { axiosInstance } from "@/lib/axios"

export const feedService = {
    getFeed: async (page = 0, size = 10) => {
        return axiosInstance.get(`/feed`, {
            params: { page, size }
        })
    }
}