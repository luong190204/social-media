import { axiosInstance } from "@/lib/axios"

export const followService = {
    follow: async (targetId) => {
        return await axiosInstance.post(`/follow/follow/${targetId}`)
    }, 

    unfollow: async (targetId) => {
        return await axiosInstance.delete(`/follow/unfollow/${targetId}`)
    },

    
}