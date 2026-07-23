import { getRequestConfig } from "next-intl/server";
import { headers } from "next/headers";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as "en" | "vi")) {
    locale = routing.defaultLocale;
  }

  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";

  const commonMessages = (
    await import(`../components/messages/${locale}.json`)
  ).default;

  let featureMessages: Record<string, unknown> = {};

  let normalizedPath = pathname;
  if (normalizedPath.startsWith(`/${locale}`)) {
    normalizedPath = normalizedPath.slice(locale.length + 1);
  }
  if (normalizedPath === "") {
    normalizedPath = "/";
  }

  try {
    if (normalizedPath === "/") {
      featureMessages = (
        await import(`../features/home/messages/${locale}.json`)
      ).default;
    } else if (normalizedPath.startsWith("/dex")) {
      featureMessages = (
        await import(`../features/dogs/messages/${locale}.json`)
      ).default;
    } else if (normalizedPath.startsWith("/scan")) {
      featureMessages = (
        await import(`../features/scan/messages/${locale}.json`)
      ).default;
    } else if (
      normalizedPath.startsWith("/login") ||
      normalizedPath.startsWith("/register")
    ) {
      featureMessages = (
        await import(`../features/auth/messages/${locale}.json`)
      ).default;
    } else if (normalizedPath.startsWith("/profile")) {
      featureMessages = (
        await import(`../features/profile/messages/${locale}.json`)
      ).default;
    }

    if (Object.keys(featureMessages).length === 0) {
      featureMessages = (
        await import(`../features/home/messages/${locale}.json`)
      ).default;
    }
  } catch (error) {
    console.error(
      `Failed to load messages for pathname: ${pathname} (${normalizedPath}), locale: ${locale}`,
      error,
    );
  }

  return {
    locale,
    messages: {
      ...commonMessages,
      ...featureMessages,
    },
  };
});
