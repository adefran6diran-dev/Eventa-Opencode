import { cn } from '../../lib/utils';

interface LuxBadgeProps {
  variant?: 'gold' | 'smoke' | 'success' | 'error' | 'info' | 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'approved' | 'rejected';
  children: React.ReactNode;
  className?: string;
}

const variantMap: Record<string, string> = {
  gold: 'bg-gold-tint text-gold-2 border-gold-border',
  smoke: 'bg-white/6 text-smoke-2 border-white/10',
  success: 'bg-emerald-light text-success border-success/20',
  error: 'bg-crimson-light text-error border-error/20',
  info: 'bg-sapphire-light text-info border-info/20',
  pending: 'bg-gold-tint text-gold-2 border-gold-border',
  confirmed: 'bg-emerald-light text-success border-success/20',
  completed: 'bg-sapphire-light text-info border-info/20',
  cancelled: 'bg-crimson-light text-error border-error/20',
  approved: 'bg-emerald-light text-success border-success/20',
  rejected: 'bg-crimson-light text-error border-error/20',
};

export function LuxBadge({ variant = 'smoke', children, className }: LuxBadgeProps) {
  return (
    <span
      className={cn(
        'rounded-full px-3 py-1 text-[11px] font-semibold tracking-[0.5px] border inline-flex items-center gap-1',
        variantMap[variant] || variantMap.smoke,
        className
      )}
    >
      {children}
    </span>
  );
}
