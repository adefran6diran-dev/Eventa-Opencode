import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { GoldLine } from './GoldLine';

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function BottomSheet({ open, onClose, children }: BottomSheetProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[200]"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '100%', opacity: 0 }}
                transition={{
                  type: 'spring',
                  damping: 30,
                  stiffness: 300,
                }}
                className="fixed bottom-0 left-0 right-0 z-[201] outline-none mx-auto"
                style={{ maxWidth: 480 }}
              >
                <div className="bg-[#12121A] border-t border-[rgba(201,168,76,0.2)] max-h-[92dvh] overflow-y-auto rounded-t-[24px]">
                  <GoldLine />
                  <div className="flex justify-center pt-3 pb-1">
                    <div className="w-8 h-1 rounded-full bg-white/20" />
                  </div>
                  <div className="px-5 pb-8">{children}</div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
