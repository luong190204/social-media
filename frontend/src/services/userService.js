import { axiosInstance } from "@/lib/axios"

export const userService = {
    getProfile: async () => {
        return await axiosInstance.get("/users/my-info");
    }

    
} 