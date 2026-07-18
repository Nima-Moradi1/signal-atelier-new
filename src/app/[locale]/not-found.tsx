import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("Routes");

  return (
    <main className="route-message">
      <p>{t("notFoundEyebrow")}</p>
      <h1>{t("notFoundTitle")}</h1>
      <Link href="/">{t("notFoundReturn")}</Link>
    </main>
  );
}
