import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { GoldLine } from './GoldLine';

interface LuxCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function LuxCard({ children, onClick, className }: LuxCardProps) {
  return (
    <motion.div
      whileHover={onClick ? { y: -3 } : {}}
      whileTap={onClick ? { y: -1 } : {}}
      onClick={onClick}
      className={cn(
        'bg-[#12121A] rounded-[14px] border border-[rgba(201,168,76,0.12)]',
        'overflow-hidden shadow-md transition-colors duration-300',
        onClick && 'cursor-pointer hover:border-[rgba(201,168,76,0.35)]',
        className
      )}
    >
      <GoldLine thin />
      {children}
    </motion.div>
  );
}
