"use client";

import { FormEvent, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { RetroGameScreen } from "../components/RetroGameScreen";
import { PasswordInput } from "../components/PasswordInput";
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
  const [resendCooldown, setResendCooldown] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

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
      setResendCooldown(60);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Registration failed. Please try again.";

      // If email is already registered but unverified, auto-switch to OTP modal so user can verify immediately
      if (msg.toLowerCase().includes("not verified") || msg.toLowerCase().includes("verify your email")) {
        setSuccessMessage("Account is registered but unverified. A new OTP code has been sent to your email!");
        setShowOtpModal(true);
        setResendCooldown(60);
        toast.info(
          "UNVERIFIED ACCOUNT",
          "Your account is registered but not verified. Please enter the OTP sent to your email.",
          { duration: 5000 }
        );
        return;
      }

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
   * Handle resending OTP code with 60s cooldown
   */
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || isLoading) return;

    setErrorMessage(null);
    setIsLoading(true);

    try {
      await authService.resendOtp(email);
      toast.info("OTP RESENT", "A new OTP code has been sent to your email!");
      setSuccessMessage("New OTP code sent to your email!");
      setResendCooldown(60);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
        toast.error("RESEND FAILED", err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full max-w-4xl px-2 py-2">
      <div className="grid w-full min-h-[480px] grid-cols-1 overflow-hidden rounded-2xl border-4 border-[#232B26] bg-white shadow-[6px_6px_0px_#232B26] sm:min-h-[560px] sm:rounded-3xl sm:shadow-[10px_10px_0px_#232B26] md:grid-cols-12">
        {/* Left Panel - Retro Game Boy Console (hidden on mobile) */}
        <div className="hidden flex-col justify-between border-b-4 border-[#232B26] bg-[#A8D8B9] p-5 sm:p-7 md:col-span-5 md:flex md:border-b-0 md:border-r-4">
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

              {/* Password Input */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="password"
                  className="text-[11px] font-black uppercase tracking-wider text-[#232B26] sm:text-xs"
                >
                  {t("passwordLabel")}
                </label>
                {/*
                  PasswordInput: hidden <input type="password"> (opacity-0) captures keystrokes,
                  visual div shows paw icons. No browser bullet/autofill leak possible.
                */}
                <PasswordInput
                  id="password"
                  value={password}
                  onChange={setPassword}
                  placeholder={t("passwordPlaceholder")}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  showPassword={showPassword}
                  onToggleShow={() => setShowPassword((prev) => !prev)}
                  showLabel={t("showPassword")}
                  hideLabel={t("hidePassword")}
                />
              </div>

              {/* Confirm Password Input */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="confirmPassword"
                  className="text-[11px] font-black uppercase tracking-wider text-[#232B26] sm:text-xs"
                >
                  {t("confirmPasswordLabel")}
                </label>
                <PasswordInput
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  placeholder={t("confirmPasswordPlaceholder")}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  showPassword={showConfirmPassword}
                  onToggleShow={() => setShowConfirmPassword((prev) => !prev)}
                  showLabel={t("showPassword")}
                  hideLabel={t("hidePassword")}
                  // Red border when confirm password doesn't match
                  extraBorderClass={
                    confirmPassword && password !== confirmPassword
                      ? "border-[#FF3B30] focus:border-[#FF3B30] focus:ring-[#FF3B30]"
                      : ""
                  }
                />
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

              <div className="flex items-center justify-between text-xs font-bold text-zinc-600">
                <button
                  type="button"
                  onClick={() => setShowOtpModal(false)}
                  className="hover:underline text-[#232B26]"
                >
                  ← Back to Register
                </button>
                <button
                  type="button"
                  disabled={resendCooldown > 0 || isLoading}
                  onClick={handleResendOtp}
                  className="rounded-lg border-2 border-[#232B26] bg-[#FFCC00] px-3 py-1.5 text-xs font-extrabold uppercase text-[#232B26] shadow-[2px_2px_0px_#232B26] transition-all hover:bg-[#E6B800] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resendCooldown > 0
                    ? t("cooldownText", { seconds: resendCooldown })
                    : t("resendOtp")}
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
