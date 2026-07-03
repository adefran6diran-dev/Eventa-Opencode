import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { PageHeader } from '../../components/layout/PageHeader';
import { Avatar } from '../../components/ui/Avatar';
import { LuxButton } from '../../components/ui/LuxButton';
import { LuxCard } from '../../components/ui/LuxCard';

export function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const infoRows = [
    { label: 'Email', value: user?.email },
    { label: 'Role', value: user?.role },
    { label: 'Member Since', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-' },
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
          <Avatar name={user?.name || 'User'} size={64} />
          <h2 className="text-[18px] text-ivory font-serif font-normal mt-3">
            {user?.name}
          </h2>
          <p className="text-[12px] text-smoke mt-0.5 capitalize">
            {user?.role}
          </p>
        </div>

        <LuxCard className="mb-6">
          <div className="p-4">
            {infoRows.map((row, i) => (
              <div
                key={row.label}
                className={`flex justify-between items-start py-3 ${
                  i < infoRows.length - 1
                    ? 'border-b border-white/5'
                    : ''
                }`}
              >
                <span className="text-[11px] uppercase tracking-[1px] text-smoke">
                  {row.label}
                </span>
                <span className="text-[13px] font-medium text-ivory2 text-right max-w-[60%]">
                  {row.value || '-'}
                </span>
              </div>
            ))}
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
