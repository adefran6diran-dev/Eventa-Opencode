import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { supabase } from '../db/supabase.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

export const applicationsRouter = Router();

const submitSchema = z.object({
  businessName: z.string().min(2),
  category: z.string().min(1),
  state: z.string().min(1),
  city: z.string().min(2),
  yearsInBusiness: z.string().min(1),
  bio: z.string().min(50),
  eventTypes: z.array(z.string()).min(1),
  instagramHandle: z.string().optional(),
  websiteUrl: z.string().optional(),
  priceRange: z.string().min(2),
  phone: z.string().min(8),
  whatsapp: z.string().optional(),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  ownerName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

applicationsRouter.post('/', async (req, res) => {
  try {
    const data = submitSchema.parse(req.body);
    const password_hash = await bcrypt.hash(data.password, 10);

    const { data: app, error } = await supabase
      .from('applications')
      .insert({
        business_name: data.businessName,
        category: data.category,
        state: data.state,
        city: data.city,
        years_in_business: data.yearsInBusiness,
        bio: data.bio,
        event_types: data.eventTypes,
        instagram_handle: data.instagramHandle,
        website_url: data.websiteUrl,
        price_range: data.priceRange,
        phone: data.phone,
        whatsapp: data.whatsapp,
        bank_name: data.bankName,
        account_number: data.accountNumber,
        owner_name: data.ownerName,
        email: data.email,
        password_hash,
        status: 'pending',
      })
      .select('*')
      .single();

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json({ application: app });
  } catch (err: any) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors[0].message });
    res.status(500).json({ error: 'Server error' });
  }
});

applicationsRouter.get('/', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const { data: apps, error } = await supabase
      .from('applications')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json({ applications: apps || [] });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

applicationsRouter.patch('/:id/review', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const { status, note } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const { data: app } = await supabase
      .from('applications')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (!app) return res.status(404).json({ error: 'Application not found' });

    const { error } = await supabase
      .from('applications')
      .update({ status, reviewed_at: new Date().toISOString(), review_note: note || '' })
      .eq('id', req.params.id);

    if (error) return res.status(500).json({ error: error.message });

    if (status === 'approved') {
      await supabase.from('vendors').insert({
        name: app.business_name,
        category: app.category,
        location: `${app.city}, ${app.state}`,
        bio: app.bio,
        price: app.price_range,
        phone: app.phone,
        email: app.email,
        password_hash: app.password_hash,
        tags: app.event_types,
      });
    }

    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});
