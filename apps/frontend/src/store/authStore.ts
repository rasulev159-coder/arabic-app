import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api }     from '../lib/api';
import { UserPublic, Language } from '@arabic/shared';
import i18n from '../i18n';

interface AuthState {
  user:         UserPublic | null;
  accessToken:  string | null;
  refreshToken: string | null;
  isLoading:    boolean;

  login:       (email: string, password: string) => Promise<void>;
  register:    (email: string, name: string, password: string, language?: Language) => Promise<void>;
  loginGoogle: (idToken: string) => Promise<void>;
  logout:      () => Promise<void>;
  fetchMe:     () => Promise<void>;
  setUser:     (user: UserPublic) => void;
  setLanguage: (lang: Language) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user:         null,
      accessToken:  null,
      refreshToken: null,
      isLoading:    false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post('/auth/login', { email, password });
          localStorage.setItem('accessToken',  data.data.accessToken);
          localStorage.setItem('refreshToken', data.data.refreshToken);
          i18n.changeLanguage(data.data.user.language);
          set({ user: data.data.user, accessToken: data.data.accessToken, refreshToken: data.data.refreshToken });
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (email, name, password, language = 'ru') => {
        set({ isLoading: true });
        try {
          const { data } = await api.post('/auth/register', { email, name, password, language });
          localStorage.setItem('accessToken',  data.data.accessToken);
          localStorage.setItem('refreshToken', data.data.refreshToken);
          i18n.changeLanguage(data.data.user.language);
          set({ user: data.data.user, accessToken: data.data.accessToken, refreshToken: data.data.refreshToken });
        } finally {
          set({ isLoading: false });
        }
      },

      loginGoogle: async (idToken) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post('/auth/google', { idToken });
          localStorage.setItem('accessToken',  data.data.accessToken);
          localStorage.setItem('refreshToken', data.data.refreshToken);
          i18n.changeLanguage(data.data.user.language);
          set({ user: data.data.user, accessToken: data.data.accessToken, refreshToken: data.data.refreshToken });
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try { await api.delete('/auth/logout'); } catch { /* ignore */ }
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        set({ user: null, accessToken: null, refreshToken: null });
      },

      fetchMe: async () => {
        const { data } = await api.get('/user/me');
        i18n.changeLanguage(data.data.language);
        set({ user: data.data });
      },

      setUser: (user) => set({ user }),

      setLanguage: async (lang) => {
        await api.patch('/user/language', { language: lang });
        i18n.changeLanguage(lang);
        const user = get().user;
        if (user) set({ user: { ...user, language: lang } });
      },
    }),
    {
      name: 'auth',
      partialize: (s) => ({ accessToken: s.accessToken, refreshToken: s.refreshToken }),
    },
  ),
);
