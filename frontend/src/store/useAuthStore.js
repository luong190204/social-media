import { create } from 'zustand';

import { toast } from 'sonner';
import { authService } from '@/services/authService';
import { disconnectNotificationSocket } from '@/lib/notificationSocket';
export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIng: false,
  isCheckingAuth: true,
  lastRegisteredUsername: "",

  // check token và lấy info user
  checkAuth: async () => {
    const token = localStorage.getItem("token");
    if (!token || token === "undefined" || token === "null") {
      set({ authUser: null, isCheckingAuth: false });
      return;
    }

    try {
      const res = await authService.checkAuth();
      set({ authUser: res.data.result });
    } catch (error) {
      console.log("Error checking auth: ", error);
      set({ authUser: null });
      localStorage.removeItem("token"); // xoá token rác đi
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await authService.signup(data);

      // Lưu username vừa đăng ký
      set({ lastRegisteredUsername: data.username });

      toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message);
      return false;
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIng: true });
    try {
      const res = await authService.login(data);``

      const token = res.data.result.token;
      if (token) {
        localStorage.setItem("token", token);
        await useAuthStore.getState().checkAuth();
        toast.success("Đăng nhập thành công!");
      }
    } catch (error) {
      console.log("Error login: ", error);
      toast.error("Đăng nhập thất bại, vui lòng kiểm tra lại thông tin.");
    } finally {
      set({ isLoggingIng: false });
    }
  },

  logout: async () => {
    await authService.logout();
    disconnectNotificationSocket();
    localStorage.removeItem("token");
    toast.success("Đăng xuất thành công!");
  },
}));