import { portfolio } from "@/content/portfolio";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

export function CapabilitiesSection() {
  return (
    <section
      className="section capabilities"
      id="capabilities"
      aria-labelledby="capabilities-title"
    >
      <div className="page-shell">
        <Reveal>
          <SectionHeading
            index="04"
            eyebrow="Engineering capabilities"
            title="Depth where it matters. Range where it helps."
            description="The frontend platforms, architecture patterns, and quality practices I use across production applications."
          />
        </Reveal>

        <div className="capability-list">
          {portfolio.capabilities.map((group, index) => (
            <Reveal key={group.label} delay={index * 0.08}>
              <article className="capability-row">
                <div>
                  <span>{group.label}</span>
                  <p>{group.description}</p>
                </div>
                <ul>
                  {group.skills.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <aside className="education-card">
            <div className="education-card__signal" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <div>
              <span>Education & languages</span>
              <h3>{portfolio.education.title}</h3>
              <p>{portfolio.education.institution}</p>
            </div>
            <div className="education-card__details">
              <p>{portfolio.education.note}</p>
              <ul aria-label="Languages">
                {portfolio.education.languages.map((language) => (
                  <li key={language}>{language}</li>
                ))}
              </ul>
            </div>
          </aside>
        </Reveal>
      </div>
    </section>
  );
}
