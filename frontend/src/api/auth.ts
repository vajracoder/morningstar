// ============================================================
// MORNINGSTAR — AUTH API SERVICE
// ============================================================

import { request } from './client';
import { MOCK_USER, MOCK_FARMER_PROFILE, USE_MOCK } from '@/mock/data';
import type { User, FarmerProfile, AuthState } from '@/types';

export interface LoginPayload { phone: string; otp: string; }
export interface LoginResponse { user: User; farmer_profile: FarmerProfile; token: string; }

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 800)); // simulate network
    const response: LoginResponse = {
      user: MOCK_USER,
      farmer_profile: MOCK_FARMER_PROFILE,
      token: 'mock-jwt-token-abc123',
    };
    localStorage.setItem('kp_token', response.token);
    localStorage.setItem('kp_user', JSON.stringify(response.user));
    return response;
  }
  return request<LoginResponse>({ method: 'POST', url: '/api/auth/login', data: payload });
}

export async function requestOtp(phone: string): Promise<{ message: string }> {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 600));
    return { message: 'OTP sent successfully.' };
  }
  return request({ method: 'POST', url: '/api/auth/otp/request', data: { phone } });
}

export function logout(): void {
  localStorage.removeItem('kp_token');
  localStorage.removeItem('kp_user');
}

export function getStoredAuth(): AuthState {
  const token = localStorage.getItem('kp_token');
  const userStr = localStorage.getItem('kp_user');
  const user = userStr ? JSON.parse(userStr) as User : null;
  return {
    user,
    farmer_profile: null,
    token,
    is_authenticated: !!token && !!user,
  };
}
