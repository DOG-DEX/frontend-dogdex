"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

/**
 * BentoGrid Component
 * Secondary feature cards for Module 02 (Lost Dog Radar) & Module 03 (AI Breed Scanner).
 * Styled in high-contrast Neo-Brutalist aesthetics.
 * Zero icons rule enforced.
 */
export function BentoGrid() {
  const t = useTranslations("HomeView");

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* Module 02: Lost Dog Radar */}
      <div className="group relative flex flex-col justify-between overflow-hidden rounded-[36px] border-4 border-[#1A1C1B] bg-[#FCE3D9] p-8 shadow-[8px_8px_0px_#1A1C1B] transition-all duration-300 hover:shadow-[12px_12px_0px_#1A1C1B] min-h-[260px]">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#1A1C1B] bg-[#C8232C] font-mono text-xs font-black text-white shadow-[2px_2px_0px_#1A1C1B]">
              R
            </span>
            <span className="badge-module bg-[#C8232C] text-white">
              {t("module02Tag")}
            </span>
          </div>

          <h3 className="text-2xl font-extrabold text-[#1A1C1B] md:text-3xl">
            {t("module02Title")}
          </h3>

          <p className="max-w-sm text-sm font-medium text-[#1A1C1B]/80 md:text-base">
            {t("module02Sub")}
          </p>
        </div>

        <div className="mt-8">
          <Link
            href="/dex"
            className="btn-brutal rounded-full bg-[#C8232C] px-6 py-3 text-xs text-white hover:bg-[#a81c24] md:text-sm"
          >
            {t("module02Cta")}
          </Link>
        </div>
      </div>

      {/* Module 03: AI Breed Scanner */}
      <div className="group relative flex flex-col justify-between overflow-hidden rounded-[36px] border-4 border-[#1A1C1B] bg-[#FDE4CE] p-8 shadow-[8px_8px_0px_#1A1C1B] transition-all duration-300 hover:shadow-[12px_12px_0px_#1A1C1B] min-h-[260px]">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#1A1C1B] bg-white font-mono text-xs font-black text-[#1A1C1B] shadow-[2px_2px_0px_#1A1C1B]">
              AI
            </div>
            <span className="badge-module bg-[#FF6B00] text-white">
              {t("module03Tag")}
            </span>
          </div>

          <h3 className="text-2xl font-extrabold text-[#1A1C1B] md:text-3xl">
            {t("module03Title")}
          </h3>

          <p className="max-w-sm text-sm font-medium text-[#1A1C1B]/80 md:text-base">
            {t("module03Sub")}
          </p>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <Link
            href="/scan"
            className="btn-brutal rounded-full bg-[#1A1C1B] px-6 py-3 text-xs text-white hover:bg-black md:text-sm"
          >
            SCAN NOW &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
