import { GoldLine } from '../ui/GoldLine';
import { cn } from '../../lib/utils';

interface HeroSectionProps {
  label?: string;
  title: string;
  subtitle?: string;
  ornament?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export function HeroSection({
  label,
  title,
  subtitle,
  ornament = false,
  children,
  className,
}: HeroSectionProps) {
  return (
    <section
      className={cn(
        'bg-[#12121A] px-5 pt-[52px] pb-6 relative overflow-hidden',
        'border-b border-[rgba(201,168,76,0.1)]',
        className
      )}
    >
      <div
        className="absolute top-[-60px] right-[-60px] w-[200px] h-[200px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%)',
        }}
      />
      <GoldLine className="mb-5" />
      {ornament && (
        <p className="text-[11px] text-gold uppercase tracking-[6px] opacity-70 mb-4">
          — EVENTA —
        </p>
      )}
      {label && (
        <p className="text-[11px] text-gold uppercase tracking-[2px] mb-1.5">
          {label}
        </p>
      )}
      <h1 className="text-[22px] md:text-[26px] text-ivory font-serif font-normal">
        {title}
      </h1>
      {subtitle && (
        <p className="text-[13px] text-smoke mt-1.5">{subtitle}</p>
      )}
      {children}
    </section>
  );
}
