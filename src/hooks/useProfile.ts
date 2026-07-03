import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import type { User } from '../types';

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await api.get<{ user: User }>('/profile');
      return res.data.user;
    },
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<User>) => {
      const res = await api.patch<{ user: User }>('/profile', data);
      return res.data.user;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}
