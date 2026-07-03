import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { CheckCircle, ChevronLeft, Sparkles } from 'lucide-react';
import api from '../../lib/api';
import { GoldLine } from '../../components/ui/GoldLine';
import { LuxInput } from '../../components/ui/LuxInput';
import { LuxButton } from '../../components/ui/LuxButton';
import { Alert } from '../../components/ui/Alert';

const emailSchema = z.object({
  email: z.string().email('Enter a valid email'),
});

const codeSchema = z.object({
  code: z.string().length(6, 'Enter the 6-digit code'),
});

const passwordSchema = z
  .object({
    password: z.string().min(6, 'Minimum 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type Step = 1 | 2 | 3 | 4;

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');

  const requestReset = useMutation({
    mutationFn: async (emailVal: string) => {
      const res = await api.post('/auth/forgot', { email: emailVal });
      return res.data;
    },
    onSuccess: () => setStep(2),
    onError: (err: any) => setError(err.response?.data?.error || 'Something went wrong'),
  });

  const verifyCode = useMutation({
    mutationFn: async (code: string) => {
      const res = await api.post('/auth/verify-code', { email, code });
      return res.data;
    },
    onSuccess: () => setStep(3),
    onError: (err: any) => setError(err.response?.data?.error || 'Invalid code'),
  });

  const resetPw = useMutation({
    mutationFn: async (password: string) => {
      const res = await api.post('/auth/reset-password', { email, code: codeForm.getValues('code'), password });
      return res.data;
    },
    onSuccess: () => setStep(4),
    onError: (err: any) => setError(err.response?.data?.error || 'Something went wrong'),
  });

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
  });

  const codeForm = useForm<z.infer<typeof codeSchema>>({
    resolver: zodResolver(codeSchema),
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
  });

  const handleEmailSubmit = async () => {
    setError('');
    const emailVal = emailForm.getValues('email');
    setEmail(emailVal);
    requestReset.mutate(emailVal);
  };

  const handleCodeSubmit = async () => {
    setError('');
    verifyCode.mutate(codeForm.getValues('code'));
  };

  const handlePasswordSubmit = async () => {
    setError('');
    resetPw.mutate(passwordForm.getValues('password'));
  };

  const isLoading = requestReset.isPending || verifyCode.isPending || resetPw.isPending;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="min-h-[100dvh] bg-obsidian"
    >
      <div className="bg-[#12121A] text-center px-7 pt-14 pb-10">
        <p className="text-[11px] text-gold uppercase tracking-[6px] opacity-70 mb-4">
          — EVENTA —
        </p>
        <Sparkles size={24} color="#C9A84C" className="mx-auto" />
        <h1 className="font-serif text-[22px] text-ivory font-normal mt-3">
          {step === 1 && 'Reset Password'}
          {step === 2 && 'Enter Reset Code'}
          {step === 3 && 'New Password'}
          {step === 4 && 'Password Updated'}
        </h1>
        <p className="text-[13px] text-smoke mt-1.5">
          {step === 1 && 'Enter your email to receive a reset code'}
          {step === 2 && 'Check your email for the 6-digit code'}
          {step === 3 && 'Create a strong new password'}
          {step === 4 && 'Your password has been reset successfully'}
        </p>
      </div>

      <div className="px-6 pt-6 pb-12">
        <div className="flex gap-1 mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className="flex-1 h-[2px] rounded-full transition-colors duration-300"
              style={{
                background:
                  s <= step
                    ? 'linear-gradient(90deg, #C9A84C, #E8C97A)'
                    : 'rgba(255,255,255,0.06)',
              }}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
            >
              <form
                onSubmit={emailForm.handleSubmit(handleEmailSubmit)}
                className="flex flex-col gap-4"
              >
                <LuxInput
                  label="Email Address"
                  type="email"
                  placeholder="your@email.com"
                  error={emailForm.formState.errors.email?.message}
                  {...emailForm.register('email')}
                />
                <LuxButton type="submit" loading={isLoading} className="w-full">
                  Send Reset Code
                </LuxButton>
              </form>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
            >
              <Alert variant="info" className="mb-4">
                Demo: Check server console for code
              </Alert>
              <form
                onSubmit={codeForm.handleSubmit(handleCodeSubmit)}
                className="flex flex-col gap-4"
              >
                <LuxInput
                  label="Reset Code"
                  placeholder="000000"
                  maxLength={6}
                  className="text-center tracking-[6px] text-[22px] font-mono"
                  error={codeForm.formState.errors.code?.message}
                  {...codeForm.register('code')}
                />
                <LuxButton type="submit" loading={isLoading} className="w-full">
                  Verify Code
                </LuxButton>
                <LuxButton
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => setStep(1)}
                >
                  Resend Code
                </LuxButton>
              </form>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
            >
              <form
                onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
                className="flex flex-col gap-4"
              >
                <LuxInput
                  label="New Password"
                  type="password"
                  placeholder="Enter new password"
                  error={passwordForm.formState.errors.password?.message}
                  {...passwordForm.register('password')}
                />
                <LuxInput
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm new password"
                  error={passwordForm.formState.errors.confirmPassword?.message}
                  {...passwordForm.register('confirmPassword')}
                />
                <LuxButton type="submit" loading={isLoading} className="w-full">
                  Update Password
                </LuxButton>
              </form>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center"
            >
              <div className="w-[60px] h-[60px] rounded-full bg-gold-tint border border-gold-border flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={28} color="#C9A84C" />
              </div>
              <h2 className="font-serif text-[20px] text-ivory font-normal mb-2">
                Password Updated
              </h2>
              <p className="text-[13px] text-smoke mb-6">
                Your password has been reset successfully
              </p>
              <LuxButton
                onClick={() => navigate('/login')}
                className="w-full"
              >
                Sign In Now
              </LuxButton>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <Alert
            variant="error"
            className="mt-4"
            onClose={() => setError('')}
          >
            {error}
          </Alert>
        )}

        <button
          onClick={() => navigate(step === 1 ? '/login' : `/forgot`)}
          className="flex items-center justify-center gap-2 bg-transparent border-none text-smoke-2 text-[13px] mt-6 mx-auto cursor-pointer hover:text-ivory transition-colors"
        >
          <ChevronLeft size={16} />
          Back to Sign In
        </button>
      </div>
    </motion.div>
  );
}
