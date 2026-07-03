import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface LuxTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  charCount?: number;
  maxChars?: number;
}

export const LuxTextarea = forwardRef<HTMLTextAreaElement, LuxTextareaProps>(
  ({ label, error, charCount, maxChars, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold tracking-[1.5px] uppercase text-smoke-2">
          {label}
        </label>
        <textarea
          ref={ref}
          className={cn(
            'w-full px-4 py-[13px] bg-charcoal border border-white/8',
            'rounded-xs text-[14px] text-ivory placeholder-smoke outline-none',
            'transition-colors duration-200 focus:border-gold resize-none min-h-[100px]',
            className
          )}
          {...props}
        />
        {maxChars !== undefined && charCount !== undefined && (
          <p
            className={cn(
              'text-[11px] text-right',
              charCount >= maxChars ? 'text-error' : 'text-smoke'
            )}
          >
            {charCount}/{maxChars}
          </p>
        )}
        {error && (
          <p className="text-[11px] text-error tracking-[0.3px]">{error}</p>
        )}
      </div>
    );
  }
);

LuxTextarea.displayName = 'LuxTextarea';
