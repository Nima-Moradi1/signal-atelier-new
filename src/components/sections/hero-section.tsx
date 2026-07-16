import { ArrowDown } from "lucide-react";
import { portfolio } from "@/content/portfolio";
import { Reveal } from "@/components/motion/reveal";
import { HeroStudio } from "@/components/three/hero-studio";
import { MagneticLink } from "@/components/ui/magnetic-link";

export function HeroSection() {
  return (
    <section
      className="hero"
      id="top"
      aria-labelledby="hero-title"
      data-depth-section
    >
      <div className="hero__grid" aria-hidden="true" />
      <div className="hero__glow" aria-hidden="true" />

      <div className="hero__content page-shell" data-depth-plane>
        <Reveal className="hero__status">
          <span className="status-dot" aria-hidden="true" />
          {portfolio.identity.availability}
        </Reveal>

        <div className="hero__layout">
          <div className="hero__copy">
            <Reveal delay={0.06}>
              <p className="hero__role">{portfolio.identity.role}</p>
            </Reveal>
            <Reveal delay={0.12}>
              <h1 id="hero-title">
                I build digital
                <span>systems with signal.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.22}>
              <p className="hero__intro">{portfolio.identity.intro}</p>
            </Reveal>
            <Reveal className="hero__actions" delay={0.3}>
              <MagneticLink href="#work" className="magnetic-link--primary">
                Explore selected work
              </MagneticLink>
              <MagneticLink href={portfolio.identity.resumeUrl} download>
                Download résumé
              </MagneticLink>
              <MagneticLink href="#contact">Open a channel</MagneticLink>
            </Reveal>
          </div>

          <div className="hero__workstation">
            <HeroStudio />
          </div>
        </div>

        <Reveal className="hero__footer" delay={0.36}>
          <a href="#about" className="hero__scroll-cue">
            <ArrowDown aria-hidden="true" size={16} />
            Scroll forward into the next system
          </a>
          <div className="hero__signals" aria-label="Areas of practice">
            {portfolio.signals.map((signal, index) => (
              <span key={signal}>
                <small>0{index + 1}</small>
                {signal}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
