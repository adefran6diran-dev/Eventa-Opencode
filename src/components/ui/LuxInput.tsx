import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface LuxInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const LuxInput = forwardRef<HTMLInputElement, LuxInputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold tracking-[1.5px] uppercase text-smoke-2">
          {label}
        </label>
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-[13px] bg-charcoal border border-white/8',
            'rounded-xs text-[14px] text-ivory placeholder-smoke outline-none',
            'transition-colors duration-200 focus:border-gold',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-[11px] text-error tracking-[0.3px]">{error}</p>
        )}
      </div>
    );
  }
);

LuxInput.displayName = 'LuxInput';
