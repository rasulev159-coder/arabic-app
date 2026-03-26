import { useQuery } from '@tanstack/react-query';
import { api }       from '../lib/api';
import { LeaderboardEntry } from '@arabic/shared';

type LeaderboardMode = 'speed' | 'lightning' | 'memory' | 'streak';

export function useLeaderboard(mode: LeaderboardMode) {
  return useQuery<LeaderboardEntry[]>({
    queryKey: ['leaderboard', mode],
    queryFn:  async () => {
      const url = mode === 'streak'
        ? '/leaderboard/streak'
        : `/leaderboard/speed?mode=${mode}`;
      return (await api.get(url)).data.data;
    },
    staleTime: 60_000,
  });
}
