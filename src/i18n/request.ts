import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing, type AppLocale } from "./routing";

const messageLoaders = {
  de: () => import("../messages/de"),
  en: () => import("../messages/en"),
  fa: () => import("../messages/fa"),
} satisfies Record<AppLocale, () => Promise<{ default: unknown }>>;

export default getRequestConfig(async ({ requestLocale }) => {
  const requestedLocale = await requestLocale;
  const locale = hasLocale(routing.locales, requestedLocale)
    ? requestedLocale
    : routing.defaultLocale;

  return {
    locale,
    messages: (await messageLoaders[locale]()).default,
    timeZone: "Asia/Tehran",
  };
});
