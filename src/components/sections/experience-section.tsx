import { ExperienceBook } from "@/components/experience/experience-book";
import { portfolio } from "@/content/portfolio";

export function ExperienceSection() {
  return (
    <section
      className="experience"
      id="experience"
      aria-labelledby="experience-title"
    >
      <ExperienceBook experiences={portfolio.experience} />
    </section>
  );
}
