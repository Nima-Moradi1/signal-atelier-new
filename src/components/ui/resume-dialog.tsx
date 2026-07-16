"use client";

import Image from "next/image";
import { Download, ExternalLink, X } from "lucide-react";
import { useEffect, useRef, type MouseEvent } from "react";

type ResumeDialogProps = {
  open: boolean;
  resumeUrl: string;
  onClose: () => void;
};

export function ResumeDialog({ open, resumeUrl, onClose }: ResumeDialogProps) {
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
            <span>Document · PDF</span>
            <h2 id="resume-dialog-title">Nima Moradirad — Résumé</h2>
          </div>
          <button
            type="button"
            aria-label="Close résumé preview"
            onClick={() => dialog.current?.close()}
          >
            <X aria-hidden="true" size={19} />
          </button>
        </header>

        <div className="resume-dialog__viewport">
          <Image
            src="/assets/nima-moradirad-resume-preview.png"
            alt="Preview of Nima Moradirad's one-page résumé"
            width={595}
            height={842}
            sizes="(max-width: 640px) 92vw, 54rem"
          />
        </div>

        <footer className="resume-dialog__footer">
          <p>A one-page, print-ready overview of experience and skills.</p>
          <div>
            <a href={resumeUrl} target="_blank" rel="noreferrer">
              Open full size
              <ExternalLink aria-hidden="true" size={15} />
            </a>
            <a href={resumeUrl} download>
              Download PDF
              <Download aria-hidden="true" size={15} />
            </a>
          </div>
        </footer>
      </article>
    </dialog>
  );
}
