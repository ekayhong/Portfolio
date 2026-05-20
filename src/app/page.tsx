import type { Metadata } from "next";
import { cookies } from "next/headers";
import { AnimatedStats } from "@/components/AnimatedStats";
import { CvModal } from "@/components/CvModal";
import { ExperienceList } from "@/components/ExperienceList";
import { SkillTagList } from "@/components/SkillTagList";
import { profiles } from "@/content/profile";
import { resolveLocale, siteContent } from "@/content/siteContent";
import { readPublicEnv } from "@/core/infrastructure/config/env";

export const metadata: Metadata = {
  alternates: { canonical: "https://www.kayhong.com" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Eric Kay Hong",
  jobTitle: "Développeur .NET Senior & Tech Lead",
  url: "https://www.kayhong.com",
  email: "mailto:ekayhong@hotmail.com",
  telephone: "+33617656139",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Cagnes-sur-Mer",
    addressCountry: "FR",
  },
  sameAs: ["https://linkedin.com/in/eric-kayhong"],
  knowsAbout: ["C#", ".NET", "ASP.NET Core", "Azure", "DDD", "Tech Lead", "DevOps"],
};

export default async function Home() {
  const locale = resolveLocale((await cookies()).get("locale")?.value);
  const profile = profiles[locale];
  const copy = siteContent[locale];
  const env = readPublicEnv();

  return (
    <div className="page-shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero ── */}
      <section className="hero-section">
        <div className="container">
          <p className="hero-section__eyebrow fade-up fade-up--1">
            {copy.hero.eyebrow}
          </p>
          <h1 className="hero-section__name fade-up fade-up--2">Senior .NET / Tech Lead</h1>
          <p className="hero-section__role fade-up fade-up--3">{profile.summary}</p>
          <div className="hero-section__actions fade-up fade-up--4">
            <CvModal pdfUrl={env.cvPdfUrl} label={copy.hero.viewCv} downloadLabel="PDF" />
            <a className="btn btn--secondary" href="/disponibilites">
              {copy.hero.scheduleCall}
            </a>
          </div>

          <div className="hero-availability fade-up fade-up--4">
            <span className="hero-availability__dot" />
            <span className="hero-availability__text">{copy.hero.availabilityValue}</span>
            <span className="hero-availability__date">{copy.hero.availabilityDate}</span>
          </div>
          <div className="hero-section__meta fade-up fade-up--5">
            <div className="hero-section__meta-item">
              <span className="hero-section__meta-label">{copy.hero.titleLabel}</span>
              <span className="hero-section__meta-value">{profile.title}</span>
            </div>
            <div className="hero-section__meta-item">
              <span className="hero-section__meta-label">{copy.hero.modeLabel}</span>
              <span className="hero-section__meta-value">{copy.hero.modeValue}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <AnimatedStats items={copy.stats} />

      {/* ── Forces ── */}
      <section className="editorial-section">
        <div className="container">
          <div className="editorial-section__header">
            <h2 className="editorial-section__title">{copy.sections.strengths}</h2>
            <span className="editorial-section__count">{profile.strengths.length} {copy.sections.strengthsCount}</span>
          </div>
          <SkillTagList items={profile.strengths} grouped={false} />
        </div>
      </section>

      {/* ── Stack ── */}
      <section className="editorial-section" style={{ background: "var(--bg-alt)" }}>
        <div className="container">
          <div className="editorial-section__header">
            <h2 className="editorial-section__title">{copy.sections.stack}</h2>
            <span className="editorial-section__count">{profile.stack.length} {copy.sections.stackCount}</span>
          </div>
          <SkillTagList items={profile.stack} grouped={false} />
        </div>
      </section>

      {/* ── Expériences ── */}
      <section className="editorial-section">
        <div className="container">
          <div className="editorial-section__header">
            <h2 className="editorial-section__title">{copy.sections.experience}</h2>
            <span className="editorial-section__count">{profile.experiences.length} {copy.sections.experienceCount}</span>
          </div>
          <ExperienceList items={profile.experiences} />
        </div>
      </section>

      {/* ── Formation & Langues ── */}
      <section className="editorial-section">
        <div className="container">
          <div className="editorial-section__header">
            <h2 className="editorial-section__title">{copy.sections.educationLanguages}</h2>
          </div>
          <div className="two-col">
            <div>
              <p className="skill-group__label" style={{ marginBottom: "0.75rem" }}>{copy.sections.education}</p>
              <div style={{ display: "grid", gap: "0.5rem" }}>
                {profile.education.map((e) => (
                  <p key={e} className="detail-line">{e}</p>
                ))}
              </div>
            </div>
            <div>
              <p className="skill-group__label" style={{ marginBottom: "0.75rem" }}>{copy.sections.languages}</p>
              <div style={{ display: "grid", gap: "0.5rem" }}>
                {profile.languages.map((l) => (
                  <p key={l} className="detail-line">{l}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
