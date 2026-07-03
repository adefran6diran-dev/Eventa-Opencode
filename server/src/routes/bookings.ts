import { Router } from 'express';
import { z } from 'zod';
import { supabase } from '../db/supabase.js';
import { requireAuth } from '../middleware/auth.js';

export const bookingsRouter = Router();

const createSchema = z.object({
  vendorId: z.string().uuid(),
  vendorName: z.string().min(1),
  vendorCategory: z.string().min(1),
  eventDate: z.string().min(1),
  eventType: z.string().min(1),
  message: z.string().min(10),
});

const statusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'completed', 'cancelled']),
});

bookingsRouter.get('/', requireAuth, async (req, res) => {
  try {
    const user = req.user!;

    let query = supabase.from('bookings').select('*').order('created_at', { ascending: false });

    if (user.role === 'vendor') {
      query = query.eq('vendor_id', user.userId);
    } else if (user.role !== 'admin') {
      query = query.eq('client_id', user.userId);
    }

    const { data: bookings, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    res.json({ bookings: bookings || [] });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

bookingsRouter.post('/', requireAuth, async (req, res) => {
  try {
    const data = createSchema.parse(req.body);
    const user = req.user!;

    const { data: userRecord } = await supabase
      .from('users')
      .select('name')
      .eq('id', user.userId)
      .single();
    const clientName = userRecord?.name || user.email.split('@')[0];

    const { data: booking, error } = await supabase
      .from('bookings')
      .insert({
        client_id: user.userId,
        client_name: clientName,
        client_email: user.email,
        vendor_id: data.vendorId,
        vendor_name: data.vendorName,
        vendor_category: data.vendorCategory,
        event_date: data.eventDate,
        event_type: data.eventType,
        message: data.message,
        status: 'pending',
      })
      .select('*')
      .single();

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json({ booking });
  } catch (err: any) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors[0].message });
    res.status(500).json({ error: 'Server error' });
  }
});

bookingsRouter.patch('/:id/status', requireAuth, async (req, res) => {
  try {
    const { status } = statusSchema.parse(req.body);
    const user = req.user!;

    const { data: booking } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    if (booking.vendor_id !== user.userId && user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const { data: updated, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', req.params.id)
      .select('*')
      .single();

    if (error) return res.status(500).json({ error: error.message });
    res.json({ booking: updated });
  } catch (err: any) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors[0].message });
    res.status(500).json({ error: 'Server error' });
  }
});
