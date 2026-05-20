import { readPublicEnv } from "@/core/infrastructure/config/env";

type Props = {
  labels: {
    title: string;
    subtitle: string;
    pdfMissing: string;
    docxMissing: string;
  };
};

const IconDownload = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

export function CvDownloadCard({ labels }: Props) {
  const env = readPublicEnv();

  return (
    <div className="cv-block">
      <div>
        <p className="cv-block__title">{labels.title}</p>
        <p className="cv-block__sub">{labels.subtitle}</p>
      </div>
      <div className="cv-block__actions">
        {env.cvPdfUrl ? (
          <a className="cv-btn" href={env.cvPdfUrl} target="_blank" rel="noreferrer">
            <IconDownload /> CV PDF
          </a>
        ) : (
          <span style={{ color: "var(--muted-inv)", fontSize: "0.85rem" }}>{labels.pdfMissing}</span>
        )}
        {env.cvDocxUrl ? (
          <a className="cv-btn" href={env.cvDocxUrl} target="_blank" rel="noreferrer">
            <IconDownload /> CV DOCX
          </a>
        ) : (
          <span style={{ color: "var(--muted-inv)", fontSize: "0.85rem" }}>{labels.docxMissing}</span>
        )}
      </div>
    </div>
  );
}
