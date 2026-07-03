import { cn } from '../../lib/utils';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  rightAction?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  rightAction,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-50 bg-[#12121A] border-b border-[rgba(201,168,76,0.1)]',
        'px-5 pt-[52px] pb-3 shadow-md',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] text-ivory font-serif font-normal">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[13px] text-smoke mt-0.5">{subtitle}</p>
          )}
        </div>
        {rightAction && <div>{rightAction}</div>}
      </div>
    </header>
  );
}
