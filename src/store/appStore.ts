import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';

interface AppState {
  user: User | null;
  token: string | null;
  catFilter: string;
  bookingTab: string;
  adminTab: string;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
  setCatFilter: (cat: string) => void;
  setBookingTab: (tab: string) => void;
  setAdminTab: (tab: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      catFilter: 'all',
      bookingTab: 'upcoming',
      adminTab: 'applications',

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),

      logout: () =>
        set({ user: null, token: null, catFilter: 'all', bookingTab: 'upcoming', adminTab: 'applications' }),

      setCatFilter: (catFilter) => set({ catFilter }),
      setBookingTab: (bookingTab) => set({ bookingTab }),
      setAdminTab: (adminTab) => set({ adminTab }),
    }),
    {
      name: 'eventa-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        catFilter: state.catFilter,
        bookingTab: state.bookingTab,
        adminTab: state.adminTab,
      }),
    }
  )
);
