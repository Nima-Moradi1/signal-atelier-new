import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { portfolio } from "@/content/portfolio";
import { siteDescription, siteName, siteUrl } from "@/lib/site";
import "./globals.css";

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

const themeInitScript = `(() => {
  try {
    const stored = window.localStorage.getItem("nima-portfolio-theme");
    const theme = stored === "light" ? "light" : "dark";
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  } catch {}
})();`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${portfolio.identity.name} · ${portfolio.identity.role}`,
    template: `%s · ${portfolio.identity.name}`,
  },
  description: siteDescription,
  applicationName: siteName,
  authors: [{ name: portfolio.identity.name }],
  creator: portfolio.identity.name,
  alternates: { canonical: "/" },
  keywords: [
    "frontend engineer",
    "senior frontend engineer",
    "React",
    "Next.js",
    "TypeScript",
    "frontend architecture",
    "PWA",
    "Three.js",
    "portfolio",
  ],
  openGraph: {
    type: "profile",
    url: "/",
    title: `${portfolio.identity.name} · ${portfolio.identity.role}`,
    description: siteDescription,
    siteName,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${portfolio.identity.name} · ${portfolio.identity.role}`,
    description: siteDescription,
  },
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

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#090b0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: portfolio.identity.name,
    url: siteUrl,
    jobTitle: portfolio.identity.role,
    email: `mailto:${portfolio.identity.email}`,
    sameAs: portfolio.socialLinks.map((link) => link.href),
  };

  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
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
