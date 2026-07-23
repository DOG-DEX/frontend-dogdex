"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

/**
 * SiteNav Component
 * Neo-Brutalist navbar matching Figma TopAppBar design.
 * Calibrated for standard 100% viewport zoom (14px navigation links, 12px action CTA).
 */
export function SiteNav() {
  const t = useTranslations("SiteNav");

  return (
    <header className="sticky top-0 z-50 border-b-4 border-[#1A1C1B] bg-white px-6 py-3.5 shadow-brutal-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-black tracking-tight text-[#00A170]"
        >
          <span className="rounded-md border-2 border-[#1A1C1B] bg-[#FF6B00] px-2 py-0.5 text-[10px] font-black uppercase text-white shadow-[2px_2px_0px_#1A1C1B]">
            DEX
          </span>
          DogDexx
        </Link>

        {/* Calibrated Navigation Links (14px standard font size) */}
        <ul className="flex items-center gap-6 text-sm font-extrabold text-[#1A1C1B]">
          <li>
            <Link href="/" className="transition-colors hover:text-[#00A170]">
              {t("home")}
            </Link>
          </li>
          <li>
            <Link href="/dex" className="transition-colors hover:text-[#00A170]">
              {t("dex")}
            </Link>
          </li>
          <li>
            <Link href="/scan" className="transition-colors hover:text-[#00A170]">
              {t("scan")}
            </Link>
          </li>
          <li>
            <Link href="/profile" className="transition-colors hover:text-[#00A170]">
              {t("profile")}
            </Link>
          </li>
        </ul>

        {/* Calibrated Action Button */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="btn-brutal rounded-full bg-[#00A170] px-4 py-2 text-xs font-extrabold text-white hover:bg-[#008f63]"
          >
            {t("login")}
          </Link>
        </div>
      </nav>
    </header>
  );
}
