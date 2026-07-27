"use client";

import { FormEvent, useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { RetroGameScreen } from "../components/RetroGameScreen";
import { authService } from "../services/auth.service";
import { useToast } from "@/components/ToastContext";

/**
 * ForgotPasswordView Component
 * Neo-Brutalist / Retro Arcade 2-step Passcode Recovery screen with segmented OTP pin inputs.
 * Uses DogDex official logo (/logos/logo-ic-black.png) and connects to NestJS auth endpoints.
 */
export function ForgotPasswordView() {
  const t = useTranslations("ForgotPasswordView");
  const router = useRouter();
  const { toast } = useToast();

  // Step state: 1 = Enter Email, 2 = Verify OTP & Reset Password
  const [step, setStep] = useState<1 | 2>(1);

  // Form fields
  const [email, setEmail] = useState("");
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Loading & error states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 60s Resend OTP cooldown timer
  const [cooldown, setCooldown] = useState(0);

  // Refs for 6-digit OTP input auto-focus
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Handle Step 1: Send OTP to Email
  const handleSendOtp = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const res = await authService.forgotPassword({ email });
      setSuccessMessage(
        res.message || "OTP code transmitted to your email address."
      );
      setStep(2);
      setCooldown(60);

      toast.success(
        "OTP TRANSMITTED",
        "Check your email for the 6-digit security code.",
        { duration: 4000 }
      );
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to send reset email.";
      setErrorMessage(msg);

      toast.error("TRANSMISSION FAILED", msg, {
        badge: "ERROR",
        duration: 3500,
        details: `Endpoint: POST /api/auth/forgot-password\nError: ${msg}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Resend OTP in Step 2
  const handleResendOtp = async () => {
    if (cooldown > 0 || isLoading) return;

    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const res = await authService.forgotPassword({ email });
      setSuccessMessage(res.message || "A new 6-digit OTP code has been sent.");
      setCooldown(60);

      toast.success(
        "NEW OTP SENT",
        "A fresh verification code has been dispatched.",
        { duration: 3500 }
      );
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to resend OTP code.";
      setErrorMessage(msg);
      toast.error("RESEND FAILED", msg, { duration: 3500 });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP Digit Input Auto-Advance & Backspace
  const handleOtpDigitChange = (index: number, value: string) => {
    // Only accept numeric digit
    const digit = value.replace(/[^0-9]/g, "").slice(-1);
    const newOtp = [...otpDigits];
    newOtp[index] = digit;
    setOtpDigits(newOtp);

    // Auto-advance focus to next input if digit entered
    if (digit && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      // Auto-jump to previous input on Backspace when current is empty
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/[^0-9]/g, "");
    if (!pastedData) return;

    const newOtp = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      if (pastedData[i]) {
        newOtp[i] = pastedData[i];
      }
    }
    setOtpDigits(newOtp);

    // Focus last filled digit or final box
    const nextFocusIndex = Math.min(pastedData.length, 5);
    otpInputRefs.current[nextFocusIndex]?.focus();
  };

  // Handle Step 2: Submit Reset Password with OTP
  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();

    const fullOtp = otpDigits.join("");
    if (fullOtp.length < 6) {
      const msg = t("otpLengthError");
      setErrorMessage(msg);
      toast.error("INVALID OTP", msg, { duration: 3000 });
      return;
    }

    if (password !== confirmPassword) {
      const msg = t("passwordMismatch");
      setErrorMessage(msg);
      toast.error("MISMATCH", msg, { duration: 3000 });
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const res = await authService.resetPassword({
        email,
        otp: fullOtp,
        password,
      });

      // Save pending toast to sessionStorage so it triggers on Login page
      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          "pendingSuccessToast",
          JSON.stringify({
            title: "PASSCODE OVERWRITTEN",
            message: "Your account password has been updated. Please log in.",
            badge: "SUCCESS",
            duration: 5000,
          })
        );
      }

      setSuccessMessage(res.message || "Password reset successful!");

      // Navigate to login page
      router.push("/login");
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Password reset failed.";
      setErrorMessage(msg);

      toast.error("RESET FAILED", msg, {
        badge: "ERROR",
        duration: 3500,
        details: `Endpoint: POST /api/auth/reset-password\nError: ${msg}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full max-w-4xl px-2 py-2">
      <div className="grid w-full min-h-[560px] grid-cols-1 overflow-hidden rounded-3xl border-4 border-[#232B26] bg-white shadow-[10px_10px_0px_#232B26] md:grid-cols-12">
        {/* Left Panel - Retro Terminal Form */}
        <div className="flex flex-col justify-between p-5 sm:p-8 md:col-span-7">
          <div>
            {/* DogDex Official Logo Header */}
            <div className="mb-4 flex items-center justify-between border-b-4 border-[#232B26] pb-3">
              <Link href="/" className="inline-block transition-transform hover:scale-105">
                <Image
                  src="/logos/logo-ic-black.png"
                  alt="DogDex Logo"
                  width={140}
                  height={40}
                  priority
                  className="h-9 w-auto object-contain"
                />
              </Link>
              <div className="rounded-xl border-2 border-[#232B26] bg-[#85E0C0] px-2.5 py-1 font-mono text-[10px] font-black uppercase text-[#232B26] shadow-[2px_2px_0px_#232B26]">
                {step === 1 ? t("step1Badge") : t("step2Badge")}
              </div>
            </div>

            {/* Title Section */}
            <div className="mb-4">
              <h1 className="text-2xl font-black tracking-tight text-[#232B26] sm:text-3xl">
                {t("title")}
              </h1>
              <p className="mt-1 text-xs font-semibold text-[#404944] sm:text-sm">
                {t("subtitle")}
              </p>
            </div>

            {/* Alert Messages */}
            {errorMessage && (
              <div className="mb-4 rounded-xl border-4 border-[#232B26] bg-[#FF3B30] p-3 font-mono text-xs font-black uppercase text-white shadow-[3px_3px_0px_#232B26]">
                [ERROR] {errorMessage}
              </div>
            )}
            {successMessage && (
              <div className="mb-4 rounded-xl border-4 border-[#232B26] bg-[#00A170] p-3 font-mono text-xs font-black uppercase text-white shadow-[3px_3px_0px_#232B26]">
                [STATUS: OK] {successMessage}
              </div>
            )}

            {/* STEP 1 FORM: Transmit Email */}
            {step === 1 && (
              <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="email"
                    className="font-mono text-xs font-black uppercase tracking-wider text-[#232B26]"
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
                    className="w-full rounded-xl border-4 border-[#232B26] bg-white px-3.5 py-2.5 font-mono text-sm font-bold text-[#232B26] shadow-[3px_3px_0px_#232B26] outline-none transition-all placeholder:font-normal placeholder:text-zinc-400 focus:border-[#00A170] focus:bg-[#E8F5E9]/30"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !email}
                  className="btn-brutal mt-2 flex w-full items-center justify-center gap-2 rounded-xl border-4 border-[#232B26] bg-[#00A170] py-3 font-mono text-sm font-black uppercase text-white shadow-[4px_4px_0px_#232B26] transition-all hover:bg-[#008f63] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_#232B26] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>{isLoading ? t("sending") : t("sendOtpBtn")}</span>
                </button>
              </form>
            )}

            {/* STEP 2 FORM: 6-Digit Segmented PIN & New Password */}
            {step === 2 && (
              <form onSubmit={handleResetPassword} className="flex flex-col gap-3.5">
                {/* Email Banner */}
                <div className="flex items-center justify-between rounded-xl border-2 border-[#232B26] bg-zinc-100 px-3 py-2 font-mono text-xs font-bold text-[#232B26] shadow-[2px_2px_0px_#232B26]">
                  <span className="truncate">TARGET: {email}</span>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="ml-2 underline hover:text-[#00A170]"
                  >
                    CHANGE
                  </button>
                </div>

                {/* Segmented 6-Digit OTP Pin Input */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-xs font-black uppercase tracking-wider text-[#232B26]">
                    {t("otpLabel")}
                  </label>
                  <div className="flex items-center justify-between gap-1.5 sm:gap-2">
                    {otpDigits.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => {
                          otpInputRefs.current[index] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpDigitChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        onPaste={handleOtpPaste}
                        className="h-12 w-10 sm:h-14 sm:w-12 rounded-xl border-4 border-[#232B26] bg-white text-center font-mono text-xl font-black text-[#232B26] shadow-[3px_3px_0px_#232B26] outline-none transition-all focus:border-[#00A170] focus:bg-[#85E0C0]/20 focus:scale-105"
                      />
                    ))}
                  </div>
                  <p className="font-mono text-[10px] font-semibold text-[#404944]">
                    {t("otpHint")}
                  </p>
                </div>

                {/* New Password Input */}
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="password"
                    className="font-mono text-xs font-black uppercase tracking-wider text-[#232B26]"
                  >
                    {t("newPasswordLabel")}
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t("newPasswordPlaceholder")}
                    required
                    className="w-full rounded-xl border-4 border-[#232B26] bg-white px-3.5 py-2 font-mono text-sm font-bold text-[#232B26] shadow-[3px_3px_0px_#232B26] outline-none transition-all placeholder:font-normal placeholder:text-zinc-400 focus:border-[#00A170] focus:bg-[#E8F5E9]/30"
                  />
                </div>

                {/* Confirm Password Input */}
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="confirmPassword"
                    className="font-mono text-xs font-black uppercase tracking-wider text-[#232B26]"
                  >
                    {t("confirmPasswordLabel")}
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={t("confirmPasswordPlaceholder")}
                    required
                    className="w-full rounded-xl border-4 border-[#232B26] bg-white px-3.5 py-2 font-mono text-sm font-bold text-[#232B26] shadow-[3px_3px_0px_#232B26] outline-none transition-all placeholder:font-normal placeholder:text-zinc-400 focus:border-[#00A170] focus:bg-[#E8F5E9]/30"
                  />
                </div>

                {/* Resend Code Action Bar */}
                <div className="mt-1 flex items-center justify-between font-mono text-xs">
                  <span className="font-bold text-[#404944]">
                    {cooldown > 0
                      ? t("cooldownText", { seconds: cooldown })
                      : "Did not receive code?"}
                  </span>
                  <button
                    type="button"
                    disabled={cooldown > 0 || isLoading}
                    onClick={handleResendOtp}
                    className="rounded-lg border-2 border-[#232B26] bg-[#FFCC00] px-2.5 py-1 font-extrabold uppercase text-[#232B26] shadow-[2px_2px_0px_#232B26] transition-all hover:bg-[#E6B800] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t("resendOtp")}
                  </button>
                </div>

                {/* Submit Reset Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-brutal mt-2 flex w-full items-center justify-center gap-2 rounded-xl border-4 border-[#232B26] bg-[#00A170] py-3 font-mono text-sm font-black uppercase text-white shadow-[4px_4px_0px_#232B26] transition-all hover:bg-[#008f63] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_#232B26] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>{isLoading ? t("resetting") : t("resetBtn")}</span>
                </button>
              </form>
            )}
          </div>

          {/* Bottom Back to Login Link */}
          <div className="mt-4 border-t-2 border-dashed border-[#232B26] pt-3 text-center">
            <Link
              href="/login"
              className="font-mono text-xs font-black uppercase tracking-wider text-[#00A170] underline underline-offset-4 hover:text-[#008f63]"
            >
              ← {t("backToLogin")}
            </Link>
          </div>
        </div>

        {/* Right Panel - Retro Game Boy Console */}
        <div className="flex flex-col justify-between border-t-4 border-[#232B26] bg-[#A8D8B9] p-5 sm:p-7 md:col-span-5 md:border-t-0 md:border-l-4">
          <RetroGameScreen />
        </div>
      </div>
    </section>
  );
}
