import { create } from "zustand";

const useAuthStore = create((set) => ({
  session: null,
  userInfo: { name: localStorage.getItem("name") || null, role: localStorage.getItem("role") || null },
  setSession: (session) => set({ session }),
  clearSession: () =>
    set({ session: null, userInfo: { name: null, role: null } }),
  saveUserInfo: (nameNew, roleNew) => {
    localStorage.setItem("name", nameNew);
    localStorage.setItem("role", roleNew);
    const info = { name: nameNew, role: roleNew };
    set((s) => ({ userInfo: info }));
  },
}));

export default useAuthStore;
