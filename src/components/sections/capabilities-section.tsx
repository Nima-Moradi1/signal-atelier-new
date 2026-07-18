import { portfolio } from "@/content/portfolio";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { CapabilityTimeline } from "@/components/capabilities/capability-timeline";

export function CapabilitiesSection() {
  return (
    <section
      className="section capabilities"
      id="capabilities"
      aria-labelledby="capabilities-title"
      data-depth-section
    >
      <div className="page-shell capabilities__intro" data-depth-plane>
        <Reveal>
          <SectionHeading
            id="capabilities-title"
            index="04"
            eyebrow="Engineering capabilities"
            title="Web to Android."
            description="Architecture, delivery, quality, and AI-assisted systems for production products."
          />
        </Reveal>
      </div>
      <CapabilityTimeline
        groups={portfolio.capabilities}
        education={portfolio.education}
      />
    </section>
  );
}
