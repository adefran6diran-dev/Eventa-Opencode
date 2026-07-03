import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import type { Application } from '../types';

export function useApplications() {
  return useQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      const res = await api.get<{ applications: Application[] }>(
        '/applications'
      );
      return res.data.applications;
    },
  });
}

export function useSubmitApplication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Record<string, any>) => {
      const res = await api.post<{ application: Application }>(
        '/applications',
        data
      );
      return res.data.application;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['applications'] });
    },
  });
}

export function useReviewApplication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
      note,
    }: {
      id: string;
      status: string;
      note: string;
    }) => {
      const res = await api.patch(`/applications/${id}/review`, {
        status,
        note,
      });
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['applications'] });
      qc.invalidateQueries({ queryKey: ['vendors'] });
    },
  });
}
