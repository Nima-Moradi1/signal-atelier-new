import { useTranslations } from "next-intl";

export default function XoArenaLoading() {
  const t = useTranslations("Routes");

  return (
    <div className="xo-route-loading" role="status" aria-live="polite">
      <div aria-hidden="true">
        <span>X</span>
        <span />
        <span>O</span>
        <span />
        <span>X</span>
        <span>O</span>
        <span />
        <span>X</span>
        <span>O</span>
      </div>
      <p>{t("xoLoading")}</p>
    </div>
  );
}
