"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpRight, LoaderCircle } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  createContactSchema,
  type ContactFormValues,
} from "@/lib/contact-schema";
import { usePortfolio } from "@/content/use-portfolio";

type SubmitState =
  | { kind: "idle" }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string; mailto?: string };

export function ContactForm() {
  const locale = useLocale();
  const portfolio = usePortfolio();
  const t = useTranslations("ContactForm");
  const contactSchema = useMemo(
    () =>
      createContactSchema({
        nameMin: t("validation.nameMin"),
        nameMax: t("validation.nameMax"),
        email: t("validation.email"),
        messageMin: t("validation.messageMin"),
        messageMax: t("validation.messageMax"),
        company: t("validation.company"),
      }),
    [t],
  );
  const [submitState, setSubmitState] = useState<SubmitState>({ kind: "idle" });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "", company: "" },
  });

  async function onSubmit(values: ContactFormValues) {
    setSubmitState({ kind: "idle" });
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-portfolio-locale": locale,
        },
        body: JSON.stringify(values),
      });
      const result = (await response.json()) as {
        message?: string;
        mailto?: string;
      };

      if (!response.ok) {
        setSubmitState({
          kind: "error",
          message: result.message ?? t("fallbackError"),
          mailto: result.mailto,
        });
        return;
      }

      setSubmitState({
        kind: "success",
        message: result.message ?? t("fallbackSuccess"),
      });
      reset();
    } catch {
      setSubmitState({
        kind: "error",
        message: t("connectionError"),
        mailto: `mailto:${portfolio.identity.email}`,
      });
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="contact-form__field">
        <label htmlFor="name">{t("fields.name")}</label>
        <input
          id="name"
          autoComplete="name"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "name-error" : undefined}
          placeholder={t("fields.namePlaceholder")}
          dir="auto"
          {...register("name")}
        />
        {errors.name ? (
          <p className="field-error" id="name-error">
            {errors.name.message}
          </p>
        ) : null}
      </div>

      <div className="contact-form__field">
        <label htmlFor="email">{t("fields.email")}</label>
        <input
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          placeholder={t("fields.emailPlaceholder")}
          dir="ltr"
          {...register("email")}
        />
        {errors.email ? (
          <p className="field-error" id="email-error">
            {errors.email.message}
          </p>
        ) : null}
      </div>

      <div className="contact-form__field contact-form__field--full">
        <label htmlFor="message">{t("fields.message")}</label>
        <textarea
          id="message"
          rows={5}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          placeholder={t("fields.messagePlaceholder")}
          dir="auto"
          {...register("message")}
        />
        {errors.message ? (
          <p className="field-error" id="message-error">
            {errors.message.message}
          </p>
        ) : null}
      </div>

      <div className="contact-form__honeypot" aria-hidden="true">
        <label htmlFor="company">{t("fields.company")}</label>
        <input
          id="company"
          tabIndex={-1}
          autoComplete="off"
          {...register("company")}
        />
      </div>

      <div className="contact-form__footer">
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <LoaderCircle className="spin" aria-hidden="true" />
              {t("submitting")}
            </>
          ) : (
            <>
              {t("submit")}
              <ArrowUpRight className="icon-directional" aria-hidden="true" />
            </>
          )}
        </button>
        <p>
          {t("preferEmail")}{" "}
          <a href={`mailto:${portfolio.identity.email}`}>
            <bdi>{portfolio.identity.email}</bdi>
          </a>
        </p>
      </div>

      <div className="contact-form__status" aria-live="polite" role="status">
        {submitState.kind !== "idle" ? (
          <p data-kind={submitState.kind}>
            {submitState.message}{" "}
            {submitState.kind === "error" && submitState.mailto ? (
              <a href={submitState.mailto}>{t("openEmail")}</a>
            ) : null}
          </p>
        ) : null}
      </div>
    </form>
  );
}
