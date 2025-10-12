import { axiosInstance } from "@/lib/axios"

export const userService = {
    getMyProfile: async () => {
        return await axiosInstance.get("/users/my-info");
    },

    getProfileUser: async (userId) => {
        return await axiosInstance.get(`/users/${userId}`);
    },

    updateAvatar: async (formData) => {
        return await axiosInstance.put("/users/update-avatar", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            },
        });
    },

    updateProfile: async (data) => {
        return await axiosInstance.put("/users/update-profile", data);
    }
} 