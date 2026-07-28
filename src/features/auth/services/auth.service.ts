import { apiFetch } from '@/lib/api';
import type {
  AuthResponse,
  AuthUser,
  ForgotPasswordPayload,
  LoginPayload,
  RefreshTokenPayload,
  RegisterPayload,
  ResetPasswordPayload,
  VerifyOtpPayload,
} from '../types/auth.types';

const jsonRequest = <T>(body: T): RequestInit => ({
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

function persistSession(response: AuthResponse) {
  if (typeof window === 'undefined') return;

  if (response.accessToken) localStorage.setItem('accessToken', response.accessToken);
  if (response.user) localStorage.setItem('user', JSON.stringify(response.user));
  window.dispatchEvent(new Event('auth-change'));
}

function clearSession() {
  if (typeof window === 'undefined') return;

  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
  window.dispatchEvent(new Event('auth-change'));
}

/** API boundary for every authentication request and browser session mutation. */
export const authService = {
  register(payload: RegisterPayload): Promise<AuthResponse> {
    return apiFetch<AuthResponse>('/api/auth/register', jsonRequest(payload));
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const response = await apiFetch<AuthResponse>('/api/auth/login', jsonRequest(payload));
    persistSession(response);
    return response;
  },

  verifyEmail(payload: VerifyOtpPayload): Promise<AuthResponse> {
    return apiFetch<AuthResponse>('/api/auth/verify-email', jsonRequest(payload));
  },

  resendOtp(email: string): Promise<AuthResponse> {
    return apiFetch<AuthResponse>(
      '/api/auth/resend-verification-otp',
      jsonRequest({ email }),
    );
  },

  forgotPassword(payload: ForgotPasswordPayload): Promise<AuthResponse> {
    return apiFetch<AuthResponse>('/api/auth/forgot-password', jsonRequest(payload));
  },

  resetPassword(payload: ResetPasswordPayload): Promise<AuthResponse> {
    return apiFetch<AuthResponse>('/api/auth/reset-password', jsonRequest(payload));
  },

  async refreshSession(): Promise<AuthResponse | null> {
    if (typeof window === 'undefined') return null;

    try {
      const response = await apiFetch<AuthResponse>(
        '/api/auth/refresh-token',
        jsonRequest({}),
      );
      persistSession(response);
      return response;
    } catch {
      clearSession();
      return null;
    }
  },

  async logout() {
    try {
      await apiFetch('/api/auth/logout', jsonRequest({}));
    } catch {
      // Ignore network failures on logout
    } finally {
      clearSession();
    }
  },

  getCurrentUser(): AuthUser | null {
    if (typeof window === 'undefined') return null;

    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) return null;
      const user = JSON.parse(storedUser) as Partial<AuthUser> & { _id?: string };
      if (!user.username && !user.email && !user.id && !user._id) return null;

      return {
        id: user.id ?? user._id ?? 'session',
        username: user.username ?? user.email?.split('@')[0] ?? 'Trainer',
        email: user.email ?? '',
        role: user.role,
        avatarUrl: user.avatarUrl,
      };
    } catch {
      clearSession();
      return null;
    }
  },
};
