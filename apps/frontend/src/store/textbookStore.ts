import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ChapterProgress {
  chapterId: string;
  totalQuestions: number;
  correctAnswers: number;
  completedAt?: string;
  bestScore: number;
  lastAttemptAt?: string;
}

interface LessonProgress {
  bestScore: number;
  completedAt?: string;
  lastAttemptAt?: string;
}

interface TextbookState {
  progress: Record<string, ChapterProgress>;
  lessonProgress: Record<string, LessonProgress>; // keyed by "chapterId:lessonIndex"

  saveQuizResult: (chapterId: string, totalQuestions: number, correctAnswers: number) => void;
  saveLessonResult: (chapterId: string, lessonIndex: number, totalQuestions: number, correctAnswers: number) => void;
  getLessonProgress: (chapterId: string, lessonIndex: number) => LessonProgress | undefined;
  getChapterProgress: (chapterId: string) => ChapterProgress | undefined;
  getTotalProgress: () => { completedChapters: number; totalChapters: number; averageScore: number };
  resetChapter: (chapterId: string) => void;
}

export const useTextbookStore = create<TextbookState>()(
  persist(
    (set, get) => ({
      progress: {},
      lessonProgress: {},

      saveLessonResult: (chapterId, lessonIndex, totalQuestions, correctAnswers) => {
        const key = `${chapterId}:${lessonIndex}`;
        const current = get().lessonProgress[key];
        const percentage = Math.round((correctAnswers / totalQuestions) * 100);
        const isCompleted = percentage >= 70;
        set({
          lessonProgress: {
            ...get().lessonProgress,
            [key]: {
              bestScore: Math.max(percentage, current?.bestScore ?? 0),
              completedAt: isCompleted ? (current?.completedAt ?? new Date().toISOString()) : current?.completedAt,
              lastAttemptAt: new Date().toISOString(),
            },
          },
        });
      },

      getLessonProgress: (chapterId, lessonIndex) => get().lessonProgress[`${chapterId}:${lessonIndex}`],

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
