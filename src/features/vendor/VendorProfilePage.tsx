import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { PageHeader } from '../../components/layout/PageHeader';
import { Avatar } from '../../components/ui/Avatar';
import { LuxCard } from '../../components/ui/LuxCard';
import { LuxBadge } from '../../components/ui/LuxBadge';
import { LuxButton } from '../../components/ui/LuxButton';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function VendorProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const infoRows = [
    { label: 'Email', value: user?.email },
    { label: 'Category', value: user?.category },
    { label: 'Location', value: user?.location },
    { label: 'Price Range', value: user?.price },
    { label: 'Rating', value: user?.rating?.toFixed(1) },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <PageHeader title="Profile" />

      <div className="px-5 pt-6 pb-24">
        <div className="flex flex-col items-center mb-8">
          <Avatar name={user?.name || 'Vendor'} size={64} />
          <h2 className="text-[18px] text-ivory font-serif font-normal mt-3">
            {user?.name}
          </h2>
          {user?.category && (
            <LuxBadge variant="gold" className="mt-1">
              {user.category}
            </LuxBadge>
          )}
        </div>

        <LuxCard className="mb-6">
          <div className="p-4">
            {infoRows.map((row, i) =>
              row.value ? (
                <div
                  key={row.label}
                  className={`flex justify-between items-start py-3 ${
                    i < infoRows.length - 1 ? 'border-b border-white/5' : ''
                  }`}
                >
                  <span className="text-[11px] uppercase tracking-[1px] text-smoke">
                    {row.label}
                  </span>
                  <span className="text-[13px] font-medium text-ivory2 text-right max-w-[60%]">
                    {row.value}
                  </span>
                </div>
              ) : null
            )}
            {user?.tags && user.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-3">
                {user.tags.map((tag) => (
                  <LuxBadge key={tag} variant="smoke">
                    {tag}
                  </LuxBadge>
                ))}
              </div>
            )}
          </div>
        </LuxCard>

        <LuxButton
          variant="danger"
          onClick={handleLogout}
          className="w-full"
        >
          <LogOut size={16} strokeWidth={1.5} className="mr-2" />
          Sign Out
        </LuxButton>
      </div>
    </motion.div>
  );
}
