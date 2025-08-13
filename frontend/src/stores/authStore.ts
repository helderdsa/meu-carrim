import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, AuthResponse } from '../types';
import { authService } from '../services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response: AuthResponse = await authService.login({ email, password });
          const { user, token } = response;
          
          localStorage.setItem('auth-token', token);
          localStorage.setItem('user-data', JSON.stringify(user));
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response: AuthResponse = await authService.register({ name, email, password });
          const { user, token } = response;
          
          localStorage.setItem('auth-token', token);
          localStorage.setItem('user-data', JSON.stringify(user));
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('auth-token');
        localStorage.removeItem('user-data');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      updateProfile: async (data: Partial<User>) => {
        set({ isLoading: true });
        try {
          const updatedUser = await authService.updateProfile(data);
          localStorage.setItem('user-data', JSON.stringify(updatedUser));
          set({
            user: updatedUser,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      checkAuth: async () => {
        const token = localStorage.getItem('auth-token');
        const userData = localStorage.getItem('user-data');
        
        if (token && userData) {
          try {
            const user = JSON.parse(userData);
            // Verificar se o token ainda é válido
            await authService.getProfile();
            set({
              user,
              token,
              isAuthenticated: true,
            });
          } catch {
            // Token inválido, limpar dados
            get().logout();
          }
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
