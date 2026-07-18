"use client";

import { Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";

const localeMarks: Record<AppLocale, string> = {
  en: "EN",
  fa: "فا",
  de: "DE",
};

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("LocaleSwitcher");
  const [locationSuffix, setLocationSuffix] = useState("");

  useEffect(() => {
    const syncLocationSuffix = () =>
      setLocationSuffix(`${window.location.search}${window.location.hash}`);
    syncLocationSuffix();
    window.addEventListener("hashchange", syncLocationSuffix);
    window.addEventListener("popstate", syncLocationSuffix);
    return () => {
      window.removeEventListener("hashchange", syncLocationSuffix);
      window.removeEventListener("popstate", syncLocationSuffix);
    };
  }, []);

  return (
    <nav className="locale-switcher" aria-label={t("label")}>
      <Languages aria-hidden="true" size={15} strokeWidth={1.7} />
      <span className="sr-only">
        {t("current", { language: t(`locales.${locale}`) })}
      </span>
      {routing.locales.map((candidate) => (
        <Link
          key={candidate}
          href={`${pathname}${locationSuffix}`}
          locale={candidate}
          hrefLang={candidate}
          scroll={false}
          aria-current={candidate === locale ? "page" : undefined}
          aria-label={t(`locales.${candidate}`)}
          title={t(`locales.${candidate}`)}
        >
          <bdi>{localeMarks[candidate]}</bdi>
        </Link>
      ))}
    </nav>
  );
}
