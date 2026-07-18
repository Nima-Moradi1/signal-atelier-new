import { AboutSection } from "@/components/sections/about-section";
import { CapabilitiesSection } from "@/components/sections/capabilities-section";
import { ContactSection } from "@/components/sections/contact-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { HeroSection } from "@/components/sections/hero-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { DepthScrollController } from "@/components/motion/depth-scroll-controller";
import { LandingPreloader } from "@/components/loading/landing-preloader";
import { HashScrollManager } from "@/components/navigation/hash-scroll-manager";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Routes" });

  return (
    <LandingPreloader>
      <HashScrollManager />
      <a className="skip-link" href="#main-content">
        {t("skipMain")}
      </a>
      <SiteHeader />
      <main id="main-content">
        <DepthScrollController />
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <ProjectsSection />
        <CapabilitiesSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </LandingPreloader>
  );
}
