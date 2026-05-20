"use client";

import Script from "next/script";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { readPublicEnv } from "@/core/infrastructure/config/env";

type Locale = "fr" | "en";

type Props = {
  email: string;
  locale: Locale;
  triggerClassName: string;
  triggerLabel: string | ReactNode;
};

const copy: Record<Locale, {
  title: string;
  subtitle: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  submitIdle: string;
  submitLoading: string;
  success: string;
  error: string;
  close: string;
  recipient: string;
  verificationLabel: string;
  verificationHint: string;
}> = {
  fr: {
    title: "Envoyer un email",
    subtitle: "Le message part directement vers ma boîte mail.",
    name: "Votre nom",
    email: "Votre email",
    subject: "Sujet",
    message: "Votre message",
    submitIdle: "Envoyer le message",
    submitLoading: "Envoi en cours...",
    success: "Message envoyé. Je vous répondrai dès que possible.",
    error: "Impossible d'envoyer le message.",
    close: "Fermer",
    recipient: "Destinataire",
    verificationLabel: "Vérification anti-spam",
    verificationHint: "Un contrôle discret protège ce formulaire des robots.",
  },
  en: {
    title: "Send an email",
    subtitle: "The message is sent directly to my inbox.",
    name: "Your name",
    email: "Your email",
    subject: "Subject",
    message: "Your message",
    submitIdle: "Send message",
    submitLoading: "Sending...",
    success: "Message sent. I will get back to you as soon as possible.",
    error: "Unable to send the message.",
    close: "Close",
    recipient: "Recipient",
    verificationLabel: "Anti-spam check",
    verificationHint: "A discreet check helps keep bots away.",
  },
};

export function EmailContactModal({ email, locale, triggerClassName, triggerLabel }: Props) {
  const { turnstileSiteKey } = readPublicEnv();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [done, setDone] = useState(false);
  const [turnstileReady, setTurnstileReady] = useState(false);
  const turnstileRef = useRef<HTMLDivElement | null>(null);
  const turnstileWidgetId = useRef<string | number | null>(null);

  const t = copy[locale];

  useEffect(() => {
    if (!open || !turnstileReady || !turnstileSiteKey || !turnstileRef.current) {
      return undefined;
    }

    const turnstile = (window as Window & {
      turnstile?: {
        render: (element: HTMLElement, options: Record<string, unknown>) => string | number;
        remove: (widgetId: string | number) => void;
      };
    }).turnstile;

    if (!turnstile || turnstileWidgetId.current !== null) {
      return undefined;
    }

    turnstileWidgetId.current = turnstile.render(turnstileRef.current, {
      sitekey: turnstileSiteKey,
      theme: "light",
      size: "flexible",
      appearance: "interaction-only",
    });

    return () => {
      if (turnstileWidgetId.current !== null && turnstile) {
        turnstile.remove(turnstileWidgetId.current);
      }

      turnstileWidgetId.current = null;

      if (turnstileRef.current) {
        turnstileRef.current.innerHTML = "";
      }
    };
  }, [open, turnstileReady, turnstileSiteKey]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setFeedback("");

    const formData = new FormData(event.currentTarget);
    const turnstileToken = String(formData.get("cf-turnstile-response") ?? "").trim();
    const honeypot = String(formData.get("website") ?? "").trim();

    if (honeypot) {
      setFeedback(t.error);
      setLoading(false);
      return;
    }

    if (turnstileSiteKey && !turnstileToken) {
      setFeedback(t.error);
      setLoading(false);
      return;
    }

    const payload = {
      senderName: String(formData.get("name") ?? "").trim(),
      senderEmail: String(formData.get("email") ?? "").trim(),
      subject: String(formData.get("subject") ?? "").trim() || (locale === "fr" ? "Message depuis le portfolio" : "Message from the portfolio"),
      message: String(formData.get("message") ?? "").trim(),
      honeypot,
      turnstileToken,
    };

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      setDone(true);
      event.currentTarget.reset();
    } else {
      setFeedback(t.error);
    }

    setLoading(false);
  }

  return (
    <>
      <button
        type="button"
        className={triggerClassName}
        onClick={() => {
          setOpen(true);
          setFeedback("");
          setDone(false);
        }}
      >
        {triggerLabel}
      </button>

      {open ? (
        <div className="slot-modal-backdrop" onClick={() => setOpen(false)}>
          <div className="slot-modal card contact-modal" onClick={(event) => event.stopPropagation()}>
            <div className="slot-modal__header">
              <div>
                <p className="slot-modal__label">{t.title}</p>
                <strong>{t.subtitle}</strong>
                <div className="contact-modal__recipient">
                  {t.recipient}: <span>{email}</span>
                </div>
              </div>
              <button type="button" className="slot-modal__close" onClick={() => setOpen(false)} aria-label={t.close}>
                ✕
              </button>
            </div>

            {done ? (
              <div className="slot-modal__success">
                <span className="slot-modal__success-icon">✓</span>
                <p>{t.success}</p>
              </div>
            ) : (
              <form className="form-grid" onSubmit={onSubmit}>
                <Script
                  src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
                  strategy="afterInteractive"
                  onLoad={() => setTurnstileReady(true)}
                />
                <input name="name" placeholder={t.name} required minLength={2} />
                <input name="email" type="email" placeholder={t.email} required />
                <input name="subject" placeholder={t.subject} />
                <textarea name="message" placeholder={t.message} rows={5} required minLength={10} />
                <input
                  className="contact-modal__honeypot"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />
                <div className="contact-modal__turnstile">
                  <span className="contact-modal__anti-spam-label">{t.verificationLabel}</span>
                  <p className="contact-modal__anti-spam-hint">{t.verificationHint}</p>
                  <div ref={turnstileRef} className="contact-modal__turnstile-widget" />
                </div>
                {feedback ? <p className="contact-modal__feedback">{feedback}</p> : null}
                <div className="contact-modal__actions">
                  <button type="submit" className="btn btn--primary" disabled={loading}>
                    {loading ? t.submitLoading : t.submitIdle}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}