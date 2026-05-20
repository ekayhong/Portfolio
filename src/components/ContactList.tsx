import { EmailContactModal } from "@/components/EmailContactModal";

type Props = {
  email: string;
  phones: string[];
  linkedin: string;
  github: string;
  locale?: "fr" | "en";
  labels: {
    email: string;
    phone: string;
    linkedin: string;
    github?: string;
  };
};

const LinkedinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M4.98 3.5C4.98 4.88 3.86 6 2.48 6S0 4.88 0 3.5 1.12 1 2.48 1s2.5 1.12 2.5 2.5zM.5 8h4V24h-4V8zm7 0h3.83v2.19h.05c.53-1 1.83-2.19 3.77-2.19 4.03 0 4.77 2.65 4.77 6.1V24h-4v-7.87c0-1.88-.03-4.29-2.62-4.29-2.62 0-3.02 2.05-3.02 4.16V24h-4V8z" />
  </svg>
);

export function ContactList({ email, phones, linkedin, github, labels, locale = "fr" }: Props) {
  return (
    <div className="contact-block">
      <div className="contact-line">
        <span className="contact-line__label">{labels.email}</span>
        <span className="contact-line__value">
          <EmailContactModal
            email={email}
            locale={locale}
            triggerClassName="contact-line__link-button"
            triggerLabel={email}
          />
        </span>
      </div>
      {phones.map((phone) => (
        <div key={phone} className="contact-line">
          <span className="contact-line__label">{labels.phone}</span>
          <span className="contact-line__value">{phone}</span>
        </div>
      ))}
      <div className="contact-line">
        <span className="contact-line__label">{labels.linkedin}</span>
        <span className="contact-line__value">
          <a href={linkedin} target="_blank" rel="noreferrer" className="linkedin-link">
            <LinkedinIcon />
            {linkedin.replace("https://", "")}
          </a>
        </span>
      </div>
      {labels.github && github ? (
        <div className="contact-line">
          <span className="contact-line__label">{labels.github}</span>
          <span className="contact-line__value">
            <a href={github} target="_blank" rel="noreferrer">{github.replace("https://", "")}</a>
          </span>
        </div>
      ) : null}
    </div>
  );
}
