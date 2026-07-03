import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store/appStore';
import { useBookings } from '../../hooks/useBookings';
import { PageHeader } from '../../components/layout/PageHeader';
import { BookingCard } from './BookingCard';
import { ReviewModal } from './ReviewModal';

export function BookingsPage() {
  const { data: bookings = [] } = useBookings();
  const currentUser = useAppStore((s) => s.user);
  const [tab, setTab] = useState('upcoming');
  const [reviewTarget, setReviewTarget] = useState<{
    bookingId: string;
    vendorId: string;
  } | null>(null);

  const userBookings = currentUser
    ? bookings.filter((b) => b.clientId === currentUser.id)
    : [];

  const filtered =
    tab === 'upcoming'
      ? userBookings.filter((b) =>
          ['pending', 'confirmed'].includes(b.status)
        )
      : userBookings.filter((b) =>
          ['completed', 'cancelled'].includes(b.status)
        );

  const tabs = [
    { id: 'upcoming', label: 'Upcoming', count: userBookings.filter((b) => ['pending', 'confirmed'].includes(b.status)).length },
    { id: 'past', label: 'Past', count: userBookings.filter((b) => ['completed', 'cancelled'].includes(b.status)).length },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <PageHeader title="My Bookings" />

      <div className="flex border-b border-white/6 overflow-x-auto hide-scrollbar px-5">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="px-[18px] py-[14px] text-[12px] font-semibold tracking-[0.5px] uppercase whitespace-nowrap transition-all bg-transparent border-none cursor-pointer flex items-center gap-1.5"
            style={{
              color: tab === t.id ? '#C9A84C' : '#6B6B7E',
              borderBottom:
                tab === t.id ? '2px solid #C9A84C' : '2px solid transparent',
              marginBottom: -1,
            }}
          >
            {t.label}
            <span className="bg-gold-tint text-gold rounded-full text-[10px] px-[7px] py-[1px]">
              {t.count}
            </span>
          </button>
        ))}
      </div>

      <div className="px-5 pt-4 pb-24 flex flex-col gap-3">
        {filtered.length === 0 ? (
          <p className="text-[13px] text-smoke text-center py-12">
            No {tab} bookings yet.
          </p>
        ) : (
          filtered.map((booking) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <BookingCard
                booking={booking}
                onClick={() => {
                  if (booking.status === 'completed') {
                    setReviewTarget({
                      bookingId: booking.id,
                      vendorId: booking.vendorId,
                    });
                  }
                }}
              />
            </motion.div>
          ))
        )}
      </div>

      {reviewTarget && (
        <ReviewModal
          open={!!reviewTarget}
          onClose={() => setReviewTarget(null)}
          bookingId={reviewTarget.bookingId}
          vendorId={reviewTarget.vendorId}
        />
      )}
    </motion.div>
  );
}
