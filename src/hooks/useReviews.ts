import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import type { Review } from '../types';

export function useReviews(vendorId: string | undefined) {
  return useQuery({
    queryKey: ['reviews', vendorId],
    queryFn: async () => {
      const res = await api.get<{ reviews: Review[] }>(
        `/reviews/${vendorId}`
      );
      return res.data.reviews;
    },
    enabled: !!vendorId,
  });
}

export function useSubmitReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      bookingId: string;
      vendorId: string;
      rating: number;
      comment: string;
    }) => {
      const res = await api.post<{ review: Review }>('/reviews', data);
      return res.data.review;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['reviews', data.vendorId] });
      qc.invalidateQueries({ queryKey: ['vendors'] });
    },
  });
}
