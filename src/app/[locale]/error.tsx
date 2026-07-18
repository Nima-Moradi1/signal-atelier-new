"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("Routes");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="route-message">
      <p>{t("errorEyebrow")}</p>
      <h1>{t("errorTitle")}</h1>
      <p>{t("errorDescription")}</p>
      <button type="button" onClick={reset}>
        {t("errorRetry")}
      </button>
    </main>
  );
}
