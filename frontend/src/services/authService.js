import { axiosInstance } from "@/lib/axios"

export const authService = {
    checkAuth: async () => {
        return await axiosInstance.get("users/my-info");
    },

    signup: async (data) => {
        return await axiosInstance.post("/auth/register", data);
    }, 

    login: async (data) => {
        return await axiosInstance.post("auth/login", data);
    },

    logout: async () => {
        return await axiosInstance.post("/auth/logout");
    }
};