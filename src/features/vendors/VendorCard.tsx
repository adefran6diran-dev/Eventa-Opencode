import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Camera,
  Building2,
  Sparkles,
  Music,
  Star,
  Car,
  Mic,
  UtensilsCrossed,
} from 'lucide-react';
import type { Vendor } from '../../types';
import { DiamondRating } from '../../components/ui/DiamondRating';
import { LuxBadge } from '../../components/ui/LuxBadge';
import { GoldLine } from '../../components/ui/GoldLine';
import { categoryIcons } from '../../data/vendors';

const iconMap: Record<string, React.ElementType> = {
  UtensilsCrossed,
  Camera,
  Building2,
  Sparkles,
  Music,
  Star,
  Car,
  Mic,
};

interface VendorCardProps {
  vendor: Vendor;
  onClick?: () => void;
}

export function VendorCard({ vendor, onClick }: VendorCardProps) {
  const [imgError, setImgError] = useState(false);
  const iconName = categoryIcons[vendor.category] || 'Camera';
  const IconComponent = iconMap[iconName] || iconMap.Camera;

  return (
    <motion.button
      whileHover={{ y: -3 }}
      whileTap={{ y: -1 }}
      onClick={onClick}
      className="w-full bg-[#12121A] rounded-[14px] border border-[rgba(201,168,76,0.12)] overflow-hidden shadow-md hover:border-[rgba(201,168,76,0.35)] transition-colors duration-300 cursor-pointer text-left group"
    >
      <GoldLine thin />
      <div className="p-4 flex gap-3">
        {vendor.photo && !imgError ? (
          <img
            src={vendor.photo}
            alt={vendor.name}
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-14 h-14 rounded-[8px] object-cover border border-[rgba(201,168,76,0.15)]"
            style={{
              filter: 'brightness(0.65) saturate(0.8)',
            }}
          />
        ) : (
          <div className="w-14 h-14 rounded-[8px] bg-gold-tint border border-gold-border flex items-center justify-center shrink-0">
            <IconComponent size={20} color="#C9A84C" strokeWidth={1.5} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-[15px] text-ivory font-serif font-normal truncate">
              {vendor.name}
            </h3>
            <LuxBadge variant="gold">{vendor.category}</LuxBadge>
          </div>
          <p className="text-[12px] text-smoke mt-0.5 truncate">
            {vendor.location}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <DiamondRating value={Math.round(vendor.rating)} size={11} />
            <span className="text-[11px] text-smoke">
              {vendor.rating.toFixed(1)} ({vendor.reviewCount})
            </span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}
