"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { RetroGameScreen } from "../components/RetroGameScreen";

/**
 * RegisterView Component
 * Neo-Brutalist split layout matching LoginView specs.
 * Left panel: Retro Game Boy Console with Dog Mini-game.
 * Right panel: Account registration form.
 */
export function RegisterView() {
  const t = useTranslations("RegisterView");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Registering account:", {
      firstName,
      lastName,
      email,
      password,
      agreed,
    });
  };

  return (
    <section className="w-full max-w-4xl px-2 py-2">
      <div className="grid w-full min-h-[560px] grid-cols-1 overflow-hidden rounded-3xl border-4 border-[#232B26] bg-white shadow-[10px_10px_0px_#232B26] md:grid-cols-12">
        {/* Left Panel - Retro Game Boy Console */}
        <div className="flex flex-col justify-between border-b-4 border-[#232B26] bg-[#A8D8B9] p-5 sm:p-7 md:col-span-5 md:border-b-0 md:border-r-4">
          <RetroGameScreen />
        </div>

        {/* Right Panel - Form */}
        <div className="flex flex-col justify-center p-5 sm:p-8 md:col-span-7">
          <div className="mb-4">
            <h2 className="text-2xl font-black tracking-tight text-[#232B26] sm:text-3xl">
              {t("title")}
            </h2>
            <p className="mt-1 text-xs font-semibold text-zinc-500 sm:text-sm">
              {t("subtitle")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {/* First Name & Last Name */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="firstName"
                  className="text-[11px] font-black uppercase tracking-wider text-[#232B26] sm:text-xs"
                >
                  {t("firstNameLabel")}
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder={t("firstNamePlaceholder")}
                  required
                  className="w-full rounded-xl border-2 border-[#232B26] bg-white px-3 py-2 text-sm font-medium text-[#232B26] shadow-[2px_2px_0px_#232B26] outline-none transition-all placeholder:font-normal placeholder:text-zinc-400 focus:border-[#00A170] focus:ring-2 focus:ring-[#00A170]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="lastName"
                  className="text-[11px] font-black uppercase tracking-wider text-[#232B26] sm:text-xs"
                >
                  {t("lastNameLabel")}
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder={t("lastNamePlaceholder")}
                  required
                  className="w-full rounded-xl border-2 border-[#232B26] bg-white px-3 py-2 text-sm font-medium text-[#232B26] shadow-[2px_2px_0px_#232B26] outline-none transition-all placeholder:font-normal placeholder:text-zinc-400 focus:border-[#00A170] focus:ring-2 focus:ring-[#00A170]"
                />
              </div>
            </div>

            {/* Email Address */}
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

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="password"
                className="text-[11px] font-black uppercase tracking-wider text-[#232B26] sm:text-xs"
              >
                {t("passwordLabel")}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("passwordPlaceholder")}
                required
                className="w-full rounded-xl border-2 border-[#232B26] bg-white px-3 py-2 text-sm font-medium text-[#232B26] shadow-[2px_2px_0px_#232B26] outline-none transition-all placeholder:font-normal placeholder:text-zinc-400 focus:border-[#00A170] focus:ring-2 focus:ring-[#00A170]"
              />
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

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-brutal mt-2 w-full rounded-xl border-4 border-[#232B26] bg-[#00A170] py-2.5 text-center text-base font-extrabold text-white shadow-[4px_4px_0px_#232B26] transition-all hover:bg-[#008f63] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_#232B26]"
            >
              {t("submitBtn")}
            </button>
          </form>

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
