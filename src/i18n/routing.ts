import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "fa", "de"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  localeDetection: true,
});

export type AppLocale = (typeof routing.locales)[number];

export const localeDirections: Record<AppLocale, "ltr" | "rtl"> = {
  en: "ltr",
  fa: "rtl",
  de: "ltr",
};

export function getLocaleDirection(locale: AppLocale): "ltr" | "rtl" {
  return localeDirections[locale];
}
