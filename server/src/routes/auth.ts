import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { supabase } from '../db/supabase.js';
import { generateToken } from '../middleware/auth.js';

export const authRouter = Router();

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const forgotSchema = z.object({
  email: z.string().email(),
});

const resetCodeSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
});

const resetPasswordSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
  password: z.string().min(6),
});

authRouter.post('/signup', async (req, res) => {
  try {
    const data = signupSchema.parse(req.body);

    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', data.email)
      .single();

    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const password_hash = await bcrypt.hash(data.password, 10);
    const { data: user, error } = await supabase
      .from('users')
      .insert({ name: data.name, email: data.email, password_hash, role: 'client' })
      .select('id, name, email, role, created_at')
      .single();

    if (error || !user) {
      return res.status(500).json({ error: 'Failed to create user' });
    }

    const token = generateToken({ userId: user.id, email: user.email, role: user.role });
    res.status(201).json({ user, token });
  } catch (err: any) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors[0].message });
    res.status(500).json({ error: 'Server error' });
  }
});

authRouter.post('/login', async (req, res) => {
  try {
    const data = loginSchema.parse(req.body);

    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('email', data.email)
      .single();

    if (user) {
      const valid = await bcrypt.compare(data.password, user.password_hash || '');
      if (valid) {
        const token = generateToken({ userId: user.id, email: user.email, role: user.role });
        const { password_hash, ...safe } = user;
        return res.json({ user: safe, token });
      }
    }

    const { data: vendor } = await supabase
      .from('vendors')
      .select('*')
      .eq('email', data.email)
      .single();

    if (vendor) {
      const valid = await bcrypt.compare(data.password, vendor.password_hash || '');
      if (valid) {
        const token = generateToken({ userId: vendor.id, email: vendor.email, role: 'vendor' });
        const { password_hash, ...safe } = vendor;
        return res.json({ user: { ...safe, role: 'vendor' }, token });
      }
    }

    return res.status(401).json({ error: 'Invalid email or password' });
  } catch (err: any) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors[0].message });
    res.status(500).json({ error: 'Server error' });
  }
});

authRouter.post('/google', async (req, res) => {
  try {
    const { email, name } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });

    let { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (!user) {
      const { data: newUser, error } = await supabase
        .from('users')
        .insert({ name: name || email.split('@')[0], email, role: 'client', from_google: true })
        .select('*')
        .single();

      if (error || !newUser) return res.status(500).json({ error: 'Failed to create user' });
      user = newUser;
    }

    const token = generateToken({ userId: user.id, email: user.email, role: user.role });
    const { password_hash, ...safe } = user;
    res.json({ user: safe, token });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

authRouter.post('/forgot', async (req, res) => {
  try {
    const { email } = forgotSchema.parse(req.body);
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    await supabase.from('reset_codes').insert({ email, code, expires_at: expiresAt });
    console.log(`Reset code for ${email}: ${code}`);
    res.json({ success: true, message: 'Code sent if email exists' });
  } catch (err: any) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors[0].message });
    res.status(500).json({ error: 'Server error' });
  }
});

authRouter.post('/verify-code', async (req, res) => {
  try {
    const { email, code } = resetCodeSchema.parse(req.body);

    const { data: record } = await supabase
      .from('reset_codes')
      .select('*')
      .eq('email', email)
      .eq('code', code)
      .eq('used', false)
      .gte('expires_at', new Date().toISOString())
      .single();

    if (!record) return res.status(400).json({ error: 'Invalid or expired code' });
    res.json({ success: true });
  } catch (err: any) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors[0].message });
    res.status(500).json({ error: 'Server error' });
  }
});

authRouter.post('/reset-password', async (req, res) => {
  try {
    const { email, code, password } = resetPasswordSchema.parse(req.body);

    const { data: record } = await supabase
      .from('reset_codes')
      .select('*')
      .eq('email', email)
      .eq('code', code)
      .eq('used', false)
      .gte('expires_at', new Date().toISOString())
      .single();

    if (!record) return res.status(400).json({ error: 'Invalid or expired code' });

    const password_hash = await bcrypt.hash(password, 10);
    await supabase.from('users').update({ password_hash }).eq('email', email);
    await supabase.from('vendors').update({ password_hash }).eq('email', email);
    await supabase.from('reset_codes').update({ used: true }).eq('id', record.id);

    res.json({ success: true });
  } catch (err: any) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors[0].message });
    res.status(500).json({ error: 'Server error' });
  }
});
