import { useQuery } from '@tanstack/react-query';
import { api }       from '../lib/api';
import { AchievementDto } from '@arabic/shared';

export function useAchievements() {
  return useQuery<AchievementDto[]>({
    queryKey: ['achievements'],
    queryFn:  async () => (await api.get('/achievements')).data.data,
  });
}
