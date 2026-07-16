import { ArrowUpRight } from "lucide-react";
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
        <Reveal>
          <SectionHeading
            index="03"
            eyebrow="Selected transmissions"
            title="Three kinds of work. One standard of care."
            description="A selection spanning custom e-commerce, full-stack publishing, and a multi-panel B2B product."
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
                <div className="project-card__visual" aria-hidden="true">
                  <div className="project-card__orb" />
                  <div className="project-card__orbit project-card__orbit--one" />
                  <div className="project-card__orbit project-card__orbit--two" />
                  <span>{project.number}</span>
                </div>
                <div className="project-card__content">
                  <div className="project-card__kicker">
                    <span>{project.category}</span>
                    <ArrowUpRight aria-hidden="true" size={19} />
                  </div>
                  <h3>{project.title}</h3>
                  <p>{project.summary}</p>
                  <p className="project-card__contribution">
                    <strong>Contribution</strong>
                    {project.contribution}
                  </p>
                  <div className="tag-list">
                    {project.technologies.map((technology) => (
                      <span key={technology}>{technology}</span>
                    ))}
                  </div>
                </div>
              </article>
            );

            return (
              <Reveal key={project.number} delay={index * 0.08}>
                {project.href ? (
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
