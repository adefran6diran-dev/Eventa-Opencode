import { useState } from 'react';
import { cn } from '../../lib/utils';

interface DiamondRatingProps {
  value: number;
  max?: number;
  size?: number;
  interactive?: boolean;
  onChange?: (value: number) => void;
}

export function DiamondRating({
  value,
  max = 5,
  size = 14,
  interactive = false,
  onChange,
}: DiamondRatingProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const display = hovered ?? value;

  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(null)}
          style={{
            fontSize: size,
            cursor: interactive ? 'pointer' : 'default',
          }}
          className={cn(
            'transition-colors duration-150 bg-transparent border-none p-0 leading-none',
            star <= display ? 'text-gold' : 'text-charcoal-2'
          )}
        >
          ◆
        </button>
      ))}
    </div>
  );
}
