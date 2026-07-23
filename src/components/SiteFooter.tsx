"use client";

import { useTranslations } from "next-intl";

export function SiteFooter() {
  const t = useTranslations("SiteFooter");

  return (
    <footer className="mt-auto border-t border-zinc-200 px-6 py-8 dark:border-zinc-800">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 text-sm text-zinc-600 dark:text-zinc-400">
        <p>{t("tagline")}</p>
        <p>{t("copyright")}</p>
      </div>
    </footer>
  );
}
