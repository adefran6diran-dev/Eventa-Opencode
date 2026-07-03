import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useLocation } from 'react-router-dom';
import { Search, UtensilsCrossed, Camera, Building2, Sparkles, Music, Star, Car, Mic } from 'lucide-react';
import { useVendors } from '../../hooks/useVendors';
import { categories, categoryIcons } from '../../data/vendors';
import type { Vendor } from '../../types';
import { PageHeader } from '../../components/layout/PageHeader';
import { VendorCard } from './VendorCard';
import { VendorDetailSheet } from './VendorDetailSheet';
import { cn } from '../../lib/utils';

const iconMap: Record<string, React.ElementType> = {
  UtensilsCrossed, Camera, Building2, Sparkles, Music, Star, Car, Mic,
};

export function VendorsPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const categoryParam = searchParams.get('category') || 'all';

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(categoryParam);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const { data: vendors = [] } = useVendors(activeCategory, search);

  useEffect(() => {
    if (categoryParam !== 'all') {
      setActiveCategory(categoryParam);
    }
  }, [categoryParam]);

  const handleVendorClick = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setSheetOpen(true);
  };

  useEffect(() => {
    const state = location.state as { vendorId?: string } | null;
    if (state?.vendorId) {
      const vendor = vendors.find((v) => v.id === state.vendorId);
      if (vendor) {
        setSelectedVendor(vendor);
        setSheetOpen(true);
      }
      window.history.replaceState({}, '');
    }
  }, [location.state, vendors]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <PageHeader
        title="Vendors"
        subtitle="Find the perfect vendor for your event"
      />

      <div className="px-5 pt-4 pb-2">
        <div className="relative">
          <Search
            size={16}
            strokeWidth={1.5}
            className="absolute left-[13px] top-1/2 -translate-y-1/2"
            style={{ color: '#9494A8' }}
          />
          <input
            type="text"
            placeholder="Search vendors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 pl-10 bg-[#242433] border border-white/8 rounded-[8px] text-[14px] text-[#F8F4EC] placeholder-[#6B6B7E] outline-none transition-colors duration-200 focus:border-[#C9A84C]"
          />
        </div>
      </div>

      <div className="px-5 pb-3">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            const IconName = cat.id !== 'all' ? categoryIcons[cat.id] : null;
            const IconComponent = IconName ? iconMap[IconName] : null;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  'rounded-full px-[18px] py-2 text-[12px] font-semibold tracking-[0.5px] whitespace-nowrap cursor-pointer flex-shrink-0 flex items-center gap-1.5 transition-all',
                  isActive
                    ? 'bg-[#C9A84C] text-[#0A0A0F] border-2 border-[#C9A84C]'
                    : 'bg-transparent text-white/70 border border-white/15'
                )}
              >
                {IconComponent && <IconComponent size={14} strokeWidth={1.5} color={isActive ? '#0A0A0F' : '#C9A84C'} />}
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-5 pb-24 flex flex-col gap-3">
        {vendors.length === 0 ? (
          <p className="text-[13px] text-smoke text-center py-12">
            No vendors found matching your search.
          </p>
        ) : (
          vendors.map((vendor, i) => (
            <motion.div
              key={vendor.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.25 }}
            >
              <VendorCard
                vendor={vendor}
                onClick={() => handleVendorClick(vendor)}
              />
            </motion.div>
          ))
        )}
      </div>

      <VendorDetailSheet
        vendor={selectedVendor}
        open={sheetOpen}
        onClose={() => {
          setSheetOpen(false);
          setSelectedVendor(null);
        }}
      />
    </motion.div>
  );
}
