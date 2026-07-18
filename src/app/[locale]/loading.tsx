import { useTranslations } from "next-intl";

export default function Loading() {
  const t = useTranslations("Routes");

  return (
    <div className="route-loading" role="status" aria-live="polite">
      <span className="route-loading__core" aria-hidden="true" />
      <p>{t("loading")}</p>
    </div>
  );
}
