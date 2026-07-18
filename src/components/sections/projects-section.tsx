import Image from "next/image";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { usePortfolio } from "@/content/use-portfolio";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

export function ProjectsSection() {
  const locale = useLocale();
  const portfolio = usePortfolio();
  const t = useTranslations("Projects");
  const format = useFormatter();
  const formatIndex = (value: number) =>
    format.number(value, { minimumIntegerDigits: 2, useGrouping: false });
  const InternalArrow = locale === "fa" ? ArrowLeft : ArrowRight;

  return (
    <section
      className="section projects"
      id="work"
      aria-labelledby="work-title"
      data-depth-section
    >
      <div className="page-shell" data-depth-plane>
        <Reveal className="projects__header-frame">
          <SectionHeading
            id="work-title"
            index={formatIndex(3)}
            eyebrow={t("eyebrow")}
            title={t("title")}
            description={t("description")}
          />
        </Reveal>

        <div className="projects__grid">
          {portfolio.projects.map((project, index) => {
            const content = (
              <article
                className="project-card"
                data-accent={project.accent}
                data-featured={index === 0}
              >
                <div className="project-card__visual">
                  <Image
                    src={project.image}
                    alt={project.imageAlt}
                    fill
                    sizes="(max-width: 864px) 100vw, 33vw"
                  />
                  <span aria-hidden="true">
                    {formatIndex(Number(project.number))}
                  </span>
                </div>
                <div className="project-card__content">
                  <div className="project-card__kicker">
                    <span>{project.category}</span>
                    {project.href?.startsWith("/") ? (
                      <InternalArrow aria-hidden="true" size={19} />
                    ) : (
                      <ArrowUpRight aria-hidden="true" size={19} />
                    )}
                  </div>
                  <h3>{project.title}</h3>
                  <p>{project.summary}</p>
                  <div className="tag-list">
                    {project.technologies.slice(0, 4).map((technology) => (
                      <span key={technology}>
                        <bdi>{technology}</bdi>
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            );

            return (
              <Reveal key={project.id} delay={index * 0.08}>
                {project.href?.startsWith("/") ? (
                  <Link
                    className="project-card__link"
                    href={project.href}
                    aria-label={t("internalLabel", { title: project.title })}
                  >
                    {content}
                  </Link>
                ) : project.href ? (
                  <a
                    className="project-card__link"
                    href={project.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={t("externalLabel", { title: project.title })}
                  >
                    {content}
                  </a>
                ) : (
                  content
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
