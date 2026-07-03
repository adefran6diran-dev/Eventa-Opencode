import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useVendors } from '../../hooks/useVendors';
import { LuxCard } from '../../components/ui/LuxCard';
import { DiamondRating } from '../../components/ui/DiamondRating';

export function FeaturedVendors() {
  const { data: vendors = [] } = useVendors();
  const navigate = useNavigate();

  const featured = vendors.slice(0, 3);

  if (featured.length === 0) return null;

  return (
    <div className="px-5 mt-6">
      <h2 className="text-[16px] text-ivory font-serif font-normal mb-3">
        Featured Vendors
      </h2>
      <div className="flex flex-col gap-3">
        {featured.map((vendor, i) => (
          <motion.div
            key={vendor.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.25 }}
          >
            <LuxCard
              onClick={() =>
                navigate(`/vendors`, { state: { vendorId: vendor.id } })
              }
            >
              <div className="p-3 flex items-center gap-3">
                {vendor.photo ? (
                  <img
                    src={vendor.photo}
                    alt={vendor.name}
                    loading="lazy"
                    className="w-12 h-12 rounded-[8px] object-cover"
                    style={{
                      filter: 'brightness(0.65) saturate(0.8)',
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-12 h-12 rounded-[8px] bg-gold-tint border border-gold-border flex items-center justify-center">
                    <span className="text-[12px] text-gold font-serif">
                      {vendor.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-[14px] text-ivory font-serif font-normal truncate">
                    {vendor.name}
                  </h3>
                  <p className="text-[11px] text-smoke truncate">
                    {vendor.category} · {vendor.location}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <DiamondRating
                      value={Math.round(vendor.rating)}
                      size={10}
                    />
                    <span className="text-[10px] text-smoke">
                      {vendor.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            </LuxCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
