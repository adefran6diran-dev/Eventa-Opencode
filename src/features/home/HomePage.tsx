import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { HeroSection } from '../../components/layout/HeroSection';
import { CategoryGrid } from './CategoryGrid';
import { FeaturedVendors } from './FeaturedVendors';

export function HomePage() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <HeroSection
        ornament
        title="Luxury Event Planning"
        subtitle="Connect with Nigeria's premier event vendors"
      >
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => navigate('/vendors')}
            className="flex items-center gap-2 bg-gradient-to-br from-[#C9A84C] to-[#E8C97A] text-[#0A0A0F] rounded-[8px] px-5 py-[11px] text-[12px] font-semibold uppercase tracking-[0.1em] shadow-gold hover:brightness-110 transition-all border-none cursor-pointer"
          >
            <Sparkles size={15} strokeWidth={1.5} />
            Explore Vendors
          </button>
          <button
            onClick={() => navigate('/apply')}
            className="flex items-center gap-2 bg-transparent border border-white/10 text-smoke-2 rounded-[8px] px-5 py-[11px] text-[12px] font-semibold uppercase tracking-[0.1em] hover:border-white/25 hover:text-ivory transition-all cursor-pointer"
          >
            Join as Vendor
            <ArrowRight size={14} strokeWidth={1.5} />
          </button>
        </div>
      </HeroSection>

      <div className="py-6">
        <div className="flex items-center justify-between px-5 mb-4">
          <p className="text-[11px] text-gold uppercase tracking-[2px]">
            Categories
          </p>
          <button
            onClick={() => navigate('/vendors')}
            className="text-[11px] text-smoke-2 bg-transparent border-none cursor-pointer hover:text-gold transition-colors"
          >
            View All
          </button>
        </div>
        <CategoryGrid />
      </div>

      <FeaturedVendors />

      <div className="h-5" />
    </motion.div>
  );
}
