import Image from "next/image";
import { useFormatter, useTranslations } from "next-intl";
import { usePortfolio } from "@/content/use-portfolio";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

export function AboutSection() {
  const portfolio = usePortfolio();
  const t = useTranslations("About");
  const format = useFormatter();
  const formatIndex = (value: number) =>
    format.number(value, { minimumIntegerDigits: 2, useGrouping: false });

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
            index={formatIndex(1)}
            eyebrow={portfolio.about.eyebrow}
            title={t("title")}
          />
        </Reveal>

        <div className="about__body">
          <div className="about__statement">
            <Reveal>
              <p>{portfolio.identity.statement}</p>
            </Reveal>
            <div className="about__coordinate" aria-hidden="true">
              <span>{t("engineering")}</span>
              <span>×</span>
              <span>{t("creativity")}</span>
            </div>
            <Reveal delay={0.08}>
              <figure className="about__portrait">
                <Image
                  src="/assets/nima-moradirad.jpg"
                  alt={t("portraitAlt")}
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
                <article className="principle-card" key={principle.id}>
                  <span>{formatIndex(Number(principle.index))}</span>
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
