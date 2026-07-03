import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import type { Vendor } from '../types';

export function useVendors(category?: string, search?: string) {
  return useQuery({
    queryKey: ['vendors', category, search],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (category && category !== 'all') params.category = category;
      if (search) params.search = search;
      const res = await api.get<{ vendors: Vendor[] }>('/vendors', { params });
      return res.data.vendors;
    },
    staleTime: 30_000,
  });
}

export function useVendor(id: string | undefined) {
  return useQuery({
    queryKey: ['vendor', id],
    queryFn: async () => {
      const res = await api.get<{ vendor: Vendor }>(`/vendors/${id}`);
      return res.data.vendor;
    },
    enabled: !!id,
  });
}
