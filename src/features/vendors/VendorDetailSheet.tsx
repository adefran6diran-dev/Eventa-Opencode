import { useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { X, MapPin, Phone, Mail, Clock, Camera } from 'lucide-react';
import type { Vendor } from '../../types';
import { BottomSheet } from '../../components/ui/BottomSheet';
import { DiamondRating } from '../../components/ui/DiamondRating';
import { LuxBadge } from '../../components/ui/LuxBadge';
import { BookingForm } from './BookingForm';
import { useReviews } from '../../hooks/useReviews';

interface VendorDetailSheetProps {
  vendor: Vendor | null;
  open: boolean;
  onClose: () => void;
}

export function VendorDetailSheet({
  vendor,
  open,
  onClose,
}: VendorDetailSheetProps) {
  const [tab, setTab] = useState('info');

  if (!vendor) return null;

  return (
    <BottomSheet open={open} onClose={onClose}>
      <div className="relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-0 z-10 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center border-none cursor-pointer"
        >
          <X size={14} color="#F8F4EC" />
        </button>

        <div className="flex flex-col items-center text-center pt-2 pb-4">
          {vendor.photo ? (
            <img
              src={vendor.photo}
              alt={vendor.name}
              loading="lazy"
              className="w-16 h-16 rounded-full object-cover mb-3 border-2 border-[rgba(201,168,76,0.2)]"
              style={{
                filter: 'brightness(0.65) saturate(0.8)',
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gold-tint border-2 border-[rgba(201,168,76,0.2)] flex items-center justify-center mb-3">
              <Camera size={22} color="#C9A84C" strokeWidth={1.5} />
            </div>
          )}
          <h2 className="text-[18px] text-ivory font-serif font-normal">
            {vendor.name}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <LuxBadge variant="gold">{vendor.category}</LuxBadge>
            <span className="text-[12px] text-smoke">{vendor.location}</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <DiamondRating
              value={Math.round(vendor.rating)}
              size={13}
            />
            <span className="text-[12px] text-smoke">
              {vendor.rating.toFixed(1)} ({vendor.reviewCount} reviews)
            </span>
          </div>
        </div>

        <Tabs.Root value={tab} onValueChange={setTab}>
          <Tabs.List className="flex bg-[#12121A] border-b border-white/6 overflow-x-auto hide-scrollbar">
            {['info', 'book', 'reviews'].map((t) => (
              <Tabs.Trigger
                key={t}
                value={t}
                className="px-[18px] py-[14px] text-[12px] font-semibold tracking-[0.5px] uppercase whitespace-nowrap transition-all bg-transparent border-none cursor-pointer"
                style={{
                  color: tab === t ? '#C9A84C' : '#6B6B7E',
                  borderBottom: tab === t ? '2px solid #C9A84C' : '2px solid transparent',
                  marginBottom: -1,
                }}
              >
                {t === 'info' && 'Info'}
                {t === 'book' && 'Book'}
                {t === 'reviews' && 'Reviews'}
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          <div className="pt-4">
            {tab === 'info' && (
              <div>
                <p className="text-[13px] text-ivory2 leading-relaxed">
                  {vendor.bio}
                </p>
                <div className="mt-4 flex flex-col gap-3">
                  <div className="flex items-center gap-2.5">
                    <MapPin size={15} color="#6B6B7E" strokeWidth={1.5} />
                    <span className="text-[13px] text-ivory2">
                      {vendor.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone size={15} color="#6B6B7E" strokeWidth={1.5} />
                    <span className="text-[13px] text-ivory2">
                      {vendor.phone}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Mail size={15} color="#6B6B7E" strokeWidth={1.5} />
                    <span className="text-[13px] text-ivory2">
                      {vendor.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock size={15} color="#6B6B7E" strokeWidth={1.5} />
                    <span className="text-[13px] text-ivory2">
                      ₦{vendor.price}
                    </span>
                  </div>
                </div>
                {vendor.tags && vendor.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {vendor.tags.map((tag) => (
                      <LuxBadge key={tag} variant="smoke">
                        {tag}
                      </LuxBadge>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === 'book' && (
              <BookingForm vendor={vendor} onSuccess={onClose} />
            )}

            {tab === 'reviews' && (
              <ReviewsTab vendorId={vendor.id} />
            )}
          </div>
        </Tabs.Root>
      </div>
    </BottomSheet>
  );
}

function ReviewsTab({ vendorId }: { vendorId: string }) {
  const { data: reviews = [] } = useReviews(vendorId);

  if (reviews.length === 0) {
    return (
      <p className="text-[13px] text-smoke text-center py-8">
        No reviews yet. Be the first to review!
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="bg-[#242433] rounded-[8px] p-3 border border-white/6"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[13px] text-ivory font-medium">
              {review.clientName}
            </span>
            <DiamondRating value={review.rating} size={11} />
          </div>
          <p className="text-[12px] text-smoke leading-relaxed">
            {review.comment}
          </p>
        </div>
      ))}
    </div>
  );
}
