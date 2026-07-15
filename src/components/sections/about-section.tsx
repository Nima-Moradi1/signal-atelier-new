import Image from "next/image";
import { portfolio } from "@/content/portfolio";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

export function AboutSection() {
  return (
    <section className="section about" id="about" aria-labelledby="about-title">
      <div className="page-shell">
        <Reveal>
          <SectionHeading
            index="01"
            eyebrow={portfolio.about.eyebrow}
            title="The work should feel clear before it feels clever."
          />
        </Reveal>

        <div className="about__body">
          <div className="about__statement">
            <Reveal>
              <p>{portfolio.identity.statement}</p>
            </Reveal>
            <div className="about__coordinate" aria-hidden="true">
              <span>Architecture</span>
              <span>×</span>
              <span>Delivery</span>
            </div>
            <Reveal delay={0.08}>
              <figure className="about__portrait">
                <Image
                  src="/assets/nima-moradirad.jpg"
                  alt="Portrait of Nima Moradirad"
                  width={400}
                  height={400}
                  sizes="(max-width: 768px) 72vw, 28vw"
                />
                <figcaption>
                  <span>{portfolio.identity.name}</span>
                  <span>{portfolio.identity.location}</span>
                </figcaption>
              </figure>
            </Reveal>
          </div>

          <div className="about__narrative">
            {portfolio.about.paragraphs.map((paragraph, index) => (
              <Reveal key={paragraph} delay={index * 0.08}>
                <p>{paragraph}</p>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="principle-grid">
          {portfolio.about.principles.map((principle, index) => (
            <Reveal key={principle.index} delay={index * 0.08}>
              <article className="principle-card">
                <span>{principle.index}</span>
                <h3>{principle.title}</h3>
                <p>{principle.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
