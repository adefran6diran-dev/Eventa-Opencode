import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface LuxSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const LuxSelect = forwardRef<HTMLSelectElement, LuxSelectProps>(
  ({ label, error, options, placeholder, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold tracking-[1.5px] uppercase text-smoke-2">
          {label}
        </label>
        <select
          ref={ref}
          className={cn(
            'w-full px-4 py-[13px] bg-charcoal border border-white/8',
            'rounded-xs text-[14px] text-ivory outline-none',
            'transition-colors duration-200 focus:border-gold',
            'appearance-none',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="text-[11px] text-error tracking-[0.3px]">{error}</p>
        )}
      </div>
    );
  }
);

LuxSelect.displayName = 'LuxSelect';
