import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import api from '@/lib/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const res = await api.post('/auth/login', { email, password });
          const { token, user } = res.data;
          localStorage.setItem('edtech_token', token);
          set({ user, token, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (name, email, password) => {
        set({ isLoading: true });
        try {
          const res = await api.post('/auth/register', { name, email, password });
          const { token, user } = res.data;
          localStorage.setItem('edtech_token', token);
          set({ user, token, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('edtech_token');
        set({ user: null, token: null, isAuthenticated: false });
        window.location.href = '/';
      },

      updateUser: (user) => set({ user }),

      checkAuth: async () => {
        const token = get().token || localStorage.getItem('edtech_token');
        if (!token) { set({ isAuthenticated: false }); return; }
        try {
          const res = await api.get('/auth/me');
          set({ user: res.data.user, isAuthenticated: true, token });
        } catch {
          set({ user: null, token: null, isAuthenticated: false });
          localStorage.removeItem('edtech_token');
        }
      },
    }),
    {
      name: 'edtech-auth',
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);
