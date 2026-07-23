"use client";

import { useTranslations } from "next-intl";

/**
 * HowItWorks Component
 * Demonstrates the 3-step lost dog prevention workflow.
 * Uses bold Neo-Brutalist numerical indicators (01, 02, 03) and calibrated typography.
 */
export function HowItWorks() {
  const t = useTranslations("HomeView");

  const steps = [
    {
      stepNumber: "01",
      bgColor: "bg-[#FF6B00]",
      title: t("step1Title"),
      desc: t("step1Sub"),
    },
    {
      stepNumber: "02",
      bgColor: "bg-[#00A170]",
      title: t("step2Title"),
      desc: t("step2Sub"),
    },
    {
      stepNumber: "03",
      bgColor: "bg-[#FF3B30]",
      title: t("step3Title"),
      desc: t("step3Sub"),
    },
  ];

  return (
    <section className="flex flex-col gap-10 py-8">
      {/* Section Title (Calibrated to text-2xl md:text-4xl) */}
      <div className="text-center">
        <h2 className="text-2xl font-black uppercase tracking-wider text-[#1A1C1B] md:text-4xl">
          {t("howItWorksTitle")}
        </h2>
      </div>

      {/* 3 Step Process Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {steps.map((step) => (
          <div
            key={step.stepNumber}
            className="card-brutal flex flex-col items-center gap-4 bg-white p-6 text-center md:p-8"
          >
            {/* Step Number Badge */}
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-[#1A1C1B] ${step.bgColor} shadow-brutal-sm`}
            >
              <span className="font-mono text-xl font-black text-white">
                {step.stepNumber}
              </span>
            </div>

            {/* Step Content */}
            <h3 className="text-xl font-extrabold text-[#1A1C1B]">
              {step.title}
            </h3>

            <p className="text-sm font-medium text-[#1A1C1B]/80">
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
