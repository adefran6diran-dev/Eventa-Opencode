import { Router } from 'express';
import { z } from 'zod';
import { supabase } from '../db/supabase.js';
import { requireAuth } from '../middleware/auth.js';

export const reviewsRouter = Router();

const createSchema = z.object({
  bookingId: z.string().uuid(),
  vendorId: z.string().uuid(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(5),
});

reviewsRouter.get('/:vendorId', async (req, res) => {
  try {
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('vendor_id', req.params.vendorId)
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json({ reviews: reviews || [] });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

reviewsRouter.post('/', requireAuth, async (req, res) => {
  try {
    const data = createSchema.parse(req.body);
    const user = req.user!;

    const { data: review, error } = await supabase
      .from('reviews')
      .insert({
        booking_id: data.bookingId,
        vendor_id: data.vendorId,
        client_id: user.userId,
        client_name: user.email.split('@')[0],
        rating: data.rating,
        comment: data.comment,
      })
      .select('*')
      .single();

    if (error) return res.status(500).json({ error: error.message });

    const { data: ratingData } = await supabase
      .from('reviews')
      .select('rating')
      .eq('vendor_id', data.vendorId);

    if (ratingData && ratingData.length > 0) {
      const avg = ratingData.reduce((sum: number, r: any) => sum + r.rating, 0) / ratingData.length;
      await supabase
        .from('vendors')
        .update({ rating: Math.round(avg * 10) / 10, review_count: ratingData.length })
        .eq('id', data.vendorId);
    }

    res.status(201).json({ review });
  } catch (err: any) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors[0].message });
    res.status(500).json({ error: 'Server error' });
  }
});
