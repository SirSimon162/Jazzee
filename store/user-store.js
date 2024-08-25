import { create } from "zustand";

const useAuthStore = create((set) => ({
  session: null,
  userInfo: { name: null, role: null },
  setSession: (session) => set({ session }),
  clearSession: () =>
    set({ session: null, userInfo: { name: null, role: null } }),
  saveUserInfo: (name, role) => {
    localStorage.setItem("name", name);
    localStorage.setItem("role", role);
    set({ userInfo: { name, role } });
  },
}));

export default useAuthStore;
