import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, OnboardingSteps, OnboardingStep } from '@/types/api';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isHydrated: boolean;
}

interface AuthActions {
  setUser: (user: User) => void;
  setAccessToken: (token: string) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setHydrated: (hydrated: boolean) => void;
  updateOnboardingSteps: (steps: OnboardingSteps) => void;
  updateOnboardingStep: (step: OnboardingStep) => void;
  updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      isHydrated: false,

      // Actions
      setUser: (user) => 
        set((state) => ({ 
          user,
          isAuthenticated: !!user && !!state.accessToken
        })),

      setAccessToken: (token) => 
        set((state) => ({ 
          accessToken: token,
          isAuthenticated: !!token && !!state.user
        })),

      login: (user, token) => {
        // Store in localStorage for axios interceptor
        localStorage.setItem('access_token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Store in cookies for middleware
        document.cookie = `access_token=${token}; path=/; max-age=${30 * 24 * 60 * 60}`; // 30 days
        document.cookie = `user=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=${30 * 24 * 60 * 60}`; // 30 days
        
        set({
          user,
          accessToken: token,
          isAuthenticated: true,
        });
      },

      logout: () => {
        // Clear localStorage
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        
        // Clear cookies
        document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        });
      },

      setLoading: (loading) => 
        set({ isLoading: loading }),

      setHydrated: (hydrated) => 
        set({ isHydrated: hydrated }),

      updateOnboardingSteps: (steps) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = {
            ...currentUser,
            steps
          };
          
          // Update both localStorage and cookies
          localStorage.setItem('user', JSON.stringify(updatedUser));
          document.cookie = `user=${encodeURIComponent(JSON.stringify(updatedUser))}; path=/; max-age=${30 * 24 * 60 * 60}`;
          
          set({
            user: updatedUser
          });
        }
      },

      updateOnboardingStep: (step) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = {
            ...currentUser,
            onboardingStep: step
          };
          
          // Update both localStorage and cookies
          localStorage.setItem('user', JSON.stringify(updatedUser));
          document.cookie = `user=${encodeURIComponent(JSON.stringify(updatedUser))}; path=/; max-age=${30 * 24 * 60 * 60}`;
          
          set({
            user: updatedUser
          });
        }
      },

      updateUser: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = {
            ...currentUser,
            ...updates
          };
          
          // Update both localStorage and cookies
          localStorage.setItem('user', JSON.stringify(updatedUser));
          document.cookie = `user=${encodeURIComponent(JSON.stringify(updatedUser))}; path=/; max-age=${30 * 24 * 60 * 60}`;
          
          set({
            user: updatedUser
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
        // Don't persist isHydrated and isLoading
      }),
    }
  )
);
