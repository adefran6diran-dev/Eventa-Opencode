import { useState } from 'react';
import { motion } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';
import { GoldLine } from '../../components/ui/GoldLine';
import { DiamondRating } from '../../components/ui/DiamondRating';
import { LuxTextarea } from '../../components/ui/LuxTextarea';
import { LuxButton } from '../../components/ui/LuxButton';
import { useSubmitReview } from '../../hooks/useReviews';
import toast from 'react-hot-toast';

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  bookingId: string;
  vendorId: string;
}

export function ReviewModal({
  open,
  onClose,
  bookingId,
  vendorId,
}: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const submitReview = useSubmitReview();

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    if (comment.length < 5) {
      toast.error('Please write a review comment');
      return;
    }
    submitReview.mutate(
      { bookingId, vendorId, rating, comment },
      {
        onSuccess: () => {
          toast.success('Review submitted!');
          onClose();
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.error || 'Failed to submit review');
        },
      }
    );
  };

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[200]" />
        <Dialog.Content asChild>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed inset-0 z-[201] flex items-center justify-center p-5 outline-none"
          >
            <div className="bg-[#12121A] rounded-[20px] w-full max-w-[400px] overflow-hidden">
              <GoldLine />
              <div className="p-5">
                <h2 className="text-[18px] text-ivory font-serif font-normal text-center mb-4">
                  Rate Your Experience
                </h2>
                <div className="flex justify-center mb-4">
                  <DiamondRating
                    value={rating}
                    size={28}
                    interactive
                    onChange={setRating}
                  />
                </div>
                <LuxTextarea
                  label="Your Review"
                  placeholder="Tell us about your experience..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <div className="flex gap-2.5 mt-4">
                  <LuxButton
                    variant="ghost"
                    onClick={onClose}
                    className="flex-1"
                  >
                    Cancel
                  </LuxButton>
                  <LuxButton onClick={handleSubmit} className="flex-[2]">
                    Submit Review
                  </LuxButton>
                </div>
              </div>
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
