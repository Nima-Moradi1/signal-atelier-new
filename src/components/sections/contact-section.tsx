import { portfolio } from "@/content/portfolio";
import { Reveal } from "@/components/motion/reveal";
import { ContactForm } from "@/components/sections/contact-form";

export function ContactSection() {
  return (
    <section
      className="section contact"
      id="contact"
      aria-labelledby="contact-title"
      data-depth-section
    >
      <div className="contact__glow" aria-hidden="true" />
      <div className="page-shell" data-depth-plane>
        <Reveal>
          <div className="contact__heading">
            <p>
              <span aria-hidden="true">05</span>
              Open a channel
            </p>
            <h2 id="contact-title">
              Building something meaningful?
              <span>Let’s make it clear.</span>
            </h2>
          </div>
        </Reveal>

        <div className="contact__layout">
          <Reveal>
            <div className="contact__aside">
              <p>Share the product, the challenge, and the outcome you need.</p>
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
