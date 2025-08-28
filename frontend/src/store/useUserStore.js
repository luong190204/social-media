import { userService } from "@/services/userService";
import { toast } from "sonner";
import { create } from "zustand";

export const useUserStore = create ((set) => ({
    userProfile: null,
    isLoadingProfile: false,

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


}))