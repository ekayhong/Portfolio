import type { Metadata } from "next";
import { cookies } from "next/headers";
import { AvailabilityList } from "@/components/AvailabilityList";
import { resolveLocale, siteContent } from "@/content/siteContent";

export const metadata: Metadata = {
  title: "Disponibilités & Réservation d'entretien",
  description:
    "Réservez un créneau de 30 minutes avec Eric Kay Hong, développeur .NET Senior disponible à Monaco, Nice et en remote.",
  alternates: { canonical: "https://www.kayhong.com/disponibilites" },
};

export default async function DisponibilitesPage() {
  const locale = resolveLocale((await cookies()).get("locale")?.value);
  const copy = siteContent[locale];

  return (
    <div className="page-shell">
      <section className="hero-section" style={{ paddingBottom: "3rem" }}>
        <div className="container">
          <p className="hero-section__eyebrow">{copy.availabilityPage.eyebrow}</p>
          <h1 className="hero-section__name" style={{ fontSize: "clamp(2.2rem, 4.8vw, 3.8rem)" }}>
            {copy.availabilityPage.title}
          </h1>
          <p className="hero-section__role">
            {copy.availabilityPage.intro}
          </p>
        </div>
      </section>

      <section className="editorial-section">
        <div className="container">
          <div className="editorial-section__header">
            <h2 className="editorial-section__title">{copy.availabilityPage.listTitle}</h2>
          </div>
          <AvailabilityList locale={locale} copy={copy.booking} />
        </div>
      </section>
    </div>
  );
}
