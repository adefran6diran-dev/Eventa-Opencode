import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Sparkles, ChevronLeft, ChevronRight, Store, CheckCircle } from 'lucide-react';
import { GoldLine } from '../../components/ui/GoldLine';
import { HeroSection } from '../../components/layout/HeroSection';
import { LuxInput } from '../../components/ui/LuxInput';
import { LuxSelect } from '../../components/ui/LuxSelect';
import { LuxTextarea } from '../../components/ui/LuxTextarea';
import { LuxButton } from '../../components/ui/LuxButton';
import { Alert } from '../../components/ui/Alert';
import { useSubmitApplication } from '../../hooks/useApplications';
import { categories, eventTypes, nigerianStates } from '../../data/vendors';
import toast from 'react-hot-toast';
import { cn } from '../../lib/utils';

const step1Schema = z.object({
  businessName: z.string().min(2, 'Enter your business name'),
  category: z.string().min(1, 'Select a category'),
  state: z.string().min(1, 'Select a state'),
  city: z.string().min(2, 'Enter your city'),
  yearsInBusiness: z.string().min(1, 'Select years'),
});

const step2Schema = z.object({
  bio: z.string().min(50, 'Minimum 50 characters'),
  eventTypes: z.array(z.string()).min(1, 'Select at least one'),
  instagramHandle: z.string().optional(),
  websiteUrl: z.string().optional(),
});

const step3Schema = z.object({
  priceRange: z.string().min(2, 'Enter your price range'),
  phone: z.string().min(8, 'Enter a valid phone number'),
  whatsapp: z.string().optional(),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
});

