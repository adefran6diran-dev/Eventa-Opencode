import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { useAppStore } from '../store/appStore';
import type { User, SignupData } from '../types';
import toast from 'react-hot-toast';

interface AuthResponse {
  user: User;
  token: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface SignupInput {
  name: string;
  email: string;
  password: string;
}

export function useAuth() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { user, setUser, setToken, logout: storeLogout } = useAppStore();

  const loginMutation = useMutation({
    mutationFn: async (data: LoginInput) => {
      const res = await api.post<AuthResponse>('/auth/login', data);
      return res.data;
    },
    onSuccess: (data) => {
      setUser(data.user);
      setToken(data.token);
      qc.invalidateQueries({ queryKey: ['bookings'] });
      qc.invalidateQueries({ queryKey: ['vendors'] });
      const role = data.user.role;
      if (role === 'vendor') navigate('/dashboard');
      else if (role === 'admin') navigate('/admin');
      else navigate('/');
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (data: SignupInput) => {
      const res = await api.post<AuthResponse>('/auth/signup', data);
      return res.data;
    },
    onSuccess: (data) => {
      setUser(data.user);
      setToken(data.token);
      navigate('/');
    },
  });

  const logout = () => {
    storeLogout();
    qc.clear();
    navigate('/login');
  };

  const handleGoogleSignIn = () => {
    const email = prompt('Enter your Google email:');
    if (!email) return;
    const name = email.split('@')[0];
    api.post('/auth/google', { email, name }).then((res) => {
      setUser(res.data.user);
      setToken(res.data.token);
      const role = res.data.user.role;
      if (role === 'vendor') navigate('/dashboard');
      else if (role === 'admin') navigate('/admin');
      else navigate('/');
    }).catch(() => {
      toast.error('Google sign-in failed');
    });
  };

  return {
    user,
    isAuthenticated: !!user,
    isClient: user?.role === 'client',
    isVendor: user?.role === 'vendor',
    isAdmin: user?.role === 'admin',
    login: (email: string, password: string) => {
      loginMutation.mutate({ email, password });
      return { success: true };
    },
    signup: (data: SignupData) => {
      signupMutation.mutate({ name: data.name, email: data.email, password: data.password });
      return { success: true };
    },
    logout,
    handleGoogleSignIn,
    loginError: loginMutation.error,
    signupError: signupMutation.error,
    isLoggingIn: loginMutation.isPending,
    isSigningUp: signupMutation.isPending,
  };
}
