import { create } from 'zustand';
import { AchievementDto } from '@arabic/shared';

interface ToastState {
  queue: AchievementDto[];
  push:  (a: AchievementDto) => void;
  pop:   () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  queue: [],
  push: (a) => set((s) => ({ queue: [...s.queue, a] })),
  pop:  ()  => set((s) => ({ queue: s.queue.slice(1) })),
}));
