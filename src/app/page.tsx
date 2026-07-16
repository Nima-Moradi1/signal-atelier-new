import { AboutSection } from "@/components/sections/about-section";
import { CapabilitiesSection } from "@/components/sections/capabilities-section";
import { ContactSection } from "@/components/sections/contact-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { HeroSection } from "@/components/sections/hero-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { DepthScrollController } from "@/components/motion/depth-scroll-controller";

export default function HomePage() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
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
    </>
  );
}
