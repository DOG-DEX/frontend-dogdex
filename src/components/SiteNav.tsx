"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export function SiteNav() {
  const t = useTranslations("SiteNav");

  return (
    <header className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
      <nav className="mx-auto flex max-w-5xl items-center justify-between">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Dog Dex
        </Link>
        <ul className="flex items-center gap-6 text-sm">
          <li>
            <Link href="/">{t("home")}</Link>
          </li>
          <li>
            <Link href="/dex">{t("dex")}</Link>
          </li>
          <li>
            <Link href="/scan">{t("scan")}</Link>
          </li>
          <li>
            <Link href="/profile">{t("profile")}</Link>
          </li>
          <li>
            <Link href="/login">{t("login")}</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
