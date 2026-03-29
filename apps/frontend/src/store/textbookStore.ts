import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ChapterProgress {
  chapterId: string;
  totalQuestions: number;
  correctAnswers: number;
  completedAt?: string; // ISO date when first completed
  bestScore: number; // best percentage
  lastAttemptAt?: string;
}

interface TextbookState {
  progress: Record<string, ChapterProgress>; // keyed by chapterId

  saveQuizResult: (chapterId: string, totalQuestions: number, correctAnswers: number) => void;
  getChapterProgress: (chapterId: string) => ChapterProgress | undefined;
  getTotalProgress: () => { completedChapters: number; totalChapters: number; averageScore: number };
  resetChapter: (chapterId: string) => void;
}

export const useTextbookStore = create<TextbookState>()(
  persist(
    (set, get) => ({
      progress: {},

      saveQuizResult: (chapterId, totalQuestions, correctAnswers) => {
        const current = get().progress[chapterId];
        const percentage = Math.round((correctAnswers / totalQuestions) * 100);
        const isCompleted = percentage >= 70; // 70% to pass

        set({
          progress: {
            ...get().progress,
            [chapterId]: {
              chapterId,
              totalQuestions,
              correctAnswers,
              completedAt: isCompleted ? (current?.completedAt ?? new Date().toISOString()) : current?.completedAt,
              bestScore: Math.max(percentage, current?.bestScore ?? 0),
              lastAttemptAt: new Date().toISOString(),
            },
          },
        });
      },

      getChapterProgress: (chapterId) => get().progress[chapterId],

      getTotalProgress: () => {
        const entries = Object.values(get().progress);
        const completed = entries.filter(e => e.completedAt).length;
        const avg = entries.length > 0
          ? Math.round(entries.reduce((sum, e) => sum + e.bestScore, 0) / entries.length)
          : 0;
        return { completedChapters: completed, totalChapters: 9, averageScore: avg };
      },

      resetChapter: (chapterId) => {
        const { [chapterId]: _, ...rest } = get().progress;
        set({ progress: rest });
      },
    }),
    { name: 'textbook-progress' }
  )
);
