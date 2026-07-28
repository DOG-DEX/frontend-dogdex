/**
 * Authentication Type Definitions
 */

export type UserRole = 'user' | 'member' | 'de' | 'admin';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  city?: string;
  phoneNumber?: string;
  isEmailVerified?: boolean;
  role?: UserRole;
  avatarUrl?: string;
  avatarPath?: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  password: string;
}

export interface RefreshTokenPayload {
  refreshToken: string;
}

export interface AuthResponse {
  message?: string;
  accessToken?: string;
  refreshToken?: string;
  user?: AuthUser;
  statusCode?: number;
}
