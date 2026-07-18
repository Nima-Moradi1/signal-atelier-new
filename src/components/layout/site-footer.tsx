import { useFormatter, useTranslations } from "next-intl";
import { usePortfolio } from "@/content/use-portfolio";

export function SiteFooter() {
  const portfolio = usePortfolio();
  const t = useTranslations("Footer");
  const format = useFormatter();
  const year = format.number(new Date().getFullYear(), { useGrouping: false });

  return (
    <footer className="site-footer">
      <a href="#top" className="site-footer__mark" aria-label={t("backToTop")}>
        {portfolio.identity.initials}
      </a>
      <p>
        {t("statement")}
        <br />
        {t("copyright", { year, name: portfolio.identity.name })}
      </p>
      <div className="site-footer__links">
        {portfolio.socialLinks.map((link) => (
          <a
            href={link.href}
            key={link.label}
            target="_blank"
            rel="noreferrer noopener"
          >
            {link.label}
          </a>
        ))}
        <a href={portfolio.identity.resumeUrl} download>
          {t("resume")}
        </a>
        <a href="#top">{t("top")}</a>
      </div>
    </footer>
  );
}
