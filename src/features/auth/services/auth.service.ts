import { env } from "@/lib/env";
import {
  RegisterPayload,
  LoginPayload,
  VerifyOtpPayload,
  AuthResponse,
  AuthUser,
} from "../types/auth.types";

/**
 * Authentication Service
 * Manages API calls to NestJS Backend Auth Endpoints (/api/auth)
 */
export const authService = {
  /**
   * Register a new user account
   */
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const res = await fetch(`${env.apiBaseUrl}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      const errorMessage = Array.isArray(data.message)
        ? data.message.join(", ")
        : data.message || "Registration failed. Please try again.";
      throw new Error(errorMessage);
    }

    return data;
  },

  /**
   * Login user with email and password
   */
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const res = await fetch(`${env.apiBaseUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      const errorMessage = Array.isArray(data.message)
        ? data.message.join(", ")
        : data.message || "Invalid email or password.";
      throw new Error(errorMessage);
    }

    // Persist session tokens and user metadata upon successful login
    if (typeof window !== "undefined") {
      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
      }
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }
    }

    return data;
  },

  /**
   * Verify email address using OTP code sent by backend
   */
  async verifyEmail(payload: VerifyOtpPayload): Promise<AuthResponse> {
    const res = await fetch(`${env.apiBaseUrl}/api/auth/verify-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      const errorMessage = Array.isArray(data.message)
        ? data.message.join(", ")
        : data.message || "Invalid or expired OTP code.";
      throw new Error(errorMessage);
    }

    return data;
  },

  /**
   * Resend verification OTP code to user's email
   */
  async resendOtp(email: string): Promise<AuthResponse> {
    const res = await fetch(
      `${env.apiBaseUrl}/api/auth/resend-verification-otp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      const errorMessage = Array.isArray(data.message)
        ? data.message.join(", ")
        : data.message || "Failed to resend OTP code.";
      throw new Error(errorMessage);
    }

    return data;
  },

  /**
   * Clear local session storage
   */
  logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    }
  },

  /**
   * Get current authenticated user from local storage
   */
  getCurrentUser(): AuthUser | null {
    if (typeof window === "undefined") return null;
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },
};
