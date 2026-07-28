"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

type PolicyTab = "privacy" | "terms" | "refund" | "shipping";

export function PoliciesView() {
  const t = useTranslations("Policies");
  const [activeTab, setActiveTab] = useState<PolicyTab>("privacy");

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  // Accordion open states
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    "privacy-1": true,
    "privacy-2": false,
    "privacy-3": false,
    "terms-1": false,
    "terms-2": false,
    "refund-1": false,
    "refund-2": false,
    "shipping-1": false,
    "shipping-2": false,
  });

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section className="min-h-screen bg-[#F0EDE6] px-4 py-8 md:px-10 md:py-14 text-[#232B26]">
      <div className="mx-auto max-w-4xl">
        {/* Header Hero Card */}
        <header className="mb-8 rounded-3xl border-2 border-[#232B26]/15 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="inline-block rounded-full bg-[#00A170]/10 px-3.5 py-1 font-mono text-xs font-bold text-[#00A170]">
                {t("tag")}
              </span>
              <h1 className="mt-2 text-3xl font-black text-[#232B26] md:text-4xl tracking-tight">
                {t("title")}
              </h1>
              <p className="mt-2 text-sm font-medium text-[#4B5750]">
                {t("subtitle")}
              </p>
            </div>

            <button
              type="button"
              onClick={handlePrint}
              className="self-start rounded-xl border border-[#232B26]/20 bg-[#F0EDE6] px-4 py-2.5 font-mono text-xs font-bold text-[#232B26] transition hover:bg-[#232B26] hover:text-white"
            >
              {t("print")}
            </button>
          </div>
        </header>

        {/* Tab Selection */}
        <nav aria-label="Policy Tabs" className="mb-6 flex flex-wrap gap-2">
          {[
            { id: "privacy", label: t("tabPrivacy") },
            { id: "terms", label: t("tabTerms") },
            { id: "refund", label: t("tabRefund") },
            { id: "shipping", label: t("tabShipping") },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as PolicyTab)}
              className={`rounded-xl px-4 py-2.5 font-mono text-xs font-black uppercase transition-all ${
                activeTab === tab.id
                  ? "bg-[#232B26] text-white shadow-sm"
                  : "border border-[#232B26]/15 bg-white text-[#232B26] hover:bg-[#F0EDE6]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Accordion List Container */}
        <main className="space-y-4">
          {/* TAB 1: PRIVACY POLICY */}
          {activeTab === "privacy" && (
            <div className="space-y-4">
              <AccordionItem
                id="privacy-1"
                title={t("p11Title")}
                badge={t("p11Badge")}
                isOpen={openSections["privacy-1"]}
                onToggle={() => toggleSection("privacy-1")}
              >
                <p className="text-sm font-medium text-[#232B26]/90 leading-relaxed">
                  {t("p11Content")}
                </p>
              </AccordionItem>

              <AccordionItem
                id="privacy-2"
                title={t("p12Title")}
                badge={t("p12Badge")}
                isOpen={openSections["privacy-2"]}
                onToggle={() => toggleSection("privacy-2")}
              >
                <div className="space-y-3 text-sm font-medium text-[#232B26]/90 leading-relaxed">
                  <p>{t("p12Intro")}</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>{t("p12Bullet1")}</li>
                    <li>{t("p12Bullet2")}</li>
                    <li>{t("p12Bullet3")}</li>
                  </ul>
                  <div className="mt-3 rounded-xl bg-[#00A170]/10 p-3.5 text-xs font-bold text-[#00A170]">
                    {t("p12Unsub")}
                  </div>
                </div>
              </AccordionItem>

              <AccordionItem
                id="privacy-3"
                title={t("p13Title")}
                badge={t("p13Badge")}
                isOpen={openSections["privacy-3"]}
                onToggle={() => toggleSection("privacy-3")}
              >
                <p className="text-sm font-medium text-[#232B26]/90 leading-relaxed">
                  {t("p13Content")}
                </p>
              </AccordionItem>
            </div>
          )}

          {/* TAB 2: TERMS OF USE */}
          {activeTab === "terms" && (
            <div className="space-y-4">
              <AccordionItem
                id="terms-1"
                title={t("t21Title")}
                badge={t("t21Badge")}
                isOpen={openSections["terms-1"]}
                onToggle={() => toggleSection("terms-1")}
              >
                <p className="text-sm font-medium text-[#232B26]/90 leading-relaxed">
                  {t("t21Content")}
                </p>
              </AccordionItem>

              <AccordionItem
                id="terms-2"
                title={t("t22Title")}
                badge={t("t22Badge")}
                isOpen={openSections["terms-2"]}
                onToggle={() => toggleSection("terms-2")}
              >
                <div className="space-y-3 text-sm font-medium text-[#232B26]/90 leading-relaxed">
                  <p>{t("t22Intro")}</p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 pt-2">
                    <div className="rounded-xl border border-[#232B26]/15 bg-[#F0EDE6]/50 p-4">
                      <div className="font-mono text-xs font-bold text-[#FF6B00]">COD</div>
                      <div className="font-bold text-sm mt-0.5">{t("t22CodTitle")}</div>
                      <p className="text-xs text-[#4B5750] mt-1">{t("t22CodDesc")}</p>
                    </div>
                    <div className="rounded-xl border border-[#232B26]/15 bg-[#F0EDE6]/50 p-4">
                      <div className="font-mono text-xs font-bold text-[#00A170]">BANKING</div>
                      <div className="font-bold text-sm mt-0.5">{t("t22BankTitle")}</div>
                      <p className="text-xs text-[#4B5750] mt-1">{t("t22BankDesc")}</p>
                    </div>
                  </div>
                </div>
              </AccordionItem>
            </div>
          )}

          {/* TAB 3: RETURN & REFUND POLICY */}
          {activeTab === "refund" && (
            <div className="space-y-4">
              <AccordionItem
                id="refund-1"
                title={t("r31Title")}
                badge={t("r31Badge")}
                isOpen={openSections["refund-1"]}
                onToggle={() => toggleSection("refund-1")}
              >
                <div className="space-y-2 text-sm font-medium text-[#232B26]/90 leading-relaxed">
                  <p>{t("r31Intro")}</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>{t("r31Bullet1")}</li>
                    <li>{t("r31Bullet2")}</li>
                  </ul>
                </div>
              </AccordionItem>

              <AccordionItem
                id="refund-2"
                title={t("r32Title")}
                badge={t("r32Badge")}
                isOpen={openSections["refund-2"]}
                onToggle={() => toggleSection("refund-2")}
              >
                <ul className="list-disc pl-5 space-y-1.5 text-sm font-medium text-[#232B26]">
                  <li>{t("r32Bullet1")}</li>
                  <li>{t("r32Bullet2")}</li>
                  <li>{t("r32Bullet3")}</li>
                </ul>
              </AccordionItem>
            </div>
          )}

          {/* TAB 4: SHIPPING POLICY */}
          {activeTab === "shipping" && (
            <div className="space-y-4">
              <AccordionItem
                id="shipping-1"
                title={t("s41Title")}
                badge={t("s41Badge")}
                isOpen={openSections["shipping-1"]}
                onToggle={() => toggleSection("shipping-1")}
              >
                <p className="text-sm font-medium text-[#232B26]/90 leading-relaxed">
                  {t("s41Content")}
                </p>
              </AccordionItem>

              <AccordionItem
                id="shipping-2"
                title={t("s42Title")}
                badge={t("s42Badge")}
                isOpen={openSections["shipping-2"]}
                onToggle={() => toggleSection("shipping-2")}
              >
                <div className="space-y-3 text-sm font-medium text-[#232B26]/90 leading-relaxed">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-[#232B26]/15 bg-[#F0EDE6]/50 p-4">
                      <span className="font-mono text-xs font-bold text-[#00A170]">{t("s42Urban")}</span>
                      <p className="font-bold text-sm mt-0.5">{t("s42UrbanTime")}</p>
                    </div>
                    <div className="rounded-xl border border-[#232B26]/15 bg-[#F0EDE6]/50 p-4">
                      <span className="font-mono text-xs font-bold text-[#FF6B00]">{t("s42Province")}</span>
                      <p className="font-bold text-sm mt-0.5">{t("s42ProvinceTime")}</p>
                    </div>
                  </div>
                </div>
              </AccordionItem>
            </div>
          )}

          {/* Direct Navigation Links */}
          <div className="mt-8 border-t border-[#232B26]/10 pt-6">
            <p className="font-mono text-xs font-bold uppercase text-[#4B5750] mb-3">
              {t("directLinks")}
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/policies/privacy"
                className="rounded-xl border border-[#232B26]/15 bg-white px-3.5 py-2 text-xs font-bold text-[#232B26] hover:bg-[#232B26] hover:text-white transition"
              >
                {t("tabPrivacy")}
              </Link>
              <Link
                href="/policies/terms"
                className="rounded-xl border border-[#232B26]/15 bg-white px-3.5 py-2 text-xs font-bold text-[#232B26] hover:bg-[#232B26] hover:text-white transition"
              >
                {t("tabTerms")}
              </Link>
              <Link
                href="/policies/refund"
                className="rounded-xl border border-[#232B26]/15 bg-white px-3.5 py-2 text-xs font-bold text-[#232B26] hover:bg-[#232B26] hover:text-white transition"
              >
                {t("tabRefund")}
              </Link>
              <Link
                href="/policies/shipping"
                className="rounded-xl border border-[#232B26]/15 bg-white px-3.5 py-2 text-xs font-bold text-[#232B26] hover:bg-[#232B26] hover:text-white transition"
              >
                {t("tabShipping")}
              </Link>
            </div>
          </div>
        </main>
      </div>
    </section>
  );
}

/**
 * Reusable Accordion Item Component with Smooth Slide-down Transition
 */
function AccordionItem({
  title,
  badge,
  isOpen,
  onToggle,
  children,
}: {
  id: string;
  title: string;
  badge: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#232B26]/15 bg-white shadow-sm transition-all duration-300">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-[#F0EDE6]/40"
      >
        <div className="flex items-center gap-3">
          <span className="rounded-lg bg-[#232B26]/5 px-2.5 py-1 font-mono text-[10px] font-black uppercase text-[#232B26]">
            {badge}
          </span>
          <h3 className="text-base font-extrabold text-[#232B26] md:text-lg">
            {title}
          </h3>
        </div>
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-full border border-[#232B26]/15 bg-[#F0EDE6] font-mono text-sm font-bold text-[#232B26] transition-transform duration-300 ${
            isOpen ? "rotate-180 bg-[#232B26] text-white" : ""
          }`}
        >
          ↓
        </span>
      </button>

      <div
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[800px] opacity-100 p-5 pt-0 border-t border-[#232B26]/10" : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
