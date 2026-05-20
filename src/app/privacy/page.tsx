import { cookies } from "next/headers";
import { resolveLocale, siteContent } from "@/content/siteContent";

export default async function PrivacyPage() {
  const locale = resolveLocale((await cookies()).get("locale")?.value);
  const copy = siteContent[locale].privacyPage;

  return (
    <div className="page-shell">
      <section className="hero-section" style={{ paddingBottom: "3rem" }}>
        <div className="container">
          <p className="hero-section__eyebrow">GDPR</p>
          <h1 className="hero-section__name" style={{ fontSize: "clamp(2.2rem, 4.8vw, 3.8rem)" }}>
            {copy.title}
          </h1>
          <p className="hero-section__role">{copy.intro}</p>
        </div>
      </section>

      <section className="editorial-section">
        <div className="container">
          <div className="privacy-grid">
            {copy.sections.map((section) => (
              <article key={section.heading} className="card privacy-card">
                <h2 className="editorial-section__title" style={{ fontSize: "clamp(1.25rem, 2.6vw, 1.8rem)" }}>
                  {section.heading}
                </h2>
                <p className="detail-line" style={{ marginTop: "0.8rem" }}>
                  {section.content}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
