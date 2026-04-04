import { create } from 'zustand';
import { api } from '../lib/api';

interface SectionsState {
  sections: Record<string, boolean>;
  loaded: boolean;
  fetchSections: () => Promise<void>;
  isEnabled: (key: string) => boolean;
}

export const useSectionsStore = create<SectionsState>((set, get) => ({
  sections: {
    games: true, textbook: true, quran: true, challenges: true,
    leaderboard: true, achievements: true, daily_lesson: true,
    donate: true, weakness: true, roadmap: true,
  },
  loaded: false,

  fetchSections: async () => {
    try {
      const { data } = await api.get('/settings/sections');
      set({ sections: data.data, loaded: true });
    } catch {
      set({ loaded: true }); // use defaults on error
    }
  },

  isEnabled: (key: string) => get().sections[key] !== false,
}));
