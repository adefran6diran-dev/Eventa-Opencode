import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import type { Application } from '../../types';
import { LuxCard } from '../../components/ui/LuxCard';
import { LuxBadge } from '../../components/ui/LuxBadge';
import { LuxButton } from '../../components/ui/LuxButton';
import { GoldLine } from '../../components/ui/GoldLine';
import { useReviewApplication } from '../../hooks/useApplications';
import toast from 'react-hot-toast';

interface ApplicationCardProps {
  application: Application;
}

export function ApplicationCard({ application }: ApplicationCardProps) {
  const [expanded, setExpanded] = useState(false);
  const reviewApplication = useReviewApplication();

  const handleReview = (status: 'approved' | 'rejected') => {
    reviewApplication.mutate({ id: application.id, status, note: '' });
    toast.success(`Application ${status}!`);
  };

  return (
    <LuxCard>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[14px] text-ivory font-serif font-normal">
            {application.businessName}
          </h3>
          <LuxBadge
            variant={application.status as 'pending' | 'approved' | 'rejected'}
          >
            {application.status}
          </LuxBadge>
        </div>
        <p className="text-[12px] text-smoke">
          {application.category} · {application.city}, {application.state}
        </p>
        <p className="text-[11px] text-smoke-2 mt-1">
          {application.ownerName} · {application.email}
        </p>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-[11px] text-gold bg-transparent border-none cursor-pointer mt-2 hover:underline"
        >
          {expanded ? (
            <>
              Less <ChevronUp size={12} />
            </>
          ) : (
            <>
              More <ChevronDown size={12} />
            </>
          )}
        </button>

        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-3 pt-3 border-t border-white/5"
          >
            <div className="text-[12px] text-smoke space-y-1.5">
              <p>
                <span className="text-smoke-2">Years in business:</span>{' '}
                {application.yearsInBusiness}
              </p>
              <p>
                <span className="text-smoke-2">Price range:</span>{' '}
                {application.priceRange}
              </p>
              <p>
                <span className="text-smoke-2">Phone:</span> {application.phone}
              </p>
              {application.bio && (
                <p className="italic mt-2">{application.bio}</p>
              )}
              {application.eventTypes.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {application.eventTypes.map((t) => (
                    <LuxBadge key={t} variant="smoke">
                      {t}
                    </LuxBadge>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {application.status === 'pending' && (
          <div className="flex gap-2.5 mt-3">
            <LuxButton
              variant="success"
              size="sm"
              className="flex-1"
              onClick={() => handleReview('approved')}
            >
              <Check size={14} className="mr-1" />
              Approve
            </LuxButton>
            <LuxButton
              variant="danger"
              size="sm"
              className="flex-1"
              onClick={() => handleReview('rejected')}
            >
              <X size={14} className="mr-1" />
              Reject
            </LuxButton>
          </div>
        )}
      </div>
    </LuxCard>
  );
}
