"use client";

import { useTranslations } from "next-intl";

/**
 * SiteFooter Component
 * Neo-Brutalist footer matching DogDexx design theme.
 * Zero icons.
 */
export function SiteFooter() {
  const t = useTranslations("SiteFooter");

  return (
    <footer className="mt-auto border-t-4 border-[#232B26] bg-white px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-center font-bold text-[#232B26] md:flex-row md:text-left">
        <div className="flex items-center gap-2">
          <span className="text-xl font-black text-[#00A170]">DogDexx</span>
          <span className="text-sm font-medium text-[#232B26]/70">&mdash; {t("tagline")}</span>
        </div>
        <p className="text-xs font-extrabold uppercase tracking-wider text-[#232B26]/60">
          {t("copyright")}
        </p>
      </div>
    </footer>
  );
}
