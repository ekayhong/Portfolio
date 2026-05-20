import { siteContent } from "@/content/siteContent";
import { profiles } from "@/content/profile";
import { readPublicEnv } from "@/core/infrastructure/config/env";
import { EmailContactModal } from "@/components/EmailContactModal";

const IconDownload = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const IconLinkedIn = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-label="LinkedIn">
    <path d="M4.98 3.5C4.98 4.88 3.86 6 2.48 6S0 4.88 0 3.5 1.12 1 2.48 1s2.5 1.12 2.5 2.5zM.5 8h4V24h-4V8zm7 0h3.83v2.19h.05c.53-1 1.83-2.19 3.77-2.19 4.03 0 4.77 2.65 4.77 6.1V24h-4v-7.87c0-1.88-.03-4.29-2.62-4.29-2.62 0-3.02 2.05-3.02 4.16V24h-4V8z" />
  </svg>
);

const IconEnvelope = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const IconGitHub = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-label="GitHub">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

export function ContactBar({ locale }: { locale: "fr" | "en" }) {
  const copy = siteContent[locale];
  const profile = profiles[locale];
  const env = readPublicEnv();

  return (
    <div className="contact-bar" role="contentinfo">
      <div className="contact-bar__inner">

        {/* Column 1: Download CV */}
        <div className="contact-bar__column">
          <span className="contact-bar__column-label">{copy.cvCard.title}</span>
          <div className="contact-bar__column-content">
            {env.cvPdfUrl ? (
              <a className="contact-bar__cv-link" href={env.cvPdfUrl} target="_blank" rel="noreferrer">
                <IconDownload /> PDF
              </a>
            ) : null}
            {env.cvDocxUrl ? (
              <a className="contact-bar__cv-link" href={env.cvDocxUrl} target="_blank" rel="noreferrer">
                <IconDownload /> DOCX
              </a>
            ) : null}
          </div>
        </div>

        {/* Column 2: Contact CTA */}
        <div className="contact-bar__column contact-bar__column--center">
          <EmailContactModal
            email={profile.contacts.email}
            locale={locale}
            triggerClassName="contact-bar__contact-link"
            triggerLabel={<><IconEnvelope /> {copy.sections.contactMe}</>}
          />
        </div>

        {/* Column 3: Social Networks */}
        <div className="contact-bar__column">
          <span className="contact-bar__column-label">Réseaux</span>
          <div className="contact-bar__column-content">
            <a href={profile.contacts.linkedin} target="_blank" rel="noreferrer" className="contact-bar__social">
              <IconLinkedIn />
              <span>{profile.contacts.linkedin.replace("https://", "")}</span>
            </a>
            <a href="https://github.com/ekayhong" target="_blank" rel="noreferrer" className="contact-bar__social">
              <IconGitHub />
              <span>github.com/ekayhong</span>
            </a>
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="contact-bar__footer">
        <span>© {new Date().getFullYear()} Eric Kay Hong</span>
        <a href="/privacy">{copy.footer.privacyLink}</a>
      </div>

    </div>
  );
}
