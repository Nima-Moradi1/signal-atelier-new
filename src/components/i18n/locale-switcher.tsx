"use client";

import { Check, ChevronDown, Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import { Link, usePathname } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";
import { localeSwitcherClassNames as styles } from "./locale-switcher.class-names";

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
    <DropdownMenuPrimitive.Root
      dir={locale === "fa" ? "rtl" : "ltr"}
      modal={false}
    >
      <DropdownMenuPrimitive.Trigger asChild>
        <button
          className={styles.trigger}
          type="button"
          aria-label={t("current", { language: t(`locales.${locale}`) })}
        >
          <Languages
            className={styles.icon}
            aria-hidden="true"
            size={15}
            strokeWidth={1.7}
          />
          <bdi className={styles.activeMark}>{localeMarks[locale]}</bdi>
          <ChevronDown
            className={styles.chevron}
            aria-hidden="true"
            size={13}
            strokeWidth={1.8}
          />
        </button>
      </DropdownMenuPrimitive.Trigger>

      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          className={styles.content}
          align="end"
          sideOffset={8}
          collisionPadding={12}
          aria-label={t("label")}
        >
          <p className={styles.label}>{t("label")}</p>
          {routing.locales.map((candidate) => {
            const active = candidate === locale;
            return (
              <DropdownMenuPrimitive.Item asChild key={candidate}>
                <Link
                  className={styles.option}
                  href={`${pathname}${locationSuffix}`}
                  locale={candidate}
                  hrefLang={candidate}
                  scroll={false}
                  aria-current={active ? "page" : undefined}
                >
                  <span className={styles.optionMark}>
                    <bdi>{localeMarks[candidate]}</bdi>
                  </span>
                  <span className={styles.optionName}>
                    {t(`locales.${candidate}`)}
                  </span>
                  <Check
                    className={styles.check}
                    data-active={active}
                    aria-hidden="true"
                    size={14}
                    strokeWidth={2}
                  />
                </Link>
              </DropdownMenuPrimitive.Item>
            );
          })}
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
}
