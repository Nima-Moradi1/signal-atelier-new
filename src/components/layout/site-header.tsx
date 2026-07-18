"use client";

import { Menu, X } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { LocaleSwitcher } from "@/components/i18n/locale-switcher";
import { ThemeLamp } from "@/components/theme/theme-lamp";
import { usePortfolio } from "@/content/use-portfolio";
import { Link } from "@/i18n/navigation";

export function SiteHeader() {
  const portfolio = usePortfolio();
  const t = useTranslations("Navigation");
  const format = useFormatter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const mobileViewport = window.matchMedia("(max-width: 72rem)");
    const handleViewportChange = (event: MediaQueryListEvent) => {
      if (!event.matches) setMenuOpen(false);
    };
    mobileViewport.addEventListener("change", handleViewportChange);
    return () =>
      mobileViewport.removeEventListener("change", handleViewportChange);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  return (
    <>
      <header className="site-header" data-scrolled={scrolled}>
        <Link
          className="site-header__brand"
          href="/"
          aria-label={t("goTop")}
          onClick={() => setMenuOpen(false)}
        >
          <span className="site-header__mark" aria-hidden="true">
            {portfolio.identity.initials}
          </span>
          <span className="site-header__identity">
            <strong>{portfolio.identity.name}</strong>
            <small>{portfolio.identity.shortRole}</small>
          </span>
        </Link>

        <nav
          className="site-header__desktop-nav"
          aria-label={t("primaryLabel")}
        >
          {portfolio.navigation.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="site-header__actions">
          <Link className="site-header__contact" href="/#contact">
            {t("contactCta")}
          </Link>
          <LocaleSwitcher />
          <ThemeLamp />
          <button
            className="site-header__menu-button"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? t("close") : t("open")}
            onClick={() => setMenuOpen((current) => !current)}
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </header>

      <div
        className="mobile-nav"
        id="mobile-navigation"
        data-open={menuOpen}
        aria-hidden={!menuOpen}
      >
        <nav aria-label={t("mobileLabel")}>
          {portfolio.navigation.map((item, index) => (
            <Link
              href={item.href}
              key={item.href}
              tabIndex={menuOpen ? 0 : -1}
              onClick={() => setMenuOpen(false)}
            >
              <bdi>
                {format.number(index + 1, {
                  minimumIntegerDigits: 2,
                  useGrouping: false,
                })}
              </bdi>
              {item.label}
            </Link>
          ))}
        </nav>
        <p>{portfolio.identity.location}</p>
      </div>
    </>
  );
}
