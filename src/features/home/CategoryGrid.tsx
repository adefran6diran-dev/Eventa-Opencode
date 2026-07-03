import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  UtensilsCrossed,
  Camera,
  Building2,
  Sparkles,
  Music,
  Star,
  Car,
  Mic,
} from 'lucide-react';
import { categories, categoryIcons } from '../../data/vendors';

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

export function CategoryGrid() {
  const navigate = useNavigate();

  const displayCategories = categories.filter((c) => c.id !== 'all');

  return (
    <div className="grid grid-cols-4 gap-3 px-5">
      {displayCategories.map((cat, i) => {
        const IconComponent = iconMap[categoryIcons[cat.id]];
        return (
          <motion.button
            key={cat.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.25 }}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
            onClick={() => navigate(`/vendors?category=${cat.id}`)}
            className="flex flex-col items-center gap-2 bg-transparent border-none cursor-pointer"
          >
            <div className="w-[44px] h-[44px] rounded-full bg-gold-tint border border-gold-border flex items-center justify-center">
              {IconComponent && (
                <IconComponent size={20} color="#C9A84C" strokeWidth={1.5} />
              )}
            </div>
            <span className="text-[10px] text-smoke-2 font-semibold tracking-[0.5px] uppercase text-center">
              {cat.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
