import type { Booking } from '../../types';
import { LuxBadge } from '../../components/ui/LuxBadge';
import { cn, formatDate } from '../../lib/utils';

interface BookingCardProps {
  booking: Booking;
  onClick?: () => void;
}

export function BookingCard({ booking, onClick }: BookingCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-[#12121A] rounded-[14px] border border-[rgba(201,168,76,0.12)] overflow-hidden text-left cursor-pointer hover:border-[rgba(201,168,76,0.35)] transition-colors duration-300"
      style={{ borderTop: '1px solid rgba(201,168,76,0.25)' }}
    >
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent" />
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[14px] text-ivory font-serif font-normal">
            {booking.vendorName}
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
        <div className="flex items-center gap-3 text-[12px] text-smoke">
          <span>{booking.eventType}</span>
          <span>·</span>
          <span>{formatDate(booking.eventDate)}</span>
        </div>
        <p className="text-[12px] text-smoke-2 mt-1.5 truncate">
          {booking.message}
        </p>
      </div>
    </button>
  );
}
