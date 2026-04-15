import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ChatMessage {
  id: number;
  role: 'bot' | 'user';
  text: string;
}

export interface ChatStatus {
  plan: string;
  dailyUsed: number;
  dailyLimit: number | null;
  model: string;
  planExpiresAt: string | null;
}

interface ChatState {
  messages: ChatMessage[];
  nextId: number;
  status: ChatStatus | null;
  limitReached: boolean;

  addMessage: (role: 'bot' | 'user', text: string) => number;
  setStatus: (status: ChatStatus) => void;
  updateStatus: (partial: Partial<ChatStatus>) => void;
  setLimitReached: (v: boolean) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: [],
      nextId: 1,
      status: null,
      limitReached: false,

      addMessage: (role, text) => {
        const id = get().nextId;
        set({
          messages: [...get().messages, { id, role, text }],
          nextId: id + 1,
        });
        return id;
      },

      setStatus: (status) => set({ status }),

      updateStatus: (partial) => {
        const prev = get().status;
        if (prev) set({ status: { ...prev, ...partial } });
      },

      setLimitReached: (v) => set({ limitReached: v }),

      clearMessages: () => set({ messages: [], nextId: 1, limitReached: false }),
    }),
    {
      name: 'ai-teacher-chat',
      partialize: (state) => ({
        messages: state.messages.slice(-50), // keep last 50 messages
        nextId: state.nextId,
      }),
    }
  )
);
