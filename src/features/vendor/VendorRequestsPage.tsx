import { motion } from 'framer-motion';
import { useAppStore } from '../../store/appStore';
import { useBookings, useUpdateBookingStatus } from '../../hooks/useBookings';
import { PageHeader } from '../../components/layout/PageHeader';
import { LuxCard } from '../../components/ui/LuxCard';
import { LuxBadge } from '../../components/ui/LuxBadge';
import { LuxButton } from '../../components/ui/LuxButton';
import { formatDate } from '../../lib/utils';
import toast from 'react-hot-toast';

export function VendorRequestsPage() {
  const user = useAppStore((s) => s.user);
  const { data: bookings = [] } = useBookings();
  const updateStatus = useUpdateBookingStatus();

  const vendorBookings = user
    ? bookings.filter((b) => b.vendorId === user.id)
    : [];

  const handleStatus = (
    id: string,
    status: 'confirmed' | 'cancelled'
  ) => {
    updateStatus.mutate({ id, status });
    toast.success(`Booking ${status}!`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <PageHeader
        title="Requests"
        subtitle={`${vendorBookings.length} total requests`}
      />

      <div className="px-5 pt-4 pb-24 flex flex-col gap-3">
        {vendorBookings.length === 0 ? (
          <p className="text-[13px] text-smoke text-center py-12">
            No booking requests yet.
          </p>
        ) : (
          vendorBookings.map((booking) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <LuxCard>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-[14px] text-ivory font-serif font-normal">
                      {booking.clientName}
                    </h3>
                    <LuxBadge
                      variant={
                        booking.status as
                          | 'pending'
                          | 'confirmed'
                          | 'completed'
                          | 'cancelled'
                      }
                    >
                      {booking.status}
                    </LuxBadge>
                  </div>
                  <div className="text-[12px] text-smoke space-y-1">
                    <p>
                      Event: {booking.eventType} ·{' '}
                      {formatDate(booking.eventDate)}
                    </p>
                    <p>Email: {booking.clientEmail}</p>
                    <p className="italic mt-1">{booking.message}</p>
                  </div>
                  {booking.status === 'pending' && (
                    <div className="flex gap-2.5 mt-3">
                      <LuxButton
                        variant="success"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleStatus(booking.id, 'confirmed')}
                      >
                        Confirm
                      </LuxButton>
                      <LuxButton
                        variant="danger"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleStatus(booking.id, 'cancelled')}
                      >
                        Decline
                      </LuxButton>
                    </div>
                  )}
                </div>
              </LuxCard>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
