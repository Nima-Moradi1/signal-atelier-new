import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import {
  getFormatter,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Database,
  Gamepad2,
  Radio,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { XoArenaGalleryImage } from "@/components/projects/xo-arena-gallery-image";
import { XoArenaVideo } from "@/components/projects/xo-arena-video";
import { Link } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";

type XoArenaPageProps = {
  params: Promise<{ locale: string }>;
};

const signalIcons = {
  identity: ShieldCheck,
  rooms: Radio,
  play: Gamepad2,
  opponents: Bot,
  client: Smartphone,
  history: Database,
} as const;

type LocalizedSignal = {
  id: keyof typeof signalIcons;
  title: string;
  text: string;
};

const technologies = [
  "Next.js",
  "TypeScript",
  "Express",
  "Socket.IO",
  "Prisma",
  "MySQL",
  "Zod",
  "PWA",
] as const;

const galleryAssets = {
  landing: {
    index: 1,
    src: "/assets/projects/xo-arena/landing.webp",
    width: 1475,
    height: 919,
  },
  lobby: {
    index: 2,
    src: "/assets/projects/xo-arena/lobby.webp",
    width: 1485,
    height: 851,
  },
  "game-room": {
    index: 3,
    src: "/assets/projects/xo-arena/game-room.webp",
    width: 1486,
    height: 862,
  },
  profile: {
    index: 4,
    src: "/assets/projects/xo-arena/profile.webp",
    width: 1474,
    height: 885,
  },
} as const;

type LocalizedGalleryItem = {
  id: keyof typeof galleryAssets;
  alt: string;
  title: string;
  description: string;
};

const ogLocales: Record<AppLocale, string> = {
  en: "en_US",
  fa: "fa_IR",
  de: "de_DE",
};

function localizedProjectPath(locale: AppLocale) {
  const pathname = "/projects/xo-arena";
  return locale === routing.defaultLocale ? pathname : `/${locale}${pathname}`;
}

export async function generateMetadata({
  params,
}: XoArenaPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const [metadata, xoArena] = await Promise.all([
    getTranslations({ locale, namespace: "Metadata" }),
    getTranslations({ locale, namespace: "XoArena" }),
  ]);
  const galleryItems = xoArena.raw("gallery.items") as LocalizedGalleryItem[];
  const canonical = localizedProjectPath(locale);
  const languages = {
    en: localizedProjectPath("en"),
    fa: localizedProjectPath("fa"),
    de: localizedProjectPath("de"),
    "x-default": localizedProjectPath(routing.defaultLocale),
  };
  const image = {
    url: "/assets/projects/xo-arena/landing.webp",
    alt: galleryItems[0]?.alt ?? "XO Arena",
  };

  return {
    title: metadata("xoTitle"),
    description: metadata("xoDescription"),
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      type: "article",
      url: canonical,
      title: metadata("xoTitle"),
      description: metadata("xoOgDescription"),
      siteName: metadata("siteName"),
      locale: ogLocales[locale],
      alternateLocale: routing.locales
        .filter((candidate) => candidate !== locale)
        .map((candidate) => ogLocales[candidate]),
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: metadata("xoTitle"),
      description: metadata("xoOgDescription"),
      images: [image],
    },
  };
}

export default async function XoArenaPage({ params }: XoArenaPageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const [t, format] = await Promise.all([
    getTranslations({ locale, namespace: "XoArena" }),
    getFormatter({ locale }),
  ]);
  const formatIndex = (value: number) =>
    format.number(value, { minimumIntegerDigits: 2, useGrouping: false });
  const engineeringSignals = t.raw("signals") as LocalizedSignal[];
  const galleryItems = t.raw("gallery.items") as LocalizedGalleryItem[];
  const isRtl = locale === "fa";
  const BackIcon = isRtl ? ArrowRight : ArrowLeft;
  const ForwardIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <>
      <a className="skip-link" href="#xo-main">
        {t("skip")}
      </a>
      <SiteHeader />

      <main className="xo-case" id="xo-main">
        <section className="xo-case__hero" id="top">
          <div className="xo-case__grid" aria-hidden="true" />
          <div className="page-shell">
            <Link className="xo-case__back" href="/#work">
              <BackIcon aria-hidden="true" size={16} />
              {t("back")}
            </Link>

            <div className="xo-case__hero-copy">
              <div>
                <p className="xo-case__eyebrow">
                  <span>
                    <bdi>{formatIndex(1)}</bdi>
                  </span>
                  {t("hero.eyebrow")}
                </p>
                <h1>{t("hero.title")}</h1>
              </div>
              <div className="xo-case__intro">
                <p>{t("hero.intro")}</p>
                <div className="xo-case__availability">
                  <span aria-hidden="true" />
                  {t("hero.availability")}
                </div>
              </div>
            </div>

            <XoArenaVideo />
          </div>
        </section>

        <section className="xo-system" aria-labelledby="xo-system-title">
          <div className="page-shell">
            <div className="xo-section-heading">
              <p>{t("system.eyebrow")}</p>
              <div>
                <h2 id="xo-system-title">{t("system.title")}</h2>
                <p>{t("system.description")}</p>
              </div>
            </div>

            <div className="xo-system__grid">
              {engineeringSignals.map(({ id, title, text }, index) => {
                const Icon = signalIcons[id];
                return (
                  <article key={id}>
                    <div>
                      <Icon aria-hidden="true" size={21} />
                      <span>
                        <bdi>{formatIndex(index + 1)}</bdi>
                      </span>
                    </div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </article>
                );
              })}
            </div>

            <div className="xo-tech" aria-label={t("system.stackLabel")}>
              {technologies.map((technology) => (
                <span key={technology}>
                  <bdi dir="ltr">{technology}</bdi>
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="xo-gallery" aria-labelledby="xo-gallery-title">
          <div className="page-shell">
            <div className="xo-section-heading">
              <p>{t("gallery.eyebrow")}</p>
              <div>
                <h2 id="xo-gallery-title">{t("gallery.title")}</h2>
                <p>{t("gallery.description")}</p>
              </div>
            </div>

            <div className="xo-gallery__grid">
              {galleryItems.map((item) => {
                const asset = galleryAssets[item.id];
                return (
                  <XoArenaGalleryImage
                    key={item.id}
                    index={formatIndex(asset.index)}
                    src={asset.src}
                    alt={item.alt}
                    title={item.title}
                    description={item.description}
                    width={asset.width}
                    height={asset.height}
                  />
                );
              })}
            </div>
          </div>
        </section>

        <section
          className="xo-deployment"
          aria-labelledby="xo-deployment-title"
        >
          <div className="page-shell xo-deployment__layout">
            <div>
              <p>{t("deployment.eyebrow")}</p>
              <h2 id="xo-deployment-title">{t("deployment.title")}</h2>
            </div>
            <div>
              <p>{t("deployment.paragraph1")}</p>
              <p>{t("deployment.paragraph2")}</p>
            </div>
          </div>
        </section>

        <section className="xo-next">
          <div className="page-shell">
            <p>{t("next.eyebrow")}</p>
            <h2>{t("next.title")}</h2>
            <div>
              <Link href="/#work">
                {t("next.work")}
                <ForwardIcon aria-hidden="true" size={17} />
              </Link>
              <Link href="/#contact">
                {t("next.contact")}
                <ForwardIcon aria-hidden="true" size={17} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
