import Image from "next/image";
import { portfolio } from "@/content/portfolio";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

export function AboutSection() {
  return (
    <section
      className="section about"
      id="about"
      aria-labelledby="about-title"
      data-depth-section
    >
      <div className="page-shell" data-depth-plane>
        <Reveal>
          <SectionHeading
            id="about-title"
            index="01"
            eyebrow={portfolio.about.eyebrow}
            title="Human products. Scalable systems."
          />
        </Reveal>

        <div className="about__body">
          <div className="about__statement">
            <Reveal>
              <p>{portfolio.identity.statement}</p>
            </Reveal>
            <div className="about__coordinate" aria-hidden="true">
              <span>Engineering</span>
              <span>×</span>
              <span>Creativity</span>
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

          <div className="about__details">
            <Reveal className="about__narrative">
              {portfolio.about.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </Reveal>
            {portfolio.about.principles.map((principle, index) => (
              <Reveal key={principle.index} delay={(index + 1) * 0.06}>
                <article className="principle-card">
                  <span>{principle.index}</span>
                  <h3>{principle.title}</h3>
                  <p>{principle.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
