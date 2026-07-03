import { cn } from '../../lib/utils';

interface SpinnerProps {
  className?: string;
}

export function Spinner({ className }: SpinnerProps) {
  return (
    <div
      className={cn('w-[18px] h-[18px] rounded-full animate-spin', className)}
      style={{
        border: '2px solid rgba(201,168,76,0.3)',
        borderTopColor: '#C9A84C',
      }}
    />
  );
}
