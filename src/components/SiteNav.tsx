"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { authService } from "@/features/auth/services/auth.service";
import { AuthUser } from "@/features/auth/types/auth.types";
import { useToast } from "@/components/ToastContext";

// Static navigation configuration outside component scope to prevent reference churn
const NAV_CONFIG = [
  { href: "/", key: "home" },
  { href: "/dex", key: "dex" },
  { href: "/scan", key: "scan" },
  { href: "/profile", key: "profile" },
] as const;

/**
 * SiteNav Component — Neo-Brutalist Morphic Navigation Bar
 *
 * Desktop (>=768px):
 *   - Animated sliding pill tab bar for route navigation
 *   - QR Scanner button + Profile badge dropdown (when authenticated)
 *   - Sign In button (when guest)
 *
 * Mobile (<768px):
 *   - Hamburger button that toggles a full-screen slide-in drawer from the right
 *   - Drawer contains: user profile card, nav links, scan QR, logout/sign-in
 *   - Semi-transparent backdrop overlay with click-to-close
 */
export function SiteNav() {
  const t = useTranslations("SiteNav");
  const pathname = usePathname() || "/";
  const router = useRouter();
  const { toast } = useToast();

  // ── Auth State ──
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  // ── Desktop: Profile dropdown ──
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // ── Mobile: Slide drawer ──
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // ── Desktop: Active pill position ──
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);
  const tabsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  // ── Auth sync via custom event (no polling needed) ──
  useEffect(() => {
    const syncUser = () => {
      setCurrentUser(authService.getCurrentUser());
    };
    syncUser();

    window.addEventListener("storage", syncUser);
    window.addEventListener("auth-change", syncUser);

    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("auth-change", syncUser);
    };
  }, [pathname]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  // Close drawer on route change
  useEffect(() => {
    setIsDrawerOpen(false);
  }, [pathname]);

  /**
   * Helper to check if a navigation route is currently active.
   */
  const isActiveRoute = (targetHref: string) => {
    if (targetHref === "/") return pathname === "/";
    return pathname.startsWith(targetHref);
  };

  // ── Desktop pill position recalculation ──
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

        setPillStyle((prev) => {
          if (
            Math.abs(prev.left - newLeft) < 0.5 &&
            Math.abs(prev.width - newWidth) < 0.5 &&
            prev.opacity === 1
          ) {
            return prev;
          }
          return { left: newLeft, width: newWidth, opacity: 1 };
        });
      }
    }
  }, [pathname]);

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

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setIsDropdownOpen(false);
    setIsDrawerOpen(false);
    toast.info("LOGGED OUT", "You have been signed out.", { duration: 3000 });
    router.push("/login");
  };

  // First letter of username for the initial avatar circle
  const userInitial = (currentUser?.username || currentUser?.email || "U")
    .charAt(0)
    .toUpperCase();

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b-4 border-[#1A1C1B] bg-white px-4 py-3 shadow-brutal-sm md:px-6 md:py-3.5">
        <nav className="mx-auto flex max-w-6xl items-center justify-between">
          {/* ── Brand Logo ── */}
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-black tracking-tight text-[#00A170]"
          >
            <Image
              src="/logos/logo-ic-black.png"
              alt="DogDex Logo"
              width={36}
              height={36}
              className="h-8 w-auto object-contain md:h-9"
              priority
            />
            <span className="text-lg font-black tracking-tight text-[#1A1C1B] md:text-2xl">
              DogDex
            </span>
          </Link>

          {/* ── Desktop: Morphic Sliding Active Pill Container ── */}
          <div
            ref={containerRef}
            className="relative hidden items-center rounded-full border-2 border-[#1A1C1B] bg-[#F0EDE6] p-1.5 shadow-[2px_2px_0px_#1A1C1B] md:flex"
          >
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

          {/* ── Desktop: Right Action Controls ── */}
          <div className="hidden items-center gap-2.5 md:flex">
            {currentUser ? (
              <>
                {/* QR Scanner Action Button */}
                <Link
                  href="/scan"
                  title="Scan QR"
                  className="flex items-center gap-1.5 rounded-xl border-2 border-[#1A1C1B] bg-[#85E0C0] px-3 py-1.5 font-mono text-xs font-black text-[#1A1C1B] shadow-[2.5px_2.5px_0px_#1A1C1B] transition-all hover:bg-[#68D4AD] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#1A1C1B]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M4 8V6a2 2 0 0 1 2-2h2" />
                    <path d="M16 4h2a2 2 0 0 1 2 2v2" />
                    <path d="M4 16v2a2 2 0 0 0 2 2h2" />
                    <path d="M16 20h2a2 2 0 0 0 2-2v-2" />
                    <rect x="7" y="7" width="3" height="3" fill="currentColor" stroke="none" />
                    <rect x="14" y="7" width="3" height="3" fill="currentColor" stroke="none" />
                    <rect x="7" y="14" width="3" height="3" fill="currentColor" stroke="none" />
                    <path d="M14 14h1.5v1.5H14zM16.5 16.5h1.5v1.5h-1.5zM14 16.5h1.5v1.5H14zM16.5 14h1.5v1.5h-1.5z" fill="currentColor" stroke="none" />
                  </svg>
                  <span className="tracking-wider uppercase">
                    {t("scanQr")}
                  </span>
                </Link>

                {/* User Profile Badge with Retro Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                    className="flex items-center gap-2 rounded-full border-2 border-[#1A1C1B] bg-white py-1 pl-1 pr-3 shadow-[2.5px_2.5px_0px_#1A1C1B] transition-all hover:bg-[#F0EDE6] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#1A1C1B]"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#1A1C1B] bg-[#A04000] font-mono text-xs font-black text-white shadow-[1px_1px_0px_#1A1C1B]">
                      {userInitial}
                    </div>
                    <span className="max-w-[100px] truncate font-mono text-xs font-black text-[#1A1C1B] lg:max-w-[130px]">
                      {currentUser.username || "User"}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`text-[#1A1C1B] transition-transform duration-200 ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl border-4 border-[#1A1C1B] bg-white p-2 shadow-[6px_6px_0px_#1A1C1B] z-50 animate-in fade-in zoom-in-95">
                      {/* Header Summary */}
                      <div className="border-b-2 border-[#1A1C1B] px-3 py-2">
                        <p className="font-mono text-xs font-black text-[#1A1C1B] truncate">
                          {currentUser.username}
                        </p>
                        <p className="font-mono text-[10px] font-semibold text-zinc-500 truncate">
                          {currentUser.email}
                        </p>
                      </div>

                      {/* Menu Items */}
                      <div className="mt-1 flex flex-col gap-1">
                        <Link
                          href="/profile"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-2 rounded-xl border-2 border-transparent px-3 py-2 font-mono text-xs font-extrabold text-[#1A1C1B] hover:border-[#1A1C1B] hover:bg-[#85E0C0]/30"
                        >
                          <span>{t("myProfile")}</span>
                        </Link>

                        <Link
                          href="/dex"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-2 rounded-xl border-2 border-transparent px-3 py-2 font-mono text-xs font-extrabold text-[#1A1C1B] hover:border-[#1A1C1B] hover:bg-[#85E0C0]/30"
                        >
                          <span>{t("myCollection")}</span>
                        </Link>

                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2 rounded-xl border-2 border-[#1A1C1B] bg-[#FF3B30] px-3 py-2 font-mono text-xs font-black text-white shadow-[2px_2px_0px_#1A1C1B] hover:bg-[#E03126] active:translate-x-0.5 active:translate-y-0.5"
                        >
                          <span>{t("logout")}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Sign-in Button when logged out */
              <Link
                href="/login"
                className="btn-brutal rounded-full bg-[#00A170] px-4 py-2 text-xs font-extrabold text-white hover:bg-[#008f63]"
              >
                {t("login")}
              </Link>
            )}
          </div>

          {/* ── Mobile: Hamburger Button ── */}
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center justify-center rounded-xl border-2 border-[#1A1C1B] bg-white p-2 shadow-[2px_2px_0px_#1A1C1B] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#1A1C1B] md:hidden"
            aria-label="Open navigation menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1A1C1B"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </nav>
      </header>

      {/* ══════════════════════════════════════════════════════════════════
          MOBILE SLIDE DRAWER (renders outside header to overlay full page)
          ══════════════════════════════════════════════════════════════════ */}

      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-[#1A1C1B]/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isDrawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <aside
        className={`fixed top-0 right-0 z-[70] flex h-full w-[85vw] max-w-[340px] flex-col border-l-4 border-[#1A1C1B] bg-[#F0EDE6] shadow-[-8px_0px_0px_#1A1C1B] transition-transform duration-300 ease-out md:hidden ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* ── Drawer Header ── */}
        <div className="flex items-center justify-between border-b-4 border-[#1A1C1B] bg-white px-5 py-4">
          <Link
            href="/"
            className="flex items-center gap-2"
            onClick={() => setIsDrawerOpen(false)}
          >
            <Image
              src="/logos/logo-ic-black.png"
              alt="DogDex"
              width={28}
              height={28}
              className="h-7 w-auto object-contain"
            />
            <span className="text-lg font-black tracking-tight text-[#1A1C1B]">
              DogDex
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setIsDrawerOpen(false)}
            className="flex items-center justify-center rounded-xl border-2 border-[#1A1C1B] bg-white p-1.5 shadow-[2px_2px_0px_#1A1C1B] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#1A1C1B]"
            aria-label="Close navigation menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1A1C1B"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* ── User Profile Card (if authenticated) ── */}
        {currentUser && (
          <div className="border-b-4 border-[#1A1C1B] bg-white px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#1A1C1B] bg-[#A04000] font-mono text-base font-black text-white shadow-[2px_2px_0px_#1A1C1B]">
                {userInitial}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-mono text-sm font-black text-[#1A1C1B]">
                  {currentUser.username || "Trainer"}
                </p>
                <p className="truncate font-mono text-[11px] font-semibold text-zinc-500">
                  {currentUser.email}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Navigation Links ── */}
        <nav className="flex-1 overflow-y-auto px-4 py-4">
          <ul className="flex flex-col gap-2">
            {NAV_CONFIG.map((item) => {
              const active = isActiveRoute(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsDrawerOpen(false)}
                    className={`flex items-center gap-3 rounded-2xl border-2 px-4 py-3 font-mono text-sm font-black uppercase tracking-wider transition-all ${
                      active
                        ? "border-[#1A1C1B] bg-[#00A170] text-white shadow-[3px_3px_0px_#1A1C1B]"
                        : "border-transparent bg-white text-[#1A1C1B] hover:border-[#1A1C1B] hover:shadow-[2px_2px_0px_#1A1C1B]"
                    }`}
                  >
                    {/* Route-specific SVG indicator */}
                    <DrawerNavIcon routeKey={item.key} />
                    <span>{t(item.key)}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Scan QR prominent button (if authenticated) */}
          {currentUser && (
            <div className="mt-4">
              <Link
                href="/scan"
                onClick={() => setIsDrawerOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-[#1A1C1B] bg-[#85E0C0] px-4 py-3 font-mono text-sm font-black uppercase tracking-wider text-[#1A1C1B] shadow-[3px_3px_0px_#1A1C1B] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#1A1C1B]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M4 8V6a2 2 0 0 1 2-2h2" />
                  <path d="M16 4h2a2 2 0 0 1 2 2v2" />
                  <path d="M4 16v2a2 2 0 0 0 2 2h2" />
                  <path d="M16 20h2a2 2 0 0 0 2-2v-2" />
                  <rect x="7" y="7" width="3" height="3" fill="currentColor" stroke="none" />
                  <rect x="14" y="7" width="3" height="3" fill="currentColor" stroke="none" />
                  <rect x="7" y="14" width="3" height="3" fill="currentColor" stroke="none" />
                </svg>
                <span>{t("scanQr")}</span>
              </Link>
            </div>
          )}
        </nav>

        {/* ── Drawer Footer: Logout / Sign In ── */}
        <div className="border-t-4 border-[#1A1C1B] bg-white px-5 py-4">
          {currentUser ? (
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-[#1A1C1B] bg-[#FF3B30] px-4 py-3 font-mono text-sm font-black uppercase tracking-wider text-white shadow-[3px_3px_0px_#1A1C1B] transition-all hover:bg-[#E03126] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#1A1C1B]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>{t("logout")}</span>
            </button>
          ) : (
            <Link
              href="/login"
              onClick={() => setIsDrawerOpen(false)}
              className="flex w-full items-center justify-center rounded-2xl border-2 border-[#1A1C1B] bg-[#00A170] px-4 py-3 font-mono text-sm font-black uppercase tracking-wider text-white shadow-[3px_3px_0px_#1A1C1B] transition-all hover:bg-[#008f63] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#1A1C1B]"
            >
              {t("login")}
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}

/**
 * DrawerNavIcon — Renders a small SVG icon per route key for the mobile drawer nav items.
 * Keeps icon logic co-located with SiteNav rather than creating separate icon components.
 */
function DrawerNavIcon({ routeKey }: { routeKey: string }) {
  const iconProps = {
    xmlns: "http://www.w3.org/2000/svg",
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (routeKey) {
    case "home":
      return (
        <svg {...iconProps}>
          <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 0 0 1 1h3m10-11l2 2m-2-2v10a1 1 0 0 1-1 1h-3m-4 0a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-2z" />
        </svg>
      );
    case "dex":
      return (
        <svg {...iconProps}>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      );
    case "scan":
      return (
        <svg {...iconProps}>
          <path d="M4 8V6a2 2 0 0 1 2-2h2" />
          <path d="M16 4h2a2 2 0 0 1 2 2v2" />
          <path d="M4 16v2a2 2 0 0 0 2 2h2" />
          <path d="M16 20h2a2 2 0 0 0 2-2v-2" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      );
    case "profile":
      return (
        <svg {...iconProps}>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
    default:
      return null;
  }
}
