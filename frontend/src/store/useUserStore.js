import { axiosInstance } from "@/lib/axios";
import { userService } from "@/services/userService";
import { toast } from "sonner";
import { create } from "zustand";

export const useUserStore = create ((set) => ({
    userProfile: null,
    isLoadingProfile: false,
    isUpdatingProfile: false,

    fetchMyProfile: async () =>  {
        set({ isLoadingProfile: true })
        try {
            const res = await userService.getProfile();
            set({ userProfile: res.data.result })
        } catch (error) {
            toast.error("Lỗi không load được profile")
            set({ userProfile: null })
        } finally {
            set({ isLoadingProfile: false })
        } 
    },

    updateAvatar: async (data) => {
        set({ isUpdatingProfile: true })
        try {
            const res = await userService.updateAvatar(data)
            set({ userProfile: res.data.result })
            toast.success("Cập nhật avatar thành công!")
        } catch (error) {
            toast.error("Cập nhật avatar thất bại!");
        } finally {
            set({ isUpdatingProfile: false })
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true })

        try {
            const res = await userService.updateProfile(data);
            set({ userProfile: res.data.result });
            toast.success("Cập nhật thông tin thành công!");
        } catch (error) {
            toast.error("Cập nhật thồn tin thất bại!");
        } finally {
            set({ isUpdatingProfile: false });
        }
    }

}))