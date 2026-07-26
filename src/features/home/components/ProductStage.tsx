"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ZoomableImage } from "@/shared/ui/ZoomableImage";

/**
 * ProductStage Component
 * Centerpiece Hero Stage for Smart QR Collar Tag calibrated for 100% viewport zoom.
 * Features clean hero layout with full-screen ZoomableImage inspection modal.
 */
export function ProductStage() {
  const t = useTranslations("HomeView");

  return (
    <section className="group relative overflow-hidden rounded-[24px] border-4 border-[#1A1C1B] bg-gradient-to-br from-[#85E0C0] via-[#A8E8D0] to-[#6CD4AD] p-5 shadow-[6px_6px_0px_#1A1C1B] transition-all duration-300 sm:rounded-[36px] sm:shadow-[10px_10px_0px_#1A1C1B] md:p-10">
      {/* Background Radial Lighting Halo */}
      <div className="absolute -right-24 -top-24 h-[400px] w-[400px] rounded-full bg-white/35 blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
        {/* Left Side: Headline, Specs & CTA */}
        <div className="relative z-10 flex flex-col items-start gap-6 lg:col-span-6">
          <div className="inline-flex rounded-full border-2 border-[#1A1C1B] bg-white px-3.5 py-1 font-mono text-[11px] font-black uppercase text-[#1A1C1B] shadow-[2px_2px_0px_#1A1C1B]">
            {t("hardwareBadge")}
          </div>

          <div className="flex flex-col gap-3">
            <h1 className="text-3xl font-black tracking-tight text-[#1A1C1B] md:text-4xl lg:text-5xl leading-[1.05] whitespace-pre-line">
              {t("module01Title")}
            </h1>

            <p className="text-sm font-bold text-[#1A1C1B]/85 md:text-base max-w-sm">
              {t("module01Sub")}
            </p>
          </div>

          {/* Tactical Feature Badges */}
          <div className="flex flex-wrap gap-2">
            <span className="rounded-xl border-2 border-[#1A1C1B] bg-white px-3 py-1 text-[11px] font-extrabold uppercase text-[#1A1C1B] shadow-[2px_2px_0px_#1A1C1B]">
              {t("specMaterial")}
            </span>
            <span className="rounded-xl border-2 border-[#1A1C1B] bg-[#FFD6A5] px-3 py-1 text-[11px] font-extrabold uppercase text-[#1A1C1B] shadow-[2px_2px_0px_#1A1C1B]">
              {t("specWaterproof")}
            </span>
          </div>

          <div className="pt-1">
            {/* CTA Button matching Navbar Sign In button color (#00A170) */}
            <Link
              href="/scan"
              className="btn-brutal rounded-full bg-[#00A170] px-6 py-3 text-xs font-extrabold text-white hover:bg-[#008f63] shadow-[3px_3px_0px_#1A1C1B] md:text-sm"
            >
              {t("module01Cta")}
            </Link>
          </div>
        </div>

        {/* Right Side: Product Showcase Stage with Zoomable Image */}
        <div className="relative z-10 flex items-center justify-center lg:col-span-6">
          <div className="relative flex h-[260px] w-full max-w-[300px] items-center justify-center sm:h-[320px] sm:max-w-[360px] md:h-[360px]">
            {/* Stage Outer Ring */}
            <div className="absolute inset-2 rounded-[36px] border-2 border-dashed border-[#1A1C1B]/35 bg-white/15" />

            {/* PRODUCT SHOWCASE BOX WITH ZOOMABLE IMAGE */}
            <div className="relative h-[220px] w-[220px] rotate-2 overflow-hidden rounded-[24px] border-4 border-[#1A1C1B] bg-white shadow-[6px_6px_0px_#1A1C1B] transition-transform duration-500 group-hover:rotate-0 group-hover:scale-105 sm:h-[270px] sm:w-[270px] sm:rounded-[32px] sm:shadow-[10px_10px_0px_#1A1C1B] md:h-[320px] md:w-[320px]">
              <ZoomableImage
                src="/images/smart-qr-tag.png"
                alt="Dog Dex Smart QR Collar Tag Hardware Showcase"
                priority
              />
            </div>

            {/* Floating Spec Ribbon Badges */}
            <div className="absolute -right-2 top-2 z-20 hidden rounded-full border-2 border-[#1A1C1B] bg-white px-3 py-1 font-mono text-[10px] font-black uppercase text-[#1A1C1B] shadow-[2px_2px_0px_#1A1C1B] sm:block">
              {t("specMaterial")}
            </div>

            <div className="absolute -left-2 bottom-6 z-20 hidden rounded-full border-2 border-[#1A1C1B] bg-[#FF6B00] px-3 py-1 font-mono text-[10px] font-black uppercase text-white shadow-[2px_2px_0px_#1A1C1B] sm:block">
              {t("specScan")}
            </div>

            <div className="absolute -right-2 bottom-2 z-20 hidden rounded-full border-2 border-[#1A1C1B] bg-[#00A170] px-3 py-1 font-mono text-[10px] font-black uppercase text-white shadow-[2px_2px_0px_#1A1C1B] sm:block">
              {t("specWaterproof")}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
