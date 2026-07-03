import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { Spinner } from './Spinner';

interface LuxButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export function LuxButton({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className,
  disabled,
  ...props
}: LuxButtonProps) {
  const base =
    'font-sans transition-all duration-250 ease-in-out disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center';

  const sizes: Record<string, string> = {
    sm: 'px-[18px] py-[9px] text-[12px]',
    md: 'px-[28px] py-[13px] text-[13px]',
    lg: 'px-[36px] py-[16px] text-[14px]',
  };

  const variants: Record<string, string> = {
    primary:
      'bg-gradient-to-br from-[#C9A84C] to-[#E8C97A] text-[#0A0A0F] shadow-gold hover:brightness-110',
    outline:
      'bg-transparent border border-gold text-gold hover:bg-[rgba(201,168,76,0.08)]',
    ghost:
      'bg-transparent border border-white/10 text-smoke-2 hover:border-white/25 hover:text-ivory',
    success:
      'bg-emerald-light border border-emerald/50 text-success',
    danger:
      'bg-crimson-light border border-crimson/50 text-error',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={cn(
        base,
        'rounded-[8px]',
        'uppercase tracking-[0.1em] font-semibold',
        sizes[size],
        variants[variant],
        className
      )}
      disabled={disabled || loading}
      {...(props as any)}
    >
      {loading ? (
        <span className="flex items-center gap-2 min-w-[80px] justify-center">
          <Spinner />
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
}
