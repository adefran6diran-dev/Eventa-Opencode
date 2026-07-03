import { cn } from '../../lib/utils';

interface GoldLineProps {
  thin?: boolean;
  className?: string;
}

export function GoldLine({ thin = false, className }: GoldLineProps) {
  return (
    <div
      className={cn('w-full', className)}
      style={{
        height: thin ? '1px' : '2px',
        background: thin
          ? 'linear-gradient(90deg, transparent, #C9A84C, transparent)'
          : 'linear-gradient(90deg, transparent, #C9A84C 30%, #E8C97A 50%, #C9A84C 70%, transparent)',
      }}
    />
  );
}
