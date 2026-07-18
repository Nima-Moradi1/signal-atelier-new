import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Vazirmatn } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { notFound } from "next/navigation";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { materializePortfolio } from "@/content/portfolio";
import { getLocaleDirection, routing } from "@/i18n/routing";
import { getLanguagePaths, getLocalizedPath } from "@/i18n/paths";
import { siteUrl } from "@/lib/site";
import type { PortfolioContent } from "@/types/portfolio";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic", "latin"],
  display: "swap",
  preload: false,
});

const themeInitScript = `(() => {
  try {
    const stored = window.localStorage.getItem("nima-portfolio-theme");
    const theme = stored === "light" ? "light" : "dark";
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  } catch {}
})();`;

const ogLocales = {
  en: "en_US",
  fa: "fa_IR",
  de: "de_DE",
} as const;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: Omit<LocaleLayoutProps, "children">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const [t, messages] = await Promise.all([
    getTranslations({ locale, namespace: "Metadata" }),
    getMessages({ locale }),
  ]);
  const portfolio = materializePortfolio(
    messages.Portfolio as PortfolioContent,
  );
  const languages = getLanguagePaths();

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: t("homeTitle"),
      template: `%s · ${portfolio.identity.name}`,
    },
    description: t("homeDescription"),
    applicationName: t("siteName"),
    authors: [{ name: portfolio.identity.name }],
    creator: portfolio.identity.name,
    alternates: {
      canonical: getLocalizedPath(locale),
      languages,
    },
    keywords: t.raw("keywords") as string[],
    openGraph: {
      type: "profile",
      url: getLocalizedPath(locale),
      title: t("homeOgTitle"),
      description: t("homeOgDescription"),
      siteName: t("siteName"),
      locale: ogLocales[locale],
      alternateLocale: routing.locales
        .filter((candidate) => candidate !== locale)
        .map((candidate) => ogLocales[candidate]),
    },
    twitter: {
      card: "summary_large_image",
      title: t("homeOgTitle"),
      description: t("homeOgDescription"),
    },
    manifest: getLocalizedPath(locale, "/manifest.webmanifest"),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#090b0a",
  width: "device-width",
  initialScale: 1,
};

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const messages = await getMessages({ locale });
  const portfolio = materializePortfolio(
    messages.Portfolio as PortfolioContent,
  );
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: portfolio.identity.name,
    url: `${siteUrl}${getLocalizedPath(locale)}`,
    jobTitle: portfolio.identity.role,
    email: `mailto:${portfolio.identity.email}`,
    sameAs: portfolio.socialLinks.map((link) => link.href),
    knowsLanguage: ["en", "fa", "de"],
  };

  return (
    <html
      lang={locale}
      dir={getLocaleDirection(locale)}
      data-locale={locale}
      data-theme="dark"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${vazirmatn.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider>{children}</ThemeProvider>
        </NextIntlClientProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personSchema).replace(/</g, "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}
