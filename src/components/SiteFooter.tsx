"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export function SiteFooter() {
  const t = useTranslations("SiteFooter");

  return (
    <footer className="mt-auto border-t-2 border-[#232B26] bg-white px-6 py-6 text-[#232B26]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 font-sans md:flex-row">
        {/* Left Side: Real Logo + Tagline Quote */}
        <div className="flex items-center gap-3">
          <Link href="/" className="inline-block transition-opacity hover:opacity-80">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logos/logo-ic-black.png"
              alt="Dog Dex Logo"
              className="h-8 w-auto object-contain"
            />
          </Link>
          <span className="text-xs font-semibold italic text-[#232B26]/70 hidden sm:inline">
            {t("tagline")}
          </span>
        </div>

        {/* Middle: Single Underlined Policy Link */}
        <div>
          <Link
            href="/policies"
            className="text-xs font-extrabold uppercase underline decoration-2 underline-offset-4 decoration-[#232B26] text-[#232B26] hover:text-[#00A170] transition-colors"
          >
            {t("privacyPolicy")}
          </Link>
        </div>

        {/* Right Side: Social Icons + Copyright */}
        <div className="flex items-center gap-5">
          {/* Social Icons (Neutral Monochrome Style) */}
          <div className="flex items-center gap-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              title="Instagram"
              aria-label="Instagram"
              className="text-[#232B26] transition-colors hover:text-[#00A170]"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>

            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noreferrer"
              title="TikTok"
              aria-label="TikTok"
              className="text-[#232B26] transition-colors hover:text-[#00A170]"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-2.88-2.88c.37 0 .72.07 1.05.2v-3.6a6.5 6.5 0 1 0 5.28 6.36V9.45a8.27 8.27 0 0 0 4.77 1.49v-3.7a4.86 4.86 0 0 1-1.0.45z" />
              </svg>
            </a>

            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              title="Facebook"
              aria-label="Facebook"
              className="text-[#232B26] transition-colors hover:text-[#00A170]"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
          </div>

          <span className="text-[#232B26]/30">|</span>

          <p className="font-mono text-[11px] font-extrabold uppercase text-[#232B26]/60">
            {t("copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
