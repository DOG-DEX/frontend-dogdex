"use client";

import { FormEvent, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { RetroGameScreen } from "../components/RetroGameScreen";
import { authService } from "../services/auth.service";
import { useToast } from "@/components/ToastContext";

/**
 * RegisterView Component
 * Neo-Brutalist split layout connected to NestJS Backend Auth API (/api/auth/register & /api/auth/verify-email).
 * Fully localized with EN and VI placeholders (`username67`, `dogdex@example.com`).
 */
export function RegisterView() {
  const t = useTranslations("RegisterView");
  const router = useRouter();
  const { toast } = useToast();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);

  // Show/Hide password toggle states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // OTP Verification state
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  // Loading, Cooldown & Alert feedback states
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  /**
   * Handle user account registration submission
   */
  const handleRegisterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (cooldown > 0) return;

    setErrorMessage(null);
    setSuccessMessage(null);

    // Validate Password & Confirm Password Match
    if (password !== confirmPassword) {
      const msg = t("passwordMismatch");
      setErrorMessage(msg);
      toast.error("PASSWORD MISMATCH", msg, {
        badge: "NOW",
        duration: 3500,
      });
      setCooldown(3);
      return;
    }

    // Validate username regex format required by backend (/^[a-z0-9_]+$/)
    const sanitizedUsername = username
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9_]/g, "_");

    if (!sanitizedUsername) {
      const msg = "Please enter a valid username (letters, numbers, underscores).";
      setErrorMessage(msg);
      toast.error("INVALID USERNAME", msg);
      setCooldown(3);
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.register({
        username: sanitizedUsername,
        email,
        password,
      });

      toast.success(
        "ACCOUNT CREATED!",
        "OTP verification code sent to your email.",
        { badge: "NOW", duration: 4000 }
      );

      setSuccessMessage(response.message || "Account created! OTP sent to your email.");
      setShowOtpModal(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Registration failed. Please try again.";
      setErrorMessage(msg);
      
      toast.error("REGISTRATION FAILED", msg, {
        badge: "NOW",
        duration: 3500,
        details: `Endpoint: POST /api/auth/register\nStatus: 400/409 Conflict\nError: ${msg}\nTimestamp: ${new Date().toISOString()}`,
      });

      setCooldown(3);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle OTP email verification submission
   */
  const handleVerifyOtpSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      await authService.verifyEmail({ email, otp: otpCode });
      
      toast.success("EMAIL VERIFIED!", "Account verified successfully! Redirecting to login...", {
        badge: "NOW",
        duration: 3500,
      });

      setSuccessMessage("Email verified successfully! Redirecting to login...");

      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "OTP verification failed.";
      setErrorMessage(msg);
      toast.error("VERIFICATION FAILED", msg);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle resending OTP code
   */
  const handleResendOtp = async () => {
    setErrorMessage(null);
    try {
      await authService.resendOtp(email);
      toast.info("OTP RESENT", "A new OTP code has been sent to your email!");
      setSuccessMessage("New OTP code sent to your email!");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
        toast.error("RESEND FAILED", err.message);
      }
    }
  };

  return (
    <section className="w-full max-w-4xl px-2 py-2">
      <div className="grid w-full min-h-[560px] grid-cols-1 overflow-hidden rounded-3xl border-4 border-[#232B26] bg-white shadow-[10px_10px_0px_#232B26] md:grid-cols-12">
        {/* Left Panel - Retro Game Boy Console */}
        <div className="flex flex-col justify-between border-b-4 border-[#232B26] bg-[#A8D8B9] p-5 sm:p-7 md:col-span-5 md:border-b-0 md:border-r-4">
          <RetroGameScreen />
        </div>

        {/* Right Panel - Form or OTP Verification */}
        <div className="flex flex-col justify-center p-5 sm:p-8 md:col-span-7">
          <div className="mb-3">
            <h2 className="text-2xl font-black tracking-tight text-[#232B26] sm:text-3xl">
              {showOtpModal ? "Verify Email OTP" : t("title")}
            </h2>
            <p className="mt-1 text-xs font-semibold text-zinc-500 sm:text-sm">
              {showOtpModal
                ? `Enter the 6-digit OTP code sent to ${email}`
                : t("subtitle")}
            </p>
          </div>

          {/* Alert Messages */}
          {errorMessage && (
            <div className="mb-3 rounded-xl border-2 border-[#232B26] bg-[#FF3B30] p-2.5 text-xs font-black uppercase text-white shadow-[2px_2px_0px_#232B26]">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="mb-3 rounded-xl border-2 border-[#232B26] bg-[#00A170] p-2.5 text-xs font-black uppercase text-white shadow-[2px_2px_0px_#232B26]">
              {successMessage}
            </div>
          )}

          {!showOtpModal ? (
            /* Account Registration Form */
            <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-2.5">
              {/* Username Input */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="username"
                  className="text-[11px] font-black uppercase tracking-wider text-[#232B26] sm:text-xs"
                >
                  {t("usernameLabel")}
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={t("usernamePlaceholder")}
                  required
                  className="w-full rounded-xl border-2 border-[#232B26] bg-white px-3 py-2 text-sm font-medium text-[#232B26] shadow-[2px_2px_0px_#232B26] outline-none transition-all placeholder:font-normal placeholder:text-zinc-400 focus:border-[#00A170] focus:ring-2 focus:ring-[#00A170]"
                />
              </div>

              {/* Email Address Input */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="email"
                  className="text-[11px] font-black uppercase tracking-wider text-[#232B26] sm:text-xs"
                >
                  {t("emailLabel")}
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("emailPlaceholder")}
                  required
                  className="w-full rounded-xl border-2 border-[#232B26] bg-white px-3 py-2 text-sm font-medium text-[#232B26] shadow-[2px_2px_0px_#232B26] outline-none transition-all placeholder:font-normal placeholder:text-zinc-400 focus:border-[#00A170] focus:ring-2 focus:ring-[#00A170]"
                />
              </div>

              {/* Password Input with Show/Hide Eye Toggle */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="password"
                  className="text-[11px] font-black uppercase tracking-wider text-[#232B26] sm:text-xs"
                >
                  {t("passwordLabel")}
                </label>
                <div className="relative flex items-center">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t("passwordPlaceholder")}
                    minLength={6}
                    required
                    className="w-full rounded-xl border-2 border-[#232B26] bg-white px-3 py-2 pr-10 text-sm font-medium text-[#232B26] shadow-[2px_2px_0px_#232B26] outline-none transition-all placeholder:font-normal placeholder:text-zinc-400 focus:border-[#00A170] focus:ring-2 focus:ring-[#00A170]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-2.5 text-zinc-500 hover:text-[#232B26] transition-colors p-1"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input with Show/Hide Eye Toggle */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="confirmPassword"
                  className="text-[11px] font-black uppercase tracking-wider text-[#232B26] sm:text-xs"
                >
                  {t("confirmPasswordLabel")}
                </label>
                <div className="relative flex items-center">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={t("confirmPasswordPlaceholder")}
                    minLength={6}
                    required
                    className={`w-full rounded-xl border-2 border-[#232B26] bg-white px-3 py-2 pr-10 text-sm font-medium text-[#232B26] shadow-[2px_2px_0px_#232B26] outline-none transition-all placeholder:font-normal placeholder:text-zinc-400 focus:border-[#00A170] focus:ring-2 focus:ring-[#00A170] ${
                      confirmPassword && password !== confirmPassword
                        ? "border-[#FF3B30] focus:border-[#FF3B30] focus:ring-[#FF3B30]"
                        : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-2.5 text-zinc-500 hover:text-[#232B26] transition-colors p-1"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                {/* Instant password mismatch inline feedback */}
                {confirmPassword && password !== confirmPassword && (
                  <span className="text-[10px] font-extrabold text-[#FF3B30]">
                    {t("passwordMismatch")}
                  </span>
                )}
              </div>

              {/* Terms Agreement Checkbox */}
              <div className="mt-1 flex items-center gap-2">
                <input
                  id="terms"
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  required
                  className="h-4 w-4 rounded border-2 border-[#232B26] accent-[#00A170]"
                />
                <label htmlFor="terms" className="text-xs font-semibold text-zinc-600">
                  {t("termsAgree")}{" "}
                  <Link
                    href="/register"
                    className="font-extrabold text-[#00A170] underline underline-offset-2 hover:text-[#008f63]"
                  >
                    {t("termsOfService")}
                  </Link>{" "}
                  {t("andText")}{" "}
                  <Link
                    href="/register"
                    className="font-extrabold text-[#00A170] underline underline-offset-2 hover:text-[#008f63]"
                  >
                    {t("privacyPolicy")}
                  </Link>
                  .
                </label>
              </div>

              {/* Submit Button with Cooldown Lock */}
              <button
                type="submit"
                disabled={isLoading || cooldown > 0}
                className="btn-brutal mt-1.5 w-full rounded-xl border-4 border-[#232B26] bg-[#00A170] py-2.5 text-center text-base font-extrabold text-white shadow-[4px_4px_0px_#232B26] transition-all hover:bg-[#008f63] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_#232B26] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading
                  ? "Creating account..."
                  : cooldown > 0
                  ? `Please wait (${cooldown}s)...`
                  : t("submitBtn")}
              </button>
            </form>
          ) : (
            /* OTP Verification Form */
            <form onSubmit={handleVerifyOtpSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="otp"
                  className="text-[11px] font-black uppercase tracking-wider text-[#232B26] sm:text-xs"
                >
                  Verification OTP Code
                </label>
                <input
                  id="otp"
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="e.g. 123456"
                  required
                  className="w-full rounded-xl border-2 border-[#232B26] bg-white px-4 py-3 text-center font-mono text-lg font-black tracking-widest text-[#232B26] shadow-[2px_2px_0px_#232B26] outline-none transition-all placeholder:font-normal placeholder:tracking-normal placeholder:text-zinc-400 focus:border-[#00A170]"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-brutal w-full rounded-xl border-4 border-[#232B26] bg-[#00A170] py-2.5 text-center text-base font-extrabold text-white shadow-[4px_4px_0px_#232B26] transition-all hover:bg-[#008f63] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_#232B26] disabled:opacity-50"
              >
                {isLoading ? "Verifying..." : "Verify OTP & Continue"}
              </button>

              <div className="flex justify-between text-xs font-bold text-zinc-600">
                <button
                  type="button"
                  onClick={() => setShowOtpModal(false)}
                  className="hover:underline"
                >
                  ← Back to Register
                </button>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-[#00A170] hover:underline"
                >
                  Resend OTP Code
                </button>
              </div>
            </form>
          )}

          {/* Footer Link */}
          <div className="mt-3.5 text-center text-xs font-semibold text-zinc-600 sm:text-sm">
            {t("alreadyHaveAccount")}{" "}
            <Link
              href="/login"
              className="font-extrabold text-[#00A170] underline underline-offset-4 hover:text-[#008f63]"
            >
              {t("logInLink")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
