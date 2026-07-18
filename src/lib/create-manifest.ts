import type { MetadataRoute } from "next";
import { getTranslations } from "next-intl/server";
import { getLocalizedPath } from "@/i18n/paths";
import { getLocaleDirection, type AppLocale } from "@/i18n/routing";

export async function createManifest(
  locale: AppLocale,
): Promise<MetadataRoute.Manifest> {
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const startUrl = getLocalizedPath(locale);

  return {
    id: "/",
    name: t("manifestName"),
    short_name: t("manifestShortName"),
    description: t("manifestDescription"),
    start_url: startUrl,
    scope: "/",
    lang: locale,
    dir: getLocaleDirection(locale),
    display: "standalone",
    background_color: "#090b0a",
    theme_color: "#b8ff45",
    icons: [
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}

export function manifestResponse(manifest: MetadataRoute.Manifest) {
  return Response.json(manifest, {
    headers: {
      "Cache-Control": "public, max-age=0, s-maxage=86400",
      "Content-Type": "application/manifest+json; charset=utf-8",
    },
  });
}
