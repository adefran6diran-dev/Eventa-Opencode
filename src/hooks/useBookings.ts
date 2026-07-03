import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import type { Booking, BookingStatus } from '../types';

export function useBookings() {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const res = await api.get<{ bookings: Booking[] }>('/bookings');
      return res.data.bookings;
    },
  });
}

export function useCreateBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      vendorId: string;
      vendorName: string;
      vendorCategory: string;
      eventDate: string;
      eventType: string;
      message: string;
    }) => {
      const res = await api.post<{ booking: Booking }>('/bookings', data);
      return res.data.booking;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}

export function useUpdateBookingStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: BookingStatus;
    }) => {
      const res = await api.patch<{ booking: Booking }>(
        `/bookings/${id}/status`,
        { status }
      );
      return res.data.booking;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}
