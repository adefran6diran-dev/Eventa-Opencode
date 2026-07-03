import { Router } from 'express';
import { supabase } from '../db/supabase.js';

export const vendorsRouter = Router();

vendorsRouter.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = supabase.from('vendors').select('*');

    if (category && category !== 'all') {
      query = query.eq('category', category as string);
    }

    if (search) {
      const q = `%${search}%`;
      query = query.or(`name.ilike.${q},bio.ilike.${q},location.ilike.${q},tags::text.ilike.${q}`);
    }

    const { data: vendors, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    const safe = (vendors || []).map(({ password_hash, ...rest }: any) => rest);
    res.json({ vendors: safe });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

vendorsRouter.get('/:id', async (req, res) => {
  try {
    const { data: vendor, error } = await supabase
      .from('vendors')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !vendor) return res.status(404).json({ error: 'Vendor not found' });
    const { password_hash, ...safe } = vendor;
    res.json({ vendor: safe });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});
