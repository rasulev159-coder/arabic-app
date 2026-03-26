import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery }        from '@tanstack/react-query';
import { api }                          from '../lib/api';
import { useAuthStore }                 from '../store/authStore';
import { ChallengeDto, WsEvent, ChallengeResultDto } from '@arabic/shared';

const WS_BASE = import.meta.env.VITE_WS_URL ?? 'ws://localhost:4000';

export function useChallenge(token: string) {
  return useQuery<ChallengeDto>({
    queryKey: ['challenge', token],
    queryFn:  async () => (await api.get(`/challenges/${token}`)).data.data,
    enabled:  !!token,
  });
}

export function useCreateChallenge() {
  return useMutation({
    mutationFn: async (mode: string) =>
      (await api.post('/challenges', { mode })).data.data as ChallengeDto,
  });
}

export function useAcceptChallenge() {
  return useMutation({
    mutationFn: async (token: string) =>
      (await api.post(`/challenges/${token}/accept`)).data.data as ChallengeDto,
  });
}

export function useSubmitChallengeResult() {
  return useMutation({
    mutationFn: async ({ token, result }: { token: string; result: ChallengeResultDto }) =>
      (await api.post(`/challenges/${token}/result`, result)).data.data as ChallengeDto,
  });
}

export function useChallengeSocket(challengeId: string | undefined) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const [events, setEvents] = useState<WsEvent[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!challengeId || !accessToken) return;
    const ws = new WebSocket(
      `${WS_BASE}?token=${accessToken}&challengeId=${challengeId}`,
    );
    wsRef.current = ws;

    ws.onmessage = (e) => {
      try {
        const event = JSON.parse(e.data) as WsEvent;
        setEvents((prev) => [...prev, event]);
      } catch { /* ignore */ }
    };

    return () => ws.close();
  }, [challengeId, accessToken]);

  return { events };
}
