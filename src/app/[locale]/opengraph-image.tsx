import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { hasLocale } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { materializePortfolio } from "@/content/portfolio";
import deCommon from "@/messages/de/common.json";
import enCommon from "@/messages/en/common.json";
import faCommon from "@/messages/fa/common.json";
import { getLocaleDirection, routing, type AppLocale } from "@/i18n/routing";
import type { PortfolioContent } from "@/types/portfolio";

const imageSize = { width: 1200, height: 630 };
const openGraphAltByLocale = {
  de: deCommon.Metadata.openGraphAlt,
  en: enCommon.Metadata.openGraphAlt,
  fa: faCommon.Metadata.openGraphAlt,
} satisfies Record<AppLocale, string>;

type ImageParams = { locale: string };

export function generateImageMetadata({ params }: { params: ImageParams }) {
  const locale = hasLocale(routing.locales, params.locale)
    ? params.locale
    : routing.defaultLocale;

  return [
    {
      id: "default",
      alt: openGraphAltByLocale[locale],
      size: imageSize,
      contentType: "image/png",
    },
  ];
}

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<ImageParams>;
  id: Promise<string | number>;
}) {
  const { locale: requestedLocale } = await params;
  const locale = hasLocale(routing.locales, requestedLocale)
    ? requestedLocale
    : routing.defaultLocale;
  const [t, messages, fontData] = await Promise.all([
    getTranslations({ locale, namespace: "Metadata" }),
    getMessages({ locale }),
    readFile(
      join(process.cwd(), "src", "assets", "fonts", "Vazirmatn-Regular.ttf"),
    ),
  ]);
  const portfolio = materializePortfolio(
    messages.Portfolio as PortfolioContent,
  );
  const isRtl = getLocaleDirection(locale) === "rtl";
  const artPosition = isRtl ? { left: 90 } : { right: 90 };
  const corePosition = isRtl ? { left: 165 } : { right: 165 };

  return new ImageResponse(
    <div
      dir={isRtl ? "rtl" : "ltr"}
      style={{
        alignItems: "stretch",
        background: "#090b0a",
        color: "#f3f6ef",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Vazirmatn",
        height: "100%",
        justifyContent: "space-between",
        padding: "64px 72px",
        position: "relative",
        width: "100%",
      }}
    >
      <div
        style={{
          ...artPosition,
          border: "1px solid rgba(184,255,69,.35)",
          borderRadius: 999,
          display: "flex",
          height: 310,
          position: "absolute",
          top: 150,
          transform: `rotate(${isRtl ? 18 : -18}deg)`,
          width: 310,
        }}
      />
      <div
        style={{
          ...corePosition,
          background: "#b8ff45",
          borderRadius: 999,
          boxShadow: "0 0 90px rgba(184,255,69,.45)",
          display: "flex",
          height: 160,
          position: "absolute",
          top: 225,
          width: 160,
        }}
      />
      <div
        style={{
          color: "#b8ff45",
          display: "flex",
          fontSize: 25,
          justifyContent: isRtl ? "flex-end" : "flex-start",
        }}
      >
        {t("openGraphLabel")}
      </div>
      <div
        style={{
          alignItems: isRtl ? "flex-end" : "flex-start",
          alignSelf: isRtl ? "flex-end" : "flex-start",
          display: "flex",
          flexDirection: "column",
          textAlign: isRtl ? "right" : "left",
          width: 760,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 82,
            fontWeight: 400,
            lineHeight: 1.08,
          }}
        >
          {t("openGraphHeadline")}
        </div>
        <div
          style={{
            color: "#9da59a",
            display: "flex",
            fontSize: 24,
            marginTop: 28,
          }}
        >
          {portfolio.identity.name} · {portfolio.identity.role}
        </div>
      </div>
    </div>,
    {
      ...imageSize,
      fonts: [
        {
          name: "Vazirmatn",
          data: fontData,
          style: "normal",
          weight: 400,
        },
      ],
    },
  );
}
