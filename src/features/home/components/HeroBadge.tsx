"use client";

import { useTranslations } from "next-intl";

/**
 * HeroBadge Component
 * Displays live reconnected counter badge with Neo-Brutalist styling.
 * Strictly adheres to project rule: ZERO ICONS.
 */
export function HeroBadge() {
  const t = useTranslations("HomeView");

  return (
    <div className="flex w-full justify-center">
      <div className="flex items-center gap-3 rounded-full border-4 border-[#232B26] bg-[#FF6B00] px-6 py-3 shadow-brutal-sm">
        {/* Text pill badge replacing icon */}
        <span className="rounded-md border-2 border-[#232B26] bg-[#232B26] px-2 py-0.5 text-xs font-black uppercase text-white tracking-widest">
          LIVE
        </span>
        <span className="font-sans text-sm font-extrabold uppercase tracking-wider text-white md:text-base">
          {t("liveBadge")}
        </span>
      </div>
    </div>
  );
}
