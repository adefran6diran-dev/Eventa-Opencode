import { Router } from 'express';
import { supabase } from '../db/supabase.js';
import { requireAuth } from '../middleware/auth.js';

export const profileRouter = Router();

profileRouter.get('/', requireAuth, async (req, res) => {
  try {
    const user = req.user!;

    if (user.role === 'vendor') {
      const { data: vendor, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('id', user.userId)
        .single();

      if (error || !vendor) return res.status(404).json({ error: 'Vendor not found' });
      const { password_hash, ...safe } = vendor;
      return res.json({ user: { ...safe, role: 'vendor' } });
    }

    const { data: profile, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.userId)
      .single();

    if (error || !profile) return res.status(404).json({ error: 'User not found' });
    const { password_hash, ...safe } = profile;
    res.json({ user: safe });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

profileRouter.patch('/', requireAuth, async (req, res) => {
  try {
    const user = req.user!;
    const updates = req.body;
    const table = user.role === 'vendor' ? 'vendors' : 'users';

    const { data, error } = await supabase
      .from(table)
      .update(updates)
      .eq('id', user.userId)
      .select('*')
      .single();

    if (error) return res.status(500).json({ error: error.message });
    const { password_hash, ...safe } = data;
    res.json({ user: safe });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});
