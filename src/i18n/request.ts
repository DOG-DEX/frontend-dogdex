import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as "en" | "vi")) {
    locale = routing.defaultLocale;
  }

  const commonMessages = (
    await import(`../components/messages/${locale}.json`)
  ).default;

  const loadModuleMessages = async (path: string) => {
    try {
      return (await import(`../features/${path}/messages/${locale}.json`)).default;
    } catch {
      return {};
    }
  };

  const [homeMessages, authMessages, dogsMessages, scanMessages, profileMessages] =
    await Promise.all([
      loadModuleMessages("home"),
      loadModuleMessages("auth"),
      loadModuleMessages("dogs"),
      loadModuleMessages("scan"),
      loadModuleMessages("profile"),
    ]);

  return {
    locale,
    messages: {
      ...commonMessages,
      ...homeMessages,
      ...authMessages,
      ...dogsMessages,
      ...scanMessages,
      ...profileMessages,
    },
  };
});
