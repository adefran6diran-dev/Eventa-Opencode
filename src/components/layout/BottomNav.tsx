import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Grid3X3, Calendar, User } from 'lucide-react';
import { cn } from '../../lib/utils';

interface NavItem {
  path: string;
  icon: React.ElementType;
  label: string;
}

const clientNav: NavItem[] = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/vendors', icon: Grid3X3, label: 'Vendors' },
  { path: '/bookings', icon: Calendar, label: 'Bookings' },
  { path: '/profile', icon: User, label: 'Profile' },
];

const vendorNav: NavItem[] = [
  { path: '/dashboard', icon: Home, label: 'Dashboard' },
  { path: '/requests', icon: Calendar, label: 'Requests' },
  { path: '/v-profile', icon: User, label: 'Profile' },
];

interface BottomNavProps {
  role?: 'client' | 'vendor';
}

export function BottomNav({ role = 'client' }: BottomNavProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const navItems = role === 'vendor' ? vendorNav : clientNav;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-100 mx-auto"
      style={{
        maxWidth: 480,
        background: '#12121A',
        borderTop: '1px solid rgba(201,168,76,0.2)',
        paddingBottom: 'env(safe-area-inset-bottom, 0)',
        height: 64,
      }}
    >
      <div className="flex items-center h-full">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex-1 flex flex-col items-center justify-center h-full relative bg-transparent border-none cursor-pointer"
            >
              {isActive && (
                <div
                  className="absolute top-0 left-[10%] right-[10%] h-[2px]"
                  style={{
                    background: '#C9A84C',
                    marginTop: -1,
                  }}
                />
              )}
              <Icon
                size={20}
                strokeWidth={1.5}
                style={{
                  color: isActive ? '#C9A84C' : 'rgba(255,255,255,0.35)',
                }}
              />
              <span
                className="text-[9px] uppercase tracking-[1px] font-bold mt-0.5"
                style={{
                  color: isActive
                    ? '#C9A84C'
                    : 'rgba(255,255,255,0.4)',
                }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
