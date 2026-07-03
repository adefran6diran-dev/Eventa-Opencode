import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApplications } from '../../hooks/useApplications';
import { useVendors } from '../../hooks/useVendors';
import { useBookings } from '../../hooks/useBookings';
import { HeroSection } from '../../components/layout/HeroSection';
import { ApplicationCard } from './ApplicationCard';
import { LuxBadge } from '../../components/ui/LuxBadge';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export function AdminDashboardPage() {
  const { data: applications = [] } = useApplications();
  const { data: vendors = [] } = useVendors();
  const { data: bookings = [] } = useBookings();
  const [tab, setTab] = useState('applications');
  const { logout } = useAuth();
  const navigate = useNavigate();

  const pendingApps = applications.filter((a) => a.status === 'pending');

  const stats = [
    { value: pendingApps.length, label: 'Pending Apps' },
    { value: vendors.length, label: 'Active Vendors' },
    { value: bookings.length, label: 'Total Bookings' },
  ];

  const tabs = [
    { id: 'applications', label: 'Applications', count: pendingApps.length },
    { id: 'vendors', label: 'Vendors', count: vendors.length },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <HeroSection
        title="Admin Dashboard"
        label="Eventa"
        ornament
      >
        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="flex items-center gap-2 bg-transparent border border-white/10 text-smoke-2 rounded-[8px] px-4 py-2 text-[11px] mt-3 hover:border-white/25 hover:text-ivory transition-all cursor-pointer"
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </HeroSection>

      <div className="grid grid-cols-3 gap-3 px-5 mt-5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-[#242433] rounded-[8px] border border-white/6 p-4 text-center"
          >
            <p className="text-[24px] text-gold font-serif font-normal">
              {stat.value}
            </p>
            <p className="text-[10px] uppercase tracking-[1px] text-smoke mt-1">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <div className="flex border-b border-white/6 overflow-x-auto hide-scrollbar px-5 mt-6">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="px-[18px] py-[14px] text-[12px] font-semibold tracking-[0.5px] uppercase whitespace-nowrap transition-all bg-transparent border-none cursor-pointer flex items-center gap-1.5"
            style={{
              color: tab === t.id ? '#C9A84C' : '#6B6B7E',
              borderBottom:
                tab === t.id ? '2px solid #C9A84C' : '2px solid transparent',
              marginBottom: -1,
            }}
          >
            {t.label}
            <span className="bg-gold-tint text-gold rounded-full text-[10px] px-[7px] py-[1px]">
              {t.count}
            </span>
          </button>
        ))}
      </div>

      <div className="px-5 pt-4 pb-24 flex flex-col gap-3">
        {tab === 'applications' && (
          <>
            {applications.length === 0 ? (
              <p className="text-[13px] text-smoke text-center py-12">
                No vendor applications yet.
              </p>
            ) : (
              applications.map((app) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <ApplicationCard application={app} />
                </motion.div>
              ))
            )}
          </>
        )}

        {tab === 'vendors' && (
          <>
            {vendors.length === 0 ? (
              <p className="text-[13px] text-smoke text-center py-12">
                No approved vendors yet.
              </p>
            ) : (
              vendors.map((vendor) => (
                <div
                  key={vendor.id}
                  className="bg-[#12121A] rounded-[14px] border border-[rgba(201,168,76,0.12)] p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gold-tint border border-gold-border flex items-center justify-center">
                      <span className="text-gold font-serif">
                        {vendor.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-[14px] text-ivory font-serif font-normal">
                        {vendor.name}
                      </h3>
                      <p className="text-[11px] text-smoke">
                        {vendor.category} · {vendor.location}
                      </p>
                    </div>
                    <LuxBadge variant="success" className="ml-auto">
                      Active
                    </LuxBadge>
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
