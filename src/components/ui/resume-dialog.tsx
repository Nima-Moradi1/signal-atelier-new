"use client";

import Image from "next/image";
import { Download, ExternalLink, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, type MouseEvent } from "react";
import { usePortfolio } from "@/content/use-portfolio";

type ResumeDialogProps = {
  open: boolean;
  resumeUrl: string;
  onClose: () => void;
};

export function ResumeDialog({ open, resumeUrl, onClose }: ResumeDialogProps) {
  const portfolio = usePortfolio();
  const t = useTranslations("ResumeDialog");
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const node = dialog.current;
    if (!node) return;

    if (open && !node.open) node.showModal();
    if (!open && node.open) node.close();

    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  function handleBackdropClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) event.currentTarget.close();
  }

  return (
    <dialog
      ref={dialog}
      className="resume-dialog"
      aria-labelledby="resume-dialog-title"
      onClose={onClose}
      onClick={handleBackdropClick}
    >
      <article className="resume-dialog__paper">
        <header className="resume-dialog__header">
          <div>
            <span>{t("label")}</span>
            <h2 id="resume-dialog-title">{t("title")}</h2>
          </div>
          <button
            type="button"
            aria-label={t("close")}
            onClick={() => dialog.current?.close()}
          >
            <X aria-hidden="true" size={19} />
          </button>
        </header>

        <div
          className="resume-dialog__viewport"
          tabIndex={0}
          lang="en"
          dir="ltr"
          data-artifact-language="en"
        >
          <Image
            src={portfolio.identity.resumePreview}
            alt={t("previewAlt")}
            width={1191}
            height={1684}
            sizes="(max-width: 640px) 92vw, 46rem"
            loading={open ? "eager" : "lazy"}
          />
        </div>

        <footer className="resume-dialog__footer">
          <p>{t("description")}</p>
          <div>
            <a href={resumeUrl} target="_blank" rel="noreferrer">
              {t("open")}
              <ExternalLink aria-hidden="true" size={15} />
            </a>
            <a href={resumeUrl} download>
              {t("download")}
              <Download aria-hidden="true" size={15} />
            </a>
          </div>
        </footer>
      </article>
    </dialog>
  );
}
