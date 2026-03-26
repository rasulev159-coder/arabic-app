import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api }          from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { UserPublic }   from '@arabic/shared';

export function useUser() {
  const setUser = useAuthStore((s) => s.setUser);
  return useQuery<UserPublic>({
    queryKey: ['user', 'me'],
    queryFn:  async () => {
      const { data } = await api.get('/user/me');
      setUser(data.data);
      return data.data;
    },
    staleTime: 60_000,
  });
}

export function useUpdateUser() {
  const qc      = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);
  return useMutation({
    mutationFn: async (payload: { name?: string; avatar?: string }) =>
      (await api.patch('/user/me', payload)).data.data as UserPublic,
    onSuccess: (user) => {
      setUser(user);
      qc.setQueryData(['user', 'me'], user);
    },
  });
}
