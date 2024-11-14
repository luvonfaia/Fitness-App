import { create } from 'zustand';

interface AuthState {
  user: { id: string; username: string } | null;
  setUser: (user: { id: string; username: string } | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));