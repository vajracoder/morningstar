// ============================================================
// MORNINGSTAR — AUTH CONTEXT
// ============================================================

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { AuthState, User, FarmerProfile } from '@/types';
import { getStoredAuth, login as apiLogin, logout as apiLogout, requestOtp } from '@/api/auth';

interface AuthContextValue extends AuthState {
  login: (phone: string, otp: string) => Promise<void>;
  logout: () => void;
  requestOtp: (phone: string) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(getStoredAuth);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (phone: string, otp: string) => {
    setLoading(true);
    try {
      const res = await apiLogin({ phone, otp });
      localStorage.setItem('kp_token', res.token);
      localStorage.setItem('kp_user', JSON.stringify(res.user));
      setAuthState({
        user: res.user,
        farmer_profile: res.farmer_profile,
        token: res.token,
        is_authenticated: true,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    apiLogout();
    setAuthState({ user: null, farmer_profile: null, token: null, is_authenticated: false });
  }, []);

  const sendOtp = useCallback(async (phone: string) => {
    await requestOtp(phone);
  }, []);

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, requestOtp: sendOtp, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
