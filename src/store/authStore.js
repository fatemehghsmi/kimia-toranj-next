import { create } from "zustand";
import axiosInstanceNoRedirect from "@/utils/axiosInstanceNoRedirect";

export const useAuthStore = create((set) => ({
  user: null,
  isLoggedIn: false,
  isLoading: false,

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstanceNoRedirect.get("api/store/customer/me/");
      set({ user: res.data, isLoggedIn: true, isLoading: false });
    } catch (err) {
      // Only log unexpected errors
      if (err.response?.status !== 401) {
        console.error("Auth check failed:", err);
      }
      set({ user: null, isLoggedIn: false, isLoading: false });
    }
  },
}));
