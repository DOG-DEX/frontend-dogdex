"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { PixelRadarIcon } from "@/shared/ui/PixelRadarIcon";
import { PixelCameraIcon } from "@/shared/ui/PixelCameraIcon";

/**
 * BentoGrid Component
 * Heartfelt, emotional feature cards for searching lost pets and discovering breed stories.
 * Powered by PixelRadarIcon & PixelCameraIcon in Neo-Brutalist aesthetics.
 */
export function BentoGrid() {
  const t = useTranslations("HomeView");

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* Module 02: Bring Lost Pups Home */}
      <div className="group relative flex flex-col justify-between overflow-hidden rounded-[32px] border-4 border-[#1A1C1B] bg-[#FCE3D9] p-6 shadow-[6px_6px_0px_#1A1C1B] transition-all duration-300 hover:shadow-[10px_10px_0px_#1A1C1B] min-h-[250px] md:p-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-[#1A1C1B] bg-[#C8232C] text-white shadow-[2px_2px_0px_#1A1C1B]">
              <PixelRadarIcon className="h-6 w-6 text-white" />
            </div>

            <span className="badge-module bg-[#C8232C] text-white">
              {t("module02Tag")}
            </span>
          </div>

          <h3 className="text-xl font-extrabold text-[#1A1C1B] md:text-2xl">
            {t("module02Title")}
          </h3>

          <p className="max-w-sm text-xs font-medium text-[#1A1C1B]/85 md:text-sm leading-relaxed">
            {t("module02Sub")}
          </p>
        </div>

        <div className="mt-6">
          <Link
            href="/dex"
            className="btn-brutal rounded-full bg-[#C8232C] px-5 py-2.5 text-xs text-white hover:bg-[#a81c24]"
          >
            {t("module02Cta")}
          </Link>
        </div>
      </div>

      {/* Module 03: Discover Every Pup's Story */}
      <div className="group relative flex flex-col justify-between overflow-hidden rounded-[32px] border-4 border-[#1A1C1B] bg-[#FDE4CE] p-6 shadow-[6px_6px_0px_#1A1C1B] transition-all duration-300 hover:shadow-[10px_10px_0px_#1A1C1B] min-h-[250px] md:p-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-[#1A1C1B] bg-white text-[#1A1C1B] shadow-[2px_2px_0px_#1A1C1B]">
              <PixelCameraIcon className="h-6 w-6 text-[#1A1C1B]" />
            </div>

            <span className="badge-module bg-[#FF6B00] text-white">
              {t("module03Tag")}
            </span>
          </div>

          <h3 className="text-xl font-extrabold text-[#1A1C1B] md:text-2xl">
            {t("module03Title")}
          </h3>

          <p className="max-w-sm text-xs font-medium text-[#1A1C1B]/85 md:text-sm leading-relaxed">
            {t("module03Sub")}
          </p>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <Link
            href="/scan"
            className="btn-brutal rounded-full bg-[#1A1C1B] px-5 py-2.5 text-xs text-white hover:bg-black"
          >
            {t("module03Cta")}
          </Link>
        </div>
      </div>
    </div>
  );
}
