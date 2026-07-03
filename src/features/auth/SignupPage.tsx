import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Sparkles, ChevronLeft } from 'lucide-react';
import { GoldLine } from '../../components/ui/GoldLine';
import { LuxInput } from '../../components/ui/LuxInput';
import { LuxButton } from '../../components/ui/LuxButton';
import { Alert } from '../../components/ui/Alert';
import { useAuth } from '../../hooks/useAuth';
import { useState } from 'react';

const schema = z
  .object({
    name: z.string().min(2, 'Enter your full name'),
    email: z.string().email('Enter a valid email'),
    password: z.string().min(6, 'Minimum 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof schema>;

export function SignupPage() {
  const navigate = useNavigate();
  const { signup, signupError, isSigningUp } = useAuth();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setServerError('');
    signup({
      name: data.name,
      email: data.email,
      password: data.password,
    });
  };

  const errorMsg = serverError || signupError?.message || '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="min-h-[100dvh] flex flex-col"
    >
      <div
        className="bg-[#12121A] text-center px-7 pt-14 pb-12"
        style={{ minHeight: '35vh' }}
      >
        <p className="text-[11px] text-gold uppercase tracking-[6px] opacity-70 mb-6">
          — EVENTA —
        </p>
        <div className="w-[60px] h-[60px] rounded-full bg-gold-tint border border-[rgba(201,168,76,0.4)] flex items-center justify-center mx-auto mb-4">
          <Sparkles size={28} color="#C9A84C" />
        </div>
        <h1 className="font-serif text-[34px] text-gold tracking-[6px] font-normal">
          EVENTA
        </h1>
        <p className="text-[11px] text-smoke-2 uppercase tracking-[3px] mt-2">
          Luxury Event Planning
        </p>
        <p className="text-gold opacity-40 tracking-[4px] text-sm mt-3">
          ✦ ✦ ✦
        </p>
      </div>

      <div className="bg-obsidian flex-1 px-6 pt-7 pb-12">
        <GoldLine className="mb-6" />

        {errorMsg && (
          <Alert variant="error" className="mb-4" onClose={() => setServerError('')}>
            {errorMsg}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <LuxInput
            label="Full Name"
            placeholder="Your full name"
            error={errors.name?.message}
            {...register('name')}
          />
          <LuxInput
            label="Email"
            type="email"
            placeholder="your@email.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <LuxInput
            label="Password"
            type="password"
            placeholder="Create a password"
            error={errors.password?.message}
            {...register('password')}
          />
          <LuxInput
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
          <LuxButton type="submit" loading={isSigningUp} className="w-full mt-2">
            Create Account
          </LuxButton>
        </form>

        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 bg-transparent border-none text-smoke-2 text-[13px] mt-6 mx-auto cursor-pointer hover:text-ivory transition-colors"
        >
          <ChevronLeft size={16} />
          Back to Sign In
        </button>
      </div>
    </motion.div>
  );
}
