import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api }            from '../lib/api';
import { useToastStore }  from '../store/toastStore';
import { SessionResultDto, ProgressStats, ChartDataPoint } from '@arabic/shared';

export function useProgress() {
  return useQuery<ProgressStats>({
    queryKey: ['progress', 'stats'],
    queryFn:  async () => (await api.get('/progress/stats')).data.data,
  });
}

export function useProgressChart(days = 30) {
  return useQuery<ChartDataPoint[]>({
    queryKey: ['progress', 'chart', days],
    queryFn:  async () => (await api.get(`/progress/chart?days=${days}`)).data.data,
  });
}

export function useSaveSession() {
  const qc   = useQueryClient();
  const push = useToastStore((s) => s.push);

  return useMutation({
    mutationFn: async (payload: SessionResultDto) =>
      (await api.post('/progress/session', payload)).data.data,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['progress'] });
      qc.invalidateQueries({ queryKey: ['achievements'] });
      // Show achievement toasts
      for (const ach of data.unlocked ?? []) push(ach);
    },
  });
}
