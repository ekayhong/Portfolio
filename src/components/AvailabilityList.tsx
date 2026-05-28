"use client";

import { useCallback, useEffect, useState } from "react";
import type { Locale } from "@/content/profile";

type BookingCopy = {
  loading: string;
  loadError: string;
  empty: string;
  selectedSlot: string;
  close: string;
  bookingError: string;
  success: string;
  fullName: string;
  email: string;
  message: string;
  submitIdle: string;
  submitLoading: string;
  gdprConsentLabel: string;
  gdprConsentHint: string;
  privacyLink: string;
};

type Slot = {
  id: string;
  dayKey: string;
  startsAtIso: string;
  endsAtIso: string;
};

function toLocaleTag(locale: Locale) {
  return locale === "en" ? "en-GB" : "fr-FR";
}

function formatDate(iso: string, locale: Locale) {
  return new Date(iso).toLocaleDateString(toLocaleTag(locale), { weekday: "long", day: "numeric", month: "long" });
}

function formatTime(iso: string, locale: Locale) {
  return new Date(iso).toLocaleTimeString(toLocaleTag(locale), { hour: "2-digit", minute: "2-digit" });
}

function groupByDay(slots: Slot[], locale: Locale): { dayKey: string; label: string; slots: Slot[] }[] {
  const map = new Map<string, Slot[]>();
  for (const slot of slots) {
    const group = map.get(slot.dayKey) ?? [];
    group.push(slot);
    map.set(slot.dayKey, group);
  }
  return Array.from(map.entries()).map(([dayKey, slots]) => ({
    dayKey,
    label: formatDate(slots[0].startsAtIso, locale),
    slots,
  }));
}

type Props = {
  locale: Locale;
  copy: BookingCopy;
};

export function AvailabilityList({ locale, copy }: Props) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [status, setStatus] = useState(copy.loading);
  const [selected, setSelected] = useState<Slot | null>(null);

  const fetchSlots = useCallback(() => {
    fetch("/api/slots")
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error ?? copy.loadError);
        }

        setSlots(data.slots ?? []);
        setStatus("");
      })
      .catch((error: any) => {
        console.error("[availability] failed to load slots:", error);
        setStatus(error?.message ?? copy.loadError);
      });
  }, [copy.loadError]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  if (status) return <p className="detail-line">{status}</p>;
  if (slots.length === 0) return <p className="detail-line">{copy.empty}</p>;

  const groups = groupByDay(slots, locale);

  return (
    <>
      <div className="slot-days">
        {groups.map((group) => (
          <div key={group.dayKey} className="slot-day">
            <p className="slot-day__label">{group.label}</p>
            <div className="slot-grid">
              {group.slots.map((slot) => (
                <button
                  key={slot.id}
                  type="button"
                  className={`slot-chip${selected?.id === slot.id ? " slot-chip--active" : ""}`}
                  onClick={() => setSelected(slot)}
                >
                  <span className="slot-chip__time">
                    {formatTime(slot.startsAtIso, locale)} – {formatTime(slot.endsAtIso, locale)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="slot-modal-backdrop" onClick={() => setSelected(null)}>
          <div className="slot-modal card" onClick={(e) => e.stopPropagation()}>
            <div className="slot-modal__header">
              <div>
                <p className="slot-modal__label">{copy.selectedSlot}</p>
                <strong>
                  {formatDate(selected.startsAtIso, locale)} · {formatTime(selected.startsAtIso, locale)} –{" "}
                  {formatTime(selected.endsAtIso, locale)}
                </strong>
              </div>
              <button type="button" className="slot-modal__close" onClick={() => setSelected(null)} aria-label={copy.close}>
                ✕
              </button>
            </div>
            <BookingForm
              slot={selected}
              copy={copy}
              onSuccess={() => {
                setSelected(null);
                fetchSlots();
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}

function BookingForm({ slot, onSuccess, copy }: { slot: Slot; onSuccess: () => void; copy: BookingCopy }) {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [done, setDone] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setFeedback("");
    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        slotId: slot.id,
        dayKey: slot.dayKey,
        startsAtIso: slot.startsAtIso,
        endsAtIso: slot.endsAtIso,
        fullName: formData.get("fullName"),
        email: formData.get("email"),
        message: formData.get("message"),
        gdprConsent: formData.get("gdprConsent") === "on",
      }),
    });

    if (response.ok) {
      setDone(true);
      setTimeout(onSuccess, 1800);
    } else {
      const error = await response.json();
      setFeedback(error.reason ?? copy.bookingError);
    }
    setLoading(false);
  }

  if (done) {
    return (
      <div className="slot-modal__success">
        <span className="slot-modal__success-icon">✓</span>
        <p>{copy.success}</p>
      </div>
    );
  }

  return (
    <form action={onSubmit} className="grid" style={{ gap: "0.75rem", marginTop: "1rem" }}>
      <input name="fullName" placeholder={copy.fullName} required />
      <input name="email" type="email" placeholder={copy.email} required />
      <textarea name="message" placeholder={copy.message} rows={3} />
      <label className="booking-consent">
        <input name="gdprConsent" type="checkbox" required />
        <span>{copy.gdprConsentLabel}</span>
      </label>
      <small className="booking-consent__hint">{copy.gdprConsentHint}</small>
      <small>
        <a href="/privacy" className="inline-privacy-link">
          {copy.privacyLink}
        </a>
      </small>
      <button className="btn btn--primary" type="submit" disabled={loading}>
        {loading ? copy.submitLoading : copy.submitIdle}
      </button>
      {feedback && <small style={{ color: "var(--accent)" }}>{feedback}</small>}
    </form>
  );
}
