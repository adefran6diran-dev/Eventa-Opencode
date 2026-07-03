import { cn, getInitials } from '../../lib/utils';

interface AvatarProps {
  name: string;
  size?: number;
  className?: string;
}

const COLOR_PAIRS = [
  { bg: '#E6F5EE', text: '#006B3F' },
  { bg: '#FDECEA', text: '#C0392B' },
  { bg: '#FFF8E1', text: '#E8A000' },
  { bg: '#E8EAF6', text: '#1A237E' },
  { bg: '#FBE9E7', text: '#7B1D1D' },
];

function getColorPair(name: string) {
  const index = name.charCodeAt(0) % COLOR_PAIRS.length;
  return COLOR_PAIRS[index];
}

export function Avatar({ name, size = 40, className }: AvatarProps) {
  const colors = getColorPair(name);
  const initials = getInitials(name);

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-serif font-normal',
        className
      )}
      style={{
        width: size,
        height: size,
        backgroundColor: colors.bg,
        color: colors.text,
        fontSize: size * 0.42,
        border: '2px solid rgba(201,168,76,0.2)',
      }}
    >
      {initials}
    </div>
  );
}
