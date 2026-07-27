"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { RetroGameScreen } from "../components/RetroGameScreen";
import { PasswordInput } from "../components/PasswordInput";
import { authService } from "../services/auth.service";
import { useToast } from "@/components/ToastContext";
import { useCountdown } from '../hooks/useCountdown';

/**
 * LoginView Component
 * Supports automatic OTP verification modal if logging in with an unverified account.
 */
export function LoginView() {
  const t = useTranslations("LoginView");
  const router = useRouter();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // OTP Verification state for unverified account login attempts
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  // Submit button cooldown state
  const [cooldown, setCooldown] = useCountdown();
  const [resendCooldown, setResendCooldown] = useCountdown();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (cooldown > 0) return;

    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const response = await authService.login({ email, password });

      // Save pending success toast payload to sessionStorage so it triggers ON the Home page AFTER navigation
      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          "pendingSuccessToast",
          JSON.stringify({
            title: t("loginSuccessTitle"),
            message: t("loginSuccessMessage"),
            badge: "NOW",
            duration: 4000,
          })
        );
      }

      setSuccessMessage(response.message || "Login successful!");

      // Navigate immediately to home page
      router.push("/");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";

      // If account is unverified, auto-switch to OTP verification view
      if (msg.toLowerCase().includes("not verified")) {
        setSuccessMessage("Account not verified. A new OTP has been sent to your email!");
        setShowOtpModal(true);
        setResendCooldown(60);
        toast.info(
          t("accountUnverifiedTitle"),
          t("accountUnverifiedMsg"),
          { duration: 5000 }
        );
        return;
      }

      setErrorMessage(msg);

      // Trigger compact Error Toast with Dev Mode technical log details & 3.5s duration
      toast.error(t("loginFailedTitle"), msg, {
        badge: "NOW",
        duration: 3500,
        details: `Endpoint: POST /api/auth/login\nStatus: 400/401 Unauthorized\nError: ${msg}\nTimestamp: ${new Date().toISOString()}`,
      });

      // Lock submit button for 3 seconds matching the error progress bar to prevent spam
      setCooldown(3);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtpSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      await authService.verifyEmail({ email, otp: otpCode });
      toast.success("EMAIL VERIFIED!", "Logging in automatically...", { duration: 3000 });

      // Automatically complete login after successful OTP verification
      const response = await authService.login({ email, password });
      setSuccessMessage(response.message || "Login successful!");
      router.push("/");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "OTP verification failed.";
      setErrorMessage(msg);
      toast.error("VERIFICATION FAILED", msg);
    } finally {
      setIsLoading(false);
    }
  };

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
        {/* Left Panel - Form */}
        <div className="flex flex-col justify-center p-5 sm:p-8 md:col-span-7">
          <div className="mb-4">
            <h1 className="text-2xl font-black tracking-tight text-[#232B26] sm:text-3xl">
              {showOtpModal ? "Verify Email OTP" : t("title")}
            </h1>
            <p className="mt-1 text-xs font-semibold text-[#404944] sm:text-sm">
              {showOtpModal
                ? `Enter the 6-digit OTP code sent to ${email}`
                : t("subtitle")}
            </p>
          </div>

          {/* Alert Messages */}
          {errorMessage && (
            <div className="mb-4 rounded-xl border-2 border-[#232B26] bg-[#FF3B30] p-3 text-xs font-black uppercase text-white shadow-[2px_2px_0px_#232B26]">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="mb-4 rounded-xl border-2 border-[#232B26] bg-[#00A170] p-3 text-xs font-black uppercase text-white shadow-[2px_2px_0px_#232B26]">
              {successMessage}
            </div>
          )}

          {!showOtpModal ? (
            /* Login Form */
            <>
              {/* Social Authentication Buttons */}
              <div className="mt-2 flex flex-col gap-2.5">
                <button
                  type="button"
                  className="btn-brutal flex w-full items-center justify-center gap-2.5 rounded-xl border-4 border-[#232B26] bg-white py-2.5 text-xs font-extrabold text-[#232B26] shadow-[4px_4px_0px_#232B26] transition-all hover:bg-zinc-50 active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_#232B26] sm:text-sm"
                >
                  <svg className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>{t("continueWithGoogle")}</span>
                </button>

                <button
                  type="button"
                  className="btn-brutal flex w-full items-center justify-center gap-2.5 rounded-xl border-4 border-[#232B26] bg-white py-2.5 text-xs font-extrabold text-[#232B26] shadow-[4px_4px_0px_#232B26] transition-all hover:bg-zinc-50 active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_#232B26] sm:text-sm"
                >
                  <svg className="h-4 w-4 fill-current text-[#232B26] sm:h-5 sm:w-5" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.32c.67-.82 1.13-1.96.99-3.12-1 .04-2.18.67-2.88 1.49-.62.72-1.16 1.88-1.01 3.01 1.12.09 2.23-.56 2.9-1.38z" />
                  </svg>
                  <span>{t("continueWithApple")}</span>
                </button>
              </div>

              {/* Divider */}
              <div className="my-3 flex items-center justify-center gap-3">
                <div className="h-[2px] flex-1 bg-[#232B26]" />
                <span className="font-mono text-xs font-black uppercase tracking-wider text-[#404944]">
                  {t("orDivider")}
                </span>
                <div className="h-[2px] flex-1 bg-[#232B26]" />
              </div>

              {/* Email & Password Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
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

                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="password"
                    className="text-[11px] font-black uppercase tracking-wider text-[#232B26] sm:text-xs"
                  >
                    {t("passwordLabel")}
                  </label>
                  {/*
                    PasswordInput uses hidden real <input type="password"> (opacity-0) + visual paw div.
                    Browser bullets and autofill overlays are trapped in the invisible input —
                    no CSS tricks needed, no duplicate, no hover leak.
                  */}
                  <PasswordInput
                    id="password"
                    value={password}
                    onChange={setPassword}
                    placeholder={t("passwordPlaceholder")}
                    required
                    autoComplete="current-password"
                    showPassword={showPassword}
                    onToggleShow={() => setShowPassword((prev) => !prev)}
                    showLabel={t("showPassword")}
                    hideLabel={t("hidePassword")}
                  />
                  <div className="mt-0.5 text-right">
                    <Link
                      href="/forgot-password"
                      className="text-[11px] font-extrabold text-[#00A170] underline underline-offset-2 hover:text-[#008f63] sm:text-xs"
                    >
                      {t("forgotPassword")}
                    </Link>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || cooldown > 0}
                  className="btn-brutal mt-1 flex w-full items-center justify-center gap-2 rounded-xl border-4 border-[#232B26] bg-[#00A170] py-2.5 text-center text-base font-extrabold text-white shadow-[4px_4px_0px_#232B26] transition-all hover:bg-[#008f63] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_#232B26] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>
                    {isLoading
                      ? "Signing in..."
                      : cooldown > 0
                        ? `Please wait (${cooldown}s)...`
                        : t("submitBtn")}
                  </span>
                </button>
              </form>

              {/* Footer Link */}
              <div className="mt-3.5 text-center text-xs font-semibold text-[#404944] sm:text-sm">
                {t("dontHaveAccount")}{" "}
                <Link
                  href="/register"
                  className="font-extrabold text-[#00A170] underline underline-offset-4 hover:text-[#008f63]"
                >
                  {t("signUp")}
                </Link>
              </div>
            </>
          ) : (
            /* OTP Verification Form for Unverified Account Login */
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
                  maxLength={6}
                  required
                  className="w-full rounded-xl border-2 border-[#232B26] bg-white px-4 py-3 text-center font-mono text-lg font-black tracking-widest text-[#232B26] shadow-[2px_2px_0px_#232B26] outline-none transition-all placeholder:font-normal placeholder:tracking-normal placeholder:text-zinc-400 focus:border-[#00A170]"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-brutal w-full rounded-xl border-4 border-[#232B26] bg-[#00A170] py-2.5 text-center text-base font-extrabold text-white shadow-[4px_4px_0px_#232B26] transition-all hover:bg-[#008f63] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_#232B26] disabled:opacity-50"
              >
                {isLoading ? "Verifying & Logging in..." : "Verify OTP & Log In"}
              </button>

              <div className="flex items-center justify-between text-xs font-bold text-zinc-600">
                <button
                  type="button"
                  onClick={() => setShowOtpModal(false)}
                  className="hover:underline text-[#232B26]"
                >
                  ← Back to Login
                </button>
                <button
                  type="button"
                  disabled={resendCooldown > 0 || isLoading}
                  onClick={handleResendOtp}
                  className="rounded-lg border-2 border-[#232B26] bg-[#FFCC00] px-3 py-1.5 text-xs font-extrabold uppercase text-[#232B26] shadow-[2px_2px_0px_#232B26] transition-all hover:bg-[#E6B800] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resendCooldown > 0
                    ? `Resend in ${resendCooldown}s`
                    : "Resend OTP Code"}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right Panel - Retro Game Boy Console (hidden on mobile) */}
        <div className="hidden flex-col justify-between border-t-4 border-[#232B26] bg-[#A8D8B9] p-5 sm:p-7 md:col-span-5 md:flex md:border-t-0 md:border-l-4">
          <RetroGameScreen />
        </div>
      </div>
    </section>
  );
}

