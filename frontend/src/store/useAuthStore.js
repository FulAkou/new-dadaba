import Cookies from "js-cookie";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: Cookies.get("token") || null,
      isAuthenticated: !!Cookies.get("token"),
      isLoading: false,
      error: null,

      setAuth: (user, token) => {
        if (token) {
          Cookies.set("token", token, { expires: 7 });
          set({ user, token, isAuthenticated: true, error: null });
        } else {
          set({ user, token: null, isAuthenticated: !!user, error: null });
        }
      },

      logout: () => {
        Cookies.remove("token");
        set({ user: null, token: null, isAuthenticated: false, error: null });
      },

      setUser: (user) => set({ user }),
      setError: (error) => set({ error }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }),
    }
  )
);
