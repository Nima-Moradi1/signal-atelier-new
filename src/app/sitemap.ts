import type { MetadataRoute } from "next";
import { getLanguagePaths, getLocalizedPath } from "@/i18n/paths";
import { routing } from "@/i18n/routing";
import { siteUrl } from "@/lib/site";

const routes = [
  { pathname: "/", priority: 1 },
  { pathname: "/projects/xo-arena", priority: 0.8 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.flatMap(({ pathname, priority }) => {
    const languagePaths = getLanguagePaths(pathname);
    const languages = Object.fromEntries(
      Object.entries(languagePaths).map(([locale, path]) => [
        locale,
        `${siteUrl}${path}`,
      ]),
    );

    return routing.locales.map((locale) => ({
      url: `${siteUrl}${getLocalizedPath(locale, pathname)}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority,
      alternates: { languages },
    }));
  });
}