const step4Schema = z
  .object({
    ownerName: z.string().min(2, 'Enter your full name'),
    email: z.string().email('Enter a valid email'),
    password: z.string().min(6, 'Minimum 6 characters'),
    confirmPassword: z.string(),
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: 'You must accept the terms' }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;
type Step3Data = z.infer<typeof step3Schema>;
type Step4Data = z.infer<typeof step4Schema>;

export function VendorApplyPage() {
  const navigate = useNavigate();
  const submitApplication = useSubmitApplication();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    step1: {} as Step1Data,
    step2: {} as Step2Data,
    step3: {} as Step3Data,
  });
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [serverError, setServerError] = useState('');

  const step1 = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
  });
  const step2 = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
  });
  const step3 = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
  });
  const step4 = useForm<Step4Data>({
    resolver: zodResolver(step4Schema),
  });

  const progress = (step / 4) * 100;

  const handleStep1 = (data: Step1Data) => {
    setFormData((prev) => ({ ...prev, step1: data }));
    setStep(2);
  };

  const handleStep2 = (data: Step2Data) => {
    setFormData((prev) => ({ ...prev, step2: { ...data, eventTypes: selectedEvents } }));
    setStep(3);
  };

  const handleStep3 = (data: Step3Data) => {
    setFormData((prev) => ({ ...prev, step3: data }));
    setStep(4);
  };

  const handleStep4 = (data: Step4Data) => {
    setServerError('');
    const completeData = {
      ...formData.step1,
      ...formData.step2,
      ...formData.step3,
      ownerName: data.ownerName,
      email: data.email,
      password: data.password,
    };
    submitApplication.mutate(completeData, {
      onSuccess: () => {
        toast.success('Application submitted! We will review it shortly.');
        navigate('/login');
      },
      onError: (err: any) => {
        setServerError(err.response?.data?.error || 'Submission failed');
      },
    });
  };

  const toggleEvent = (event: string) => {
    setSelectedEvents((prev) =>
      prev.includes(event)
        ? prev.filter((e) => e !== event)
        : [...prev, event]
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="pb-28"
    >
      <HeroSection
        title="Become a Vendor"
        subtitle="Apply to join Eventa's elite vendor network"
        ornament
      />

      <div className="px-5 pt-5">
        <div className="h-[2px] bg-white/6 rounded-full mb-2">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: 'linear-gradient(90deg, #C9A84C, #E8C97A)',
            }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="flex justify-between">
          {[1, 2, 3, 4].map((s) => (
            <span
              key={s}
              className={cn(
                'text-[10px] uppercase tracking-[0.5px]',
                s <= step ? 'text-gold' : 'text-smoke'
              )}
            >
              Step {s}
            </span>
          ))}
        </div>
      </div>

      <div className="px-5 pt-6">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <form
                onSubmit={step1.handleSubmit(handleStep1)}
                className="flex flex-col gap-4"
              >
                <LuxInput
                  label="Business Name"
                  placeholder="Your business name"
                  error={step1.formState.errors.businessName?.message}
                  {...step1.register('businessName')}
                />
                <LuxSelect
                  label="Category"
                  placeholder="Select category"
                  options={categories
                    .filter((c) => c.id !== 'all')
                    .map((c) => ({ value: c.id, label: c.label }))}
                  error={step1.formState.errors.category?.message}
                  {...step1.register('category')}
                />
                <LuxSelect
                  label="State"
                  placeholder="Select state"
                  options={nigerianStates.map((s) => ({
                    value: s,
                    label: s,
                  }))}
                  error={step1.formState.errors.state?.message}
                  {...step1.register('state')}
                />
                <LuxInput
                  label="City"
                  placeholder="Your city"
                  error={step1.formState.errors.city?.message}
                  {...step1.register('city')}
                />
                <LuxSelect
                  label="Years in Business"
                  placeholder="Select years"
                  options={[
                    { value: '0-1', label: 'Less than 1 year' },
                    { value: '1-3', label: '1-3 years' },
                    { value: '3-5', label: '3-5 years' },
                    { value: '5-10', label: '5-10 years' },
                    { value: '10+', label: '10+ years' },
                  ]}
                  error={step1.formState.errors.yearsInBusiness?.message}
                  {...step1.register('yearsInBusiness')}
                />
                <LuxButton type="submit" className="w-full mt-2">
                  Continue <ChevronRight size={16} className="ml-1" />
                </LuxButton>
              </form>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <form
                onSubmit={step2.handleSubmit(handleStep2)}
                className="flex flex-col gap-4"
              >
                <LuxTextarea
                  label="Bio / About"
                  placeholder="Tell us about your services (min 50 characters)..."
                  charCount={step2.watch('bio')?.length || 0}
                  maxChars={500}
                  error={step2.formState.errors.bio?.message}
                  {...step2.register('bio')}
                />
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-semibold tracking-[1.5px] uppercase text-smoke-2">
                    Event Types
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {eventTypes.map((event) => (
                      <button
                        key={event}
                        type="button"
                        onClick={() => toggleEvent(event)}
                        className={cn(
                          'rounded-full px-[14px] py-[7px] text-[11px] font-semibold tracking-[0.5px] transition-all cursor-pointer border',
                          selectedEvents.includes(event)
                            ? 'bg-gold text-obsidian border-gold'
                            : 'bg-charcoal text-smoke-2 border-white/8'
                        )}
                      >
                        {event}
                      </button>
                    ))}
                  </div>
                  {step2.formState.errors.eventTypes && (
                    <p className="text-[11px] text-error">
                      {step2.formState.errors.eventTypes.message}
                    </p>
                  )}
                </div>
                <LuxInput
                  label="Instagram Handle"
                  placeholder="@yourhandle"
                  {...step2.register('instagramHandle')}
                />
                <LuxInput
                  label="Website URL"
                  placeholder="https://"
                  {...step2.register('websiteUrl')}
                />
                <LuxButton type="submit" className="w-full mt-2">
                  Continue <ChevronRight size={16} className="ml-1" />
                </LuxButton>
              </form>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <form
                onSubmit={step3.handleSubmit(handleStep3)}
                className="flex flex-col gap-4"
              >
                <LuxInput
                  label="Price Range"
                  placeholder="e.g. 200,000 - 1,000,000"
                  error={step3.formState.errors.priceRange?.message}
                  {...step3.register('priceRange')}
                />
                <LuxInput
                  label="Phone"
                  type="tel"
                  placeholder="+234 800 000 0000"
                  error={step3.formState.errors.phone?.message}
                  {...step3.register('phone')}
                />
                <LuxInput
                  label="WhatsApp (optional)"
                  type="tel"
                  placeholder="+234 800 000 0000"
                  {...step3.register('whatsapp')}
                />
                <div className="bg-gold-tint border border-gold-border/30 rounded-[8px] p-4">
                  <p className="text-[11px] text-gold uppercase tracking-[1px] font-semibold mb-2">
                    Bank Details (Optional)
                  </p>
                  <div className="flex flex-col gap-3">
                    <LuxInput
                      label="Bank Name"
                      placeholder="Enter bank name"
                      {...step3.register('bankName')}
                    />
                    <LuxInput
                      label="Account Number"
                      placeholder="Enter account number"
                      maxLength={10}
                      {...step3.register('accountNumber')}
                    />
                  </div>
                </div>
                <LuxButton type="submit" className="w-full mt-2">
                  Continue <ChevronRight size={16} className="ml-1" />
                </LuxButton>
              </form>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {serverError && (
                <Alert
                  variant="error"
                  className="mb-4"
                  onClose={() => setServerError('')}
                >
                  {serverError}
                </Alert>
              )}
              <form
                onSubmit={step4.handleSubmit(handleStep4)}
                className="flex flex-col gap-4"
              >
                <LuxInput
                  label="Owner Name"
                  placeholder="Your full name"
                  error={step4.formState.errors.ownerName?.message}
                  {...step4.register('ownerName')}
                />
                <LuxInput
                  label="Email"
                  type="email"
                  placeholder="your@email.com"
                  error={step4.formState.errors.email?.message}
                  {...step4.register('email')}
                />
                <LuxInput
                  label="Password"
                  type="password"
                  placeholder="Create a password"
                  error={step4.formState.errors.password?.message}
                  {...step4.register('password')}
                />
                <LuxInput
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm your password"
                  error={step4.formState.errors.confirmPassword?.message}
                  {...step4.register('confirmPassword')}
                />

                <div className="bg-[#12121A] rounded-[14px] overflow-hidden mt-3">
                  <GoldLine thin />
                  <div className="p-4">
                    <h3 className="text-[13px] text-gold font-serif font-normal mb-3">
                      Application Summary
                    </h3>
                    <div className="space-y-2 text-[12px]">
                      <div className="flex justify-between">
                        <span className="text-smoke">Business</span>
                        <span className="text-ivory2">{formData.step1.businessName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-smoke">Category</span>
                        <span className="text-ivory2">{formData.step1.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-smoke">Location</span>
                        <span className="text-ivory2">{formData.step1.city}, {formData.step1.state}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-smoke">Price Range</span>
                        <span className="text-ivory2">{formData.step3.priceRange}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-smoke">Events</span>
                        <span className="text-ivory2">{selectedEvents.slice(0, 3).join(', ')}{selectedEvents.length > 3 ? '...' : ''}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <label className="flex items-center gap-2.5 mt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-[#C9A84C]"
                    {...step4.register('acceptTerms')}
                  />
                  <span className="text-[12px] text-smoke">
                    I agree to Eventa's terms and conditions
                  </span>
                </label>
                {step4.formState.errors.acceptTerms && (
                  <p className="text-[11px] text-error -mt-2">
                    {step4.formState.errors.acceptTerms.message}
                  </p>
                )}

                <LuxButton type="submit" className="w-full mt-2">
                  Submit Application
                </LuxButton>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {step > 1 && (
          <button
            onClick={() => setStep((s) => s - 1)}
            className="flex items-center justify-center gap-2 bg-transparent border-none text-smoke-2 text-[13px] mt-6 mx-auto cursor-pointer hover:text-ivory transition-colors"
          >
            <ChevronLeft size={16} />
            Back
          </button>
        )}
      </div>
    </motion.div>
  );
}
