"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

/**
 * ProductStage Component
 * High-impact centerpiece hero stage dedicated to showcasing the Smart QR Collar Tag.
 * Implements 3D physics hover response, floating spec callouts, and high-contrast typography.
 * Strictly complies with the ZERO ICON rule.
 */
export function ProductStage() {
  const t = useTranslations("HomeView");

  return (
    <section className="group relative overflow-hidden rounded-[40px] border-4 border-[#1A1C1B] bg-gradient-to-br from-[#85E0C0] via-[#A8E8D0] to-[#6CD4AD] p-8 shadow-[12px_12px_0px_#1A1C1B] transition-all duration-300 md:p-14">
      {/* Background Lighting Radial Halo */}
      <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-white/30 blur-3xl" />

      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
        {/* Left Side: Headline, Specs & CTA */}
        <div className="relative z-10 flex flex-col items-start gap-8 lg:col-span-6">
          <div className="inline-flex rounded-full border-2 border-[#1A1C1B] bg-white px-4 py-1.5 font-mono text-xs font-black uppercase text-[#1A1C1B] shadow-[2px_2px_0px_#1A1C1B]">
            {t("hardwareBadge")}
          </div>

          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-black tracking-tight text-[#1A1C1B] md:text-6xl lg:text-7xl leading-[1.02] whitespace-pre-line">
              {t("module01Title")}
            </h1>

            <p className="text-lg font-bold text-[#1A1C1B]/85 md:text-xl max-w-md">
              {t("module01Sub")}
            </p>
          </div>

          {/* Tactical Feature Bullets */}
          <div className="flex flex-wrap gap-2">
            <span className="rounded-xl border-2 border-[#1A1C1B] bg-white px-3.5 py-1.5 text-xs font-extrabold uppercase text-[#1A1C1B] shadow-[2px_2px_0px_#1A1C1B]">
              {t("specMaterial")}
            </span>
            <span className="rounded-xl border-2 border-[#1A1C1B] bg-[#FFD6A5] px-3.5 py-1.5 text-xs font-extrabold uppercase text-[#1A1C1B] shadow-[2px_2px_0px_#1A1C1B]">
              {t("specWaterproof")}
            </span>
          </div>

          <div className="pt-2">
            <Link
              href="/scan"
              className="btn-brutal rounded-full bg-[#1A1C1B] px-8 py-4 text-sm text-[#FAF9F7] hover:bg-black md:text-base"
            >
              {t("module01Cta")}
            </Link>
          </div>
        </div>

        {/* Right Side: Centerpiece Product Stage with Floating Callout Badges */}
        <div className="relative z-10 flex items-center justify-center lg:col-span-6">
          <div className="relative flex h-[380px] w-full max-w-[420px] items-center justify-center md:h-[440px]">
            {/* Stage Backdrop Ring */}
            <div className="absolute inset-4 rounded-[40px] border-2 border-dashed border-[#1A1C1B]/40 bg-white/20" />

            {/* Main Product Showcase Box */}
            <div className="relative h-[320px] w-[320px] rotate-3 overflow-hidden rounded-[36px] border-4 border-[#1A1C1B] bg-white shadow-[10px_10px_0px_#1A1C1B] transition-transform duration-500 group-hover:rotate-0 group-hover:scale-105 md:h-[360px] md:w-[360px]">
              <Image
                src="/images/smart-qr-tag.png"
                alt="Dog Dex Smart QR Collar Tag Hardware Showcase"
                fill
                className="object-cover object-center"
                priority
              />
            </div>

            {/* Floating Product Callout Badges */}
            {/* Callout 1: Top Right */}
            <div className="absolute -right-2 top-4 z-20 rounded-full border-2 border-[#1A1C1B] bg-white px-3.5 py-1.5 font-mono text-[10px] font-black uppercase text-[#1A1C1B] shadow-[3px_3px_0px_#1A1C1B]">
              {t("specMaterial")}
            </div>

            {/* Callout 2: Bottom Left */}
            <div className="absolute -left-2 bottom-6 z-20 rounded-full border-2 border-[#1A1C1B] bg-[#FF6B00] px-3.5 py-1.5 font-mono text-[10px] font-black uppercase text-white shadow-[3px_3px_0px_#1A1C1B]">
              {t("specScan")}
            </div>

            {/* Callout 3: Bottom Right */}
            <div className="absolute -right-4 bottom-2 z-20 rounded-full border-2 border-[#1A1C1B] bg-[#00A170] px-3.5 py-1.5 font-mono text-[10px] font-black uppercase text-white shadow-[3px_3px_0px_#1A1C1B]">
              {t("specWaterproof")}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
