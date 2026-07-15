import { portfolio } from "@/content/portfolio";
import { Reveal } from "@/components/motion/reveal";
import { ContactForm } from "@/components/sections/contact-form";

export function ContactSection() {
  return (
    <section
      className="section contact"
      id="contact"
      aria-labelledby="contact-title"
    >
      <div className="contact__glow" aria-hidden="true" />
      <div className="page-shell">
        <Reveal>
          <div className="contact__heading">
            <p>
              <span aria-hidden="true">05</span>
              Open a channel
            </p>
            <h2 id="contact-title">
              Have a meaningful problem?
              <span>Let’s make it beautifully clear.</span>
            </h2>
          </div>
        </Reveal>

        <div className="contact__layout">
          <Reveal>
            <div className="contact__aside">
              <p>
                The strongest collaborations start with context. Share the
                product, the tension, and what a good outcome would feel like.
              </p>
              <div className="contact__availability">
                <span className="status-dot" aria-hidden="true" />
                <div>
                  <strong>{portfolio.identity.availability}</strong>
                  <small>{portfolio.identity.location}</small>
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
