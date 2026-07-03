import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/appStore';
import { useBookings } from '../../hooks/useBookings';
import { HeroSection } from '../../components/layout/HeroSection';
import { LuxCard } from '../../components/ui/LuxCard';
import { LuxBadge } from '../../components/ui/LuxBadge';
import { formatDate } from '../../lib/utils';

export function VendorDashboardPage() {
  const user = useAppStore((s) => s.user);
  const { data: bookings = [] } = useBookings();
  const navigate = useNavigate();

  const vendorBookings = user
    ? bookings.filter((b) => b.vendorId === user.id)
    : [];

  const pendingCount = vendorBookings.filter(
    (b) => b.status === 'pending'
  ).length;
  const confirmedCount = vendorBookings.filter(
    (b) => b.status === 'confirmed'
  ).length;
  const completedCount = vendorBookings.filter(
    (b) => b.status === 'completed'
  ).length;

  const stats = [
    { value: pendingCount, label: 'Pending' },
    { value: confirmedCount, label: 'Confirmed' },
    { value: completedCount, label: 'Completed' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <HeroSection
        title="Vendor Dashboard"
        subtitle={user?.name}
        ornament
      />

      <div className="grid grid-cols-3 gap-3 px-5 mt-5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-[#242433] rounded-[8px] border border-white/6 p-4 text-center"
          >
            <p className="text-[24px] text-gold font-serif font-normal">
              {stat.value}
            </p>
            <p className="text-[10px] uppercase tracking-[1px] text-smoke mt-1">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <div className="px-5 mt-6">
        <h2 className="text-[16px] text-ivory font-serif font-normal mb-3">
          Recent Requests
        </h2>
        <div className="flex flex-col gap-3">
          {vendorBookings.length === 0 ? (
            <p className="text-[13px] text-smoke text-center py-8">
              No booking requests yet.
            </p>
          ) : (
            vendorBookings.slice(0, 5).map((booking) => (
              <LuxCard
                key={booking.id}
                onClick={() => navigate('/requests')}
              >
                <div className="p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[13px] text-ivory font-medium">
                      {booking.clientName}
                    </span>
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
                  <p className="text-[11px] text-smoke">
                    {booking.eventType} · {formatDate(booking.eventDate)}
                  </p>
                </div>
              </LuxCard>
            ))
          )}
        </div>
      </div>

      <div className="h-24" />
    </motion.div>
  );
}
