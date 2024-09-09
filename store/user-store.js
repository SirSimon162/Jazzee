import { create } from "zustand";

const useAuthStore = create((set) => ({
  session: null,
  userInfo: { name: null, role: null },
  setSession: (session) => set({ session }),
  clearSession: () =>
    set({ session: null, userInfo: { name: null, role: null } }),
  saveUserInfo: (nameNew, roleNew) => {
    const info = { name: nameNew, role: roleNew };
    set((s) => ({ userInfo: info }));
  },
}));

export default useAuthStore;
