import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WordProgress {
  wordId: number;
  correctCount: number;
  lastSeen: string | null;
  status: 'new' | 'learning' | 'mastered';
}

interface QuranWordsState {
  wordProgress: Record<number, WordProgress>;
  lessonScores: Record<number, { score: number; total: number; bestPct: number }>;

  recordAnswer: (wordId: number, correct: boolean) => void;
  saveLessonScore: (lessonId: number, score: number, total: number) => void;
  getWordStatus: (wordId: number) => 'new' | 'learning' | 'mastered';
  getStats: () => { total: number; mastered: number; learning: number; newWords: number };
  getWeakWords: () => number[];
}

function deriveStatus(correctCount: number): 'new' | 'learning' | 'mastered' {
  if (correctCount >= 3) return 'mastered';
  if (correctCount >= 1) return 'learning';
  return 'new';
}

export const useQuranWordsStore = create<QuranWordsState>()(
  persist(
    (set, get) => ({
      wordProgress: {},
      lessonScores: {},

      recordAnswer: (wordId: number, correct: boolean) => {
        const current = get().wordProgress[wordId];
        const correctCount = correct
          ? (current?.correctCount ?? 0) + 1
          : current?.correctCount ?? 0;

        set({
          wordProgress: {
            ...get().wordProgress,
            [wordId]: {
              wordId,
              correctCount,
              lastSeen: new Date().toISOString(),
              status: deriveStatus(correctCount),
            },
          },
        });
      },

      saveLessonScore: (lessonId: number, score: number, total: number) => {
        const current = get().lessonScores[lessonId];
        const pct = Math.round((score / total) * 100);
        set({
          lessonScores: {
            ...get().lessonScores,
            [lessonId]: {
              score,
              total,
              bestPct: Math.max(pct, current?.bestPct ?? 0),
            },
          },
        });
      },

      getWordStatus: (wordId: number) => {
        const wp = get().wordProgress[wordId];
        if (!wp) return 'new';
        return deriveStatus(wp.correctCount);
      },

      getStats: () => {
        const all = Object.values(get().wordProgress);
        const mastered = all.filter((w) => w.status === 'mastered').length;
        const learning = all.filter((w) => w.status === 'learning').length;
        return {
          total: 300,
          mastered,
          learning,
          newWords: 300 - mastered - learning,
        };
      },

      getWeakWords: () => {
        const all = Object.values(get().wordProgress);
        return all.filter((w) => w.correctCount < 3).map((w) => w.wordId);
      },
    }),
    { name: 'quran-words-progress' }
  )
);
