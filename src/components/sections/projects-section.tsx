import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { portfolio } from "@/content/portfolio";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

export function ProjectsSection() {
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
            index="03"
            eyebrow="Selected work"
            title="Work that ships."
            description="Three production-minded products across multiplayer, commerce, and B2B finance."
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
                  <span aria-hidden="true">{project.number}</span>
                </div>
                <div className="project-card__content">
                  <div className="project-card__kicker">
                    <span>{project.category}</span>
                    {project.href?.startsWith("/") ? (
                      <ArrowRight aria-hidden="true" size={19} />
                    ) : (
                      <ArrowUpRight aria-hidden="true" size={19} />
                    )}
                  </div>
                  <h3>{project.title}</h3>
                  <p>{project.summary}</p>
                  <div className="tag-list">
                    {project.technologies.slice(0, 4).map((technology) => (
                      <span key={technology}>{technology}</span>
                    ))}
                  </div>
                </div>
              </article>
            );

            return (
              <Reveal key={project.number} delay={index * 0.08}>
                {project.href?.startsWith("/") ? (
                  <Link
                    className="project-card__link"
                    href={project.href}
                    aria-label={`View the ${project.title} case study`}
                  >
                    {content}
                  </Link>
                ) : project.href ? (
                  <a
                    className="project-card__link"
                    href={project.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={`View ${project.title} project in a new tab`}
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
