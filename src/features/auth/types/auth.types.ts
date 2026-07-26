/**
 * Authentication Type Definitions
 */

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  isEmailVerified?: boolean;
  role?: string;
  avatarUrl?: string;
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

export interface AuthResponse {
  message: string;
  accessToken?: string;
  refreshToken?: string;
  user?: AuthUser;
  statusCode?: number;
}
