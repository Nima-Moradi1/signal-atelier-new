import { portfolio } from "@/content/portfolio";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <a href="#top" className="site-footer__mark" aria-label="Back to top">
        {portfolio.identity.initials}
      </a>
      <p>
        Designed as a signal system. Engineered for the real web.
        <br />© {new Date().getFullYear()} {portfolio.identity.name}
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
          Résumé
        </a>
        <a href="#top">Top ↑</a>
      </div>
    </footer>
  );
}
