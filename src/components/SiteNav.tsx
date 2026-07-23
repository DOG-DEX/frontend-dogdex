"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

/**
 * SiteNav Component
 * Neo-Brutalist navbar matching Figma TopAppBar design.
 * Features 4px dark bottom border, bold typography, zero icons.
 */
export function SiteNav() {
  const t = useTranslations("SiteNav");

  return (
    <header className="sticky top-0 z-50 border-b-4 border-[#232B26] bg-white px-6 py-4 shadow-brutal-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-black tracking-tight text-[#00A170]"
        >
          <span className="rounded-md border-2 border-[#232B26] bg-[#FF6B00] px-2 py-0.5 text-xs font-black text-white">
            DEX
          </span>
          DogDexx
        </Link>

        {/* Navigation Links */}
        <ul className="flex items-center gap-6 text-sm font-extrabold text-[#232B26]">
          <li>
            <Link href="/" className="hover:text-[#00A170] transition-colors">
              {t("home")}
            </Link>
          </li>
          <li>
            <Link href="/dex" className="hover:text-[#00A170] transition-colors">
              {t("dex")}
            </Link>
          </li>
          <li>
            <Link href="/scan" className="hover:text-[#00A170] transition-colors">
              {t("scan")}
            </Link>
          </li>
          <li>
            <Link href="/profile" className="hover:text-[#00A170] transition-colors">
              {t("profile")}
            </Link>
          </li>
        </ul>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="btn-brutal rounded-2xl bg-[#00A170] px-4 py-2 text-xs text-white hover:bg-[#008f63]"
          >
            {t("login")}
          </Link>
        </div>
      </nav>
    </header>
  );
}
