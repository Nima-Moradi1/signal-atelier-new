"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpRight, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { contactSchema, type ContactFormValues } from "@/lib/contact-schema";
import { portfolio } from "@/content/portfolio";

type SubmitState =
  | { kind: "idle" }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string; mailto?: string };

export function ContactForm() {
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = (await response.json()) as {
        message?: string;
        mailto?: string;
      };

      if (!response.ok) {
        setSubmitState({
          kind: "error",
          message:
            result.message ??
            "The message could not be sent. Please use email instead.",
          mailto: result.mailto,
        });
        return;
      }

      setSubmitState({
        kind: "success",
        message: result.message ?? "Message received. Thank you.",
      });
      reset();
    } catch {
      setSubmitState({
        kind: "error",
        message: "The connection failed. Please use the email link instead.",
        mailto: `mailto:${portfolio.identity.email}`,
      });
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="contact-form__field">
        <label htmlFor="name">Your name</label>
        <input
          id="name"
          autoComplete="name"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "name-error" : undefined}
          placeholder="How should I address you?"
          {...register("name")}
        />
        {errors.name ? (
          <p className="field-error" id="name-error">
            {errors.name.message}
          </p>
        ) : null}
      </div>

      <div className="contact-form__field">
        <label htmlFor="email">Email address</label>
        <input
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          placeholder="you@company.com"
          {...register("email")}
        />
        {errors.email ? (
          <p className="field-error" id="email-error">
            {errors.email.message}
          </p>
        ) : null}
      </div>

      <div className="contact-form__field contact-form__field--full">
        <label htmlFor="message">What are you building?</label>
        <textarea
          id="message"
          rows={5}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          placeholder="A little context, the challenge, and where you need help…"
          {...register("message")}
        />
        {errors.message ? (
          <p className="field-error" id="message-error">
            {errors.message.message}
          </p>
        ) : null}
      </div>

      <div className="contact-form__honeypot" aria-hidden="true">
        <label htmlFor="company">Company</label>
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
              Transmitting…
            </>
          ) : (
            <>
              Send the signal
              <ArrowUpRight aria-hidden="true" />
            </>
          )}
        </button>
        <p>
          Prefer email?{" "}
          <a href={`mailto:${portfolio.identity.email}`}>
            {portfolio.identity.email}
          </a>
        </p>
      </div>

      <div className="contact-form__status" aria-live="polite" role="status">
        {submitState.kind !== "idle" ? (
          <p data-kind={submitState.kind}>
            {submitState.message}{" "}
            {submitState.kind === "error" && submitState.mailto ? (
              <a href={submitState.mailto}>Open your email app.</a>
            ) : null}
          </p>
        ) : null}
      </div>
    </form>
  );
}
