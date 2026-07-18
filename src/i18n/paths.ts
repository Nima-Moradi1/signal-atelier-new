import { routing, type AppLocale } from "./routing";

export function getLocalizedPath(locale: AppLocale, pathname = "/"): string {
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (locale === routing.defaultLocale) return normalizedPath;
  return `/${locale}${normalizedPath === "/" ? "" : normalizedPath}`;
}

export function getLanguagePaths(pathname = "/") {
  return {
    en: getLocalizedPath("en", pathname),
    fa: getLocalizedPath("fa", pathname),
    de: getLocalizedPath("de", pathname),
    "x-default": getLocalizedPath(routing.defaultLocale, pathname),
  };
}
