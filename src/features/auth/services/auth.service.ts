import { env } from "@/lib/env";
import {
  RegisterPayload,
  LoginPayload,
  VerifyOtpPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  AuthResponse,
  AuthUser,
} from "../types/auth.types";

/**
 * Unwraps the backend TransformInterceptor envelope.
 *
 * NestJS TransformInterceptor wraps all successful responses in `{ data: ... }`.
 * Error responses (from exception filters) come as `{ statusCode, message, error }`
 * without the wrapper. This helper normalizes both cases so callers always get
 * the inner payload directly.
 */
function unwrapResponse<T>(raw: T & { data?: T }): T {
  if (raw && typeof raw === "object" && "data" in raw && raw.data !== undefined) {
    return raw.data as T;
  }
  return raw;
}

/**
 * Authentication Service
 * Manages API calls to NestJS Backend Auth Endpoints (/api/auth).
 *
 * All responses are unwrapped from the backend TransformInterceptor
 * envelope `{ data: ... }` before being returned to callers.
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

    const raw = await res.json();
    const data = unwrapResponse(raw);

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

    const raw = await res.json();
    const data = unwrapResponse(raw);

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
      // Notify all components (SiteNav, etc.) that auth state changed
      window.dispatchEvent(new Event("auth-change"));
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

    const raw = await res.json();
    const data = unwrapResponse(raw);

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

    const raw = await res.json();
    const data = unwrapResponse(raw);

    if (!res.ok) {
      const errorMessage = Array.isArray(data.message)
        ? data.message.join(", ")
        : data.message || "Failed to resend OTP code.";
      throw new Error(errorMessage);
    }

    return data;
  },

  /**
   * Request password reset OTP email
   */
  async forgotPassword(payload: ForgotPasswordPayload): Promise<AuthResponse> {
    const res = await fetch(`${env.apiBaseUrl}/api/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const raw = await res.json();
    const data = unwrapResponse(raw);

    if (!res.ok) {
      const errorMessage = Array.isArray(data.message)
        ? data.message.join(", ")
        : data.message || "Failed to request password reset.";
      throw new Error(errorMessage);
    }

    return data;
  },

  /**
   * Reset password using OTP code
   */
  async resetPassword(payload: ResetPasswordPayload): Promise<AuthResponse> {
    const res = await fetch(`${env.apiBaseUrl}/api/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const raw = await res.json();
    const data = unwrapResponse(raw);

    if (!res.ok) {
      const errorMessage = Array.isArray(data.message)
        ? data.message.join(", ")
        : data.message || "Invalid or expired OTP code.";
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
      window.dispatchEvent(new Event("auth-change"));
    }
  },

  /**
   * Get current authenticated user from local storage.
   * Checks both localStorage and sessionStorage, with a fallback
   * to token-only detection for edge cases.
   */
  getCurrentUser(): AuthUser | null {
    if (typeof window === "undefined") return null;
    try {
      const userStr =
        localStorage.getItem("user") || sessionStorage.getItem("user");
      if (userStr && userStr !== "undefined") {
        const userObj = JSON.parse(userStr);
        if (
          userObj &&
          (userObj.username || userObj.email || userObj.id || userObj._id)
        ) {
          return {
            id: userObj.id || userObj._id || "user",
            username:
              userObj.username || userObj.email?.split("@")[0] || "Trainer",
            email: userObj.email || "",
            role: userObj.role || "user",
            avatarUrl: userObj.avatarUrl || "",
          };
        }
      }
    } catch {
      // Fallback below
    }

    // Fallback: if tokens exist but user object is missing
    const token =
      localStorage.getItem("accessToken") ||
      localStorage.getItem("refreshToken");
    if (token) {
      return {
        id: "session",
        username: "Trainer",
        email: "",
      };
    }
    return null;
  },
};
