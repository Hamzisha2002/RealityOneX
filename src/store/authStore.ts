import { create } from 'zustand';

export type LoginMethod = 'google' | 'email' | 'github' | 'metamask' | 'avatar' | 'discord' | 'apple' | 'twitter';

interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  provider?: LoginMethod;
  loginMethod?: LoginMethod;
  walletAddress?: string;
}

interface AuthStore {
  isAuthenticated: boolean;
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  user: null,

  login: (userData) => {
    const user: User = {
      id: userData.id || `user-${Date.now()}`,
      name: userData.name || 'User',
      email: userData.email,
      avatar: userData.avatar,
      provider: userData.provider || userData.loginMethod,
      loginMethod: userData.provider || userData.loginMethod,
      walletAddress: userData.walletAddress,
    };
    set({ isAuthenticated: true, user });
  },

  logout: () => {
    set({ isAuthenticated: false, user: null });
  },
}));

