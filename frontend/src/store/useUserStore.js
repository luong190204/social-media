import { axiosInstance } from "@/lib/axios";
import { followService } from "@/services/followService";
import { userService } from "@/services/userService";
import { toast } from "sonner";
import { create } from "zustand";

export const useUserStore = create ((set, get) => ({
    userProfile: null,
    isLoadingProfile: false,
    isUpdatingProfile: false,
    isFollowLoading: false,

    fetchMyProfile: async () =>  {
        set({ isLoadingProfile: true })
        try {
            const res = await userService.getMyProfile();
            set({ userProfile: res.data.result })
        } catch (error) {
            toast.error("Lỗi không load được profile")
            set({ userProfile: null })
        } finally {
            set({ isLoadingProfile: false })
        } 
    },

    fetchProfileUser: async (userId) => {
        set({ isLoadingProfile: true })
        try {
            const res = await userService.getProfileUser(userId);
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
    },

    
    toggleFollowUser: async (authUserId) => {
        const { userProfile } = get();
        if (!userProfile) return;

        set({ isFollowLoading: true });

        try {
            const isFollowing = userProfile.followers.includes(authUserId);
            if (isFollowing) {
                await followService.unfollow(userProfile.id);
                set({
                  userProfile: {
                    ...userProfile,
                    followers: userProfile.followers.filter(
                      (id) => id != authUserId
                    ),
                  },
                });
            } else {
                await followService.follow(userProfile.id);
                set({
                  userProfile: {
                    ...userProfile,
                    followers: [...userProfile.followers, authUserId],
                  },
                });
            }
        } catch (error) {
            console.error("Follow/unfollow error:", error);
        } finally {
            set({ isFollowLoading: false });
        }

    },

}))