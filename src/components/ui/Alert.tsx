import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface AlertProps {
  variant?: 'error' | 'success' | 'info';
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

const variantStyles: Record<string, string> = {
  error:
    'bg-[rgba(122,31,46,0.12)] text-[#E07085] border border-[rgba(224,112,133,0.25)]',
  success:
    'bg-[rgba(26,71,49,0.15)] text-[#6FCF97] border border-[rgba(111,207,151,0.2)]',
  info: 'bg-[rgba(201,168,76,0.1)] text-[#E8C97A] border border-[rgba(201,168,76,0.2)]',
};

export function Alert({
  variant = 'info',
  children,
  onClose,
  className,
}: AlertProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-2.5 px-4 py-[14px] rounded-[8px] text-[13px] font-medium',
        variantStyles[variant],
        className
      )}
    >
      <span className="flex-1">{children}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="bg-transparent border-none text-inherit cursor-pointer opacity-60 hover:opacity-100 p-0 leading-none"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
