import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Vendor } from '../../types';
import { LuxInput } from '../../components/ui/LuxInput';
import { LuxSelect } from '../../components/ui/LuxSelect';
import { LuxTextarea } from '../../components/ui/LuxTextarea';
import { LuxButton } from '../../components/ui/LuxButton';
import { eventTypes } from '../../data/vendors';
import { useCreateBooking } from '../../hooks/useBookings';
import toast from 'react-hot-toast';

const schema = z.object({
  eventDate: z.string().min(1, 'Select an event date'),
  eventType: z.string().min(1, 'Select an event type'),
  message: z.string().min(10, 'Write at least 10 characters'),
});

type FormData = z.infer<typeof schema>;

interface BookingFormProps {
  vendor: Vendor;
  onSuccess?: () => void;
}

export function BookingForm({ vendor, onSuccess }: BookingFormProps) {
  const createBooking = useCreateBooking();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    createBooking.mutate(
      {
        vendorId: vendor.id,
        vendorName: vendor.name,
        vendorCategory: vendor.category,
        eventDate: data.eventDate,
        eventType: data.eventType,
        message: data.message,
      },
      {
        onSuccess: () => {
          toast.success('Booking request sent!');
          onSuccess?.();
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.error || 'Failed to create booking');
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <LuxInput
        label="Event Date"
        type="date"
        error={errors.eventDate?.message}
        {...register('eventDate')}
      />
      <LuxSelect
        label="Event Type"
        placeholder="Select type"
        options={eventTypes.map((t) => ({ value: t, label: t }))}
        error={errors.eventType?.message}
        {...register('eventType')}
      />
      <LuxTextarea
        label="Message"
        placeholder="Tell us about your event..."
        error={errors.message?.message}
        {...register('message')}
      />
          <LuxButton type="submit" loading={createBooking.isPending} className="w-full mt-2">
        Send Booking Request
      </LuxButton>
    </form>
  );
}
