"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";

// Static navigation configuration outside component scope to prevent reference churn
const NAV_CONFIG = [
  { href: "/", key: "home" },
  { href: "/dex", key: "dex" },
  { href: "/scan", key: "scan" },
  { href: "/profile", key: "profile" },
];

/**
 * SiteNav Component — Neo-Brutalist Morphic Navigation Bar
 *
 * Fixed Infinite Loop & Maximum Update Depth:
 * - Extracted `NAV_CONFIG` outside component scope.
 * - Added functional state guard in `setPillStyle` to prevent redundant re-renders.
 */
export function SiteNav() {
  const t = useTranslations("SiteNav");
  const pathname = usePathname() || "/";

  // State to track physical position and width of the active tab pill
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);
  const tabsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  /**
   * Helper to check if a navigation route is active.
   */
  const isActiveRoute = (targetHref: string) => {
    if (targetHref === "/") return pathname === "/";
    return pathname.startsWith(targetHref);
  };

  // Function to recalibrate pill position using relative bounding rects
  const updatePillPosition = useCallback(() => {
    const activeIndex = NAV_CONFIG.findIndex((item) => isActiveRoute(item.href));
    if (
      activeIndex !== -1 &&
      tabsRef.current[activeIndex] &&
      containerRef.current
    ) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const activeRect = tabsRef.current[activeIndex]!.getBoundingClientRect();

      if (activeRect.width > 0 && containerRect.width > 0) {
        const newLeft = activeRect.left - containerRect.left;
        const newWidth = activeRect.width;

        // State guard: Only trigger React state update if measurements have actually changed
        setPillStyle((prev) => {
          if (
            Math.abs(prev.left - newLeft) < 0.5 &&
            Math.abs(prev.width - newWidth) < 0.5 &&
            prev.opacity === 1
          ) {
            return prev; // Return unchanged state to break re-render loop
          }
          return { left: newLeft, width: newWidth, opacity: 1 };
        });
      }
    }
  }, [pathname]);

  // Recalibrate on pathname changes, font loads, dynamic DOM resize & window resize
  useEffect(() => {
    updatePillPosition();

    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(updatePillPosition);
    }

    let resizeObserver: ResizeObserver | null = null;
    if (typeof window !== "undefined" && "ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(() => {
        updatePillPosition();
      });

      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }

      tabsRef.current.forEach((tab) => {
        if (tab) resizeObserver?.observe(tab);
      });
    }

    window.addEventListener("resize", updatePillPosition);
    return () => {
      window.removeEventListener("resize", updatePillPosition);
      resizeObserver?.disconnect();
    };
  }, [updatePillPosition]);

  return (
    <header className="sticky top-0 z-50 w-full border-b-4 border-[#1A1C1B] bg-white px-6 py-3.5 shadow-brutal-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 text-xl font-black tracking-tight text-[#00A170]"
        >
          <Image
            src="/logos/logo-ic-black.png"
            alt="DogDex Logo"
            width={36}
            height={36}
            className="h-9 w-auto object-contain"
            priority
          />
          <span className="text-xl font-black tracking-tight text-[#1A1C1B] sm:text-2xl">
            DogDex
          </span>
        </Link>

        {/* Real Morphic Sliding Active Pill Container */}
        <div
          ref={containerRef}
          className="relative flex items-center rounded-full border-2 border-[#1A1C1B] bg-[#F0EDE6] p-1.5 shadow-[2px_2px_0px_#1A1C1B]"
        >
          {/* Physical Sliding Green Pill Background */}
          <span
            className="pointer-events-none absolute top-1.5 bottom-1.5 rounded-full border-2 border-[#1A1C1B] bg-[#00A170] shadow-[2px_2px_0px_#1A1C1B] transition-all duration-300 ease-out"
            style={{
              left: `${pillStyle.left}px`,
              width: `${pillStyle.width}px`,
              opacity: pillStyle.opacity,
            }}
          />

          <ul className="relative z-10 flex items-center gap-1.5 text-xs font-black uppercase">
            {NAV_CONFIG.map((item, index) => {
              const active = isActiveRoute(item.href);
              return (
                <li key={item.href} className="flex items-center justify-center">
                  <Link
                    ref={(el) => {
                      tabsRef.current[index] = el;
                    }}
                    href={item.href}
                    className={`inline-flex items-center justify-center text-center rounded-full px-4 py-1.5 transition-colors duration-200 ${
                      active
                        ? "font-black text-white"
                        : "text-[#1A1C1B] hover:text-[#00A170]"
                    }`}
                  >
                    {t(item.key)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Action Button — Original Restored Sign-in Button Only */}
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
