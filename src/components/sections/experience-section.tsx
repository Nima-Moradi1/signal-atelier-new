import { ExperienceBook } from "@/components/experience/experience-book";
import { portfolio } from "@/content/portfolio";

export function ExperienceSection() {
  return (
    <section
      className="experience"
      id="experience"
      aria-labelledby="experience-title"
      data-depth-section
    >
      <ExperienceBook experiences={portfolio.experience} />
    </section>
  );
}
