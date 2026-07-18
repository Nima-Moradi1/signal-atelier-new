import { useFormatter, useTranslations } from "next-intl";
import { usePortfolio } from "@/content/use-portfolio";
import { Reveal } from "@/components/motion/reveal";
import { ContactForm } from "@/components/sections/contact-form";

export function ContactSection() {
  const portfolio = usePortfolio();
  const t = useTranslations("Contact");
  const format = useFormatter();

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
              <span aria-hidden="true">
                {format.number(5, {
                  minimumIntegerDigits: 2,
                  useGrouping: false,
                })}
              </span>
              {t("eyebrow")}
            </p>
            <h2 id="contact-title">
              {t("title")}
              <span>{t("titleAccent")}</span>
            </h2>
          </div>
        </Reveal>

        <div className="contact__layout">
          <Reveal>
            <div className="contact__aside">
              <p>{t("description")}</p>
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
