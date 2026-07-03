import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Sparkles, Store, ChevronRight } from 'lucide-react';
import { GoldLine } from '../../components/ui/GoldLine';
import { LuxInput } from '../../components/ui/LuxInput';
import { LuxButton } from '../../components/ui/LuxButton';
import { Alert } from '../../components/ui/Alert';
import { useAuth } from '../../hooks/useAuth';
import { useAppStore } from '../../store/appStore';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Minimum 6 characters'),
});

type FormData = z.infer<typeof schema>;

export function LoginPage() {
  const navigate = useNavigate();
  const { login, signup, handleGoogleSignIn, loginError, signupError, isLoggingIn, isSigningUp } = useAuth();
  const currentUser = useAppStore((s) => s.user);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showDemo, setShowDemo] = useState(true);

  const goHome = () => {
    const role = currentUser?.role;
    if (role === 'admin') navigate('/admin');
    else if (role === 'vendor') navigate('/dashboard');
    else navigate('/');
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [serverError, setServerError] = useState('');

  const onSubmit = async (data: FormData) => {
    setServerError('');
    if (mode === 'login') {
      login(data.email, data.password);
    } else {
      signup({ name: data.email.split('@')[0], ...data });
    }
  };

  const handleGoogle = () => {
    handleGoogleSignIn();
    navigate('/');
  };

  const errorMsg = serverError || (mode === 'login' ? loginError?.message : signupError?.message) || '';

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
        <button onClick={goHome} className="bg-transparent border-none cursor-pointer mx-auto block">
          <p className="text-[11px] text-gold uppercase tracking-[6px] opacity-70 mb-6">
            — EVENTA —
          </p>
          <div className="w-[60px] h-[60px] rounded-full bg-gold-tint border border-[rgba(201,168,76,0.4)] flex items-center justify-center mx-auto mb-4 hover:border-[rgba(201,168,76,0.7)] transition-colors">
            <Sparkles size={28} color="#C9A84C" />
          </div>
          <h1 className="font-serif text-[34px] text-gold tracking-[6px] font-normal hover:text-gold-2 transition-colors">
            EVENTA
          </h1>
        </button>
        <p className="text-[11px] text-smoke-2 uppercase tracking-[3px] mt-2">
          Luxury Event Planning
        </p>
        <p className="text-gold opacity-40 tracking-[4px] text-sm mt-3">
          ✦ ✦ ✦
        </p>
      </div>

      <div className="bg-obsidian flex-1 px-6 pt-7 pb-12">
        <GoldLine className="mb-6" />

        <div className="flex bg-[#12121A] rounded-[8px] p-1 mb-7 border border-white/6">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2 text-center text-[13px] font-semibold tracking-[0.5px] uppercase rounded-[6px] transition-all ${
              mode === 'login'
                ? 'bg-[#C9A84C] text-[#0A0A0F]'
                : 'bg-transparent text-white/50'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-2 text-center text-[13px] font-semibold tracking-[0.5px] uppercase rounded-[6px] transition-all ${
              mode === 'register'
                ? 'bg-[#C9A84C] text-[#0A0A0F]'
                : 'bg-transparent text-white/50'
            }`}
          >
            Register
          </button>
        </div>

        <button
          onClick={handleGoogle}
          className="w-full bg-[#242433] border border-white/12 rounded-[8px] px-5 py-[13px] flex items-center justify-center gap-3 hover:border-[rgba(201,168,76,0.4)] transition-colors cursor-pointer"
        >
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
            <path fill="#FBBC05" d="M10.54 28.59A14.5 14.5 0 0 1 9.5 24c0-1.59.28-3.14.76-4.59l-7.98-6.19A24.5 24.5 0 0 0 0 24c0 3.77.85 7.35 2.56 10.78l7.98-6.19z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
          </svg>
          <span className="text-[14px] font-semibold text-[#F8F4EC]">
            Continue with Google
          </span>
        </button>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-white/8" />
          <span className="text-[11px] text-[#6B6B7E] uppercase tracking-[1px]">
            or
          </span>
          <div className="flex-1 h-px bg-white/8" />
        </div>

        {errorMsg && (
          <Alert variant="error" className="mb-4" onClose={() => setServerError('')}>
            {errorMsg}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
            placeholder="Enter password"
            error={errors.password?.message}
            {...register('password')}
          />
          {mode === 'login' && (
            <Link
              to="/forgot"
              className="text-[12px] text-gold text-right hover:underline self-end"
            >
              Forgot password?
            </Link>
          )}
          <LuxButton type="submit" loading={isLoggingIn || isSigningUp} className="w-full">
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </LuxButton>
        </form>

        {mode === 'login' && showDemo && (
          <div className="mt-5 bg-[#12121A] border border-white/6 rounded-[8px] p-4">
            <p className="text-[10px] text-smoke uppercase tracking-[1.5px] mb-2">
              Demo Credentials
            </p>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] text-smoke">Admin</span>
              <button
                onClick={() => {
                  setValue('email', 'admin@eventa.ng');
                  setValue('password', 'admin123');
                }}
                className="text-[11px] text-gold bg-transparent border-none cursor-pointer hover:underline"
              >
                Use credentials
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-smoke">Vendor</span>
              <button
                onClick={() => {
                  setValue('email', 'info@luxecatering.ng');
                  setValue('password', 'password');
                }}
                className="text-[11px] text-gold bg-transparent border-none cursor-pointer hover:underline"
              >
                Use credentials
              </button>
            </div>
          </div>
        )}

        <button
          onClick={() => navigate('/apply')}
          className="w-full mt-5 bg-[#242433] border border-[rgba(201,168,76,0.15)] rounded-[14px] p-4 flex items-center gap-4 hover:border-[rgba(201,168,76,0.4)] transition-colors cursor-pointer"
        >
          <div className="w-[42px] h-[42px] rounded-full bg-gold-tint border border-gold-border flex items-center justify-center shrink-0">
            <Store size={18} color="#C9A84C" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-[14px] text-ivory font-semibold">
              List your services
            </p>
            <p className="text-[12px] text-smoke tracking-[0.3px]">
              Apply to become a verified Eventa vendor
            </p>
          </div>
          <ChevronRight size={18} color="#C9A84C" opacity={0.7} />
        </button>
      </div>
    </motion.div>
  );
}
