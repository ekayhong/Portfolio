"use client";

import { useState } from "react";

type Props = {
  pdfUrl: string;
  label: string;
  downloadLabel: string;
};

export function CvModal({ pdfUrl, label, downloadLabel }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="btn btn--primary" onClick={() => setOpen(true)}>
        {label}
      </button>

      {open && (
        <div className="cv-modal-backdrop" onClick={() => setOpen(false)}>
          <div className="cv-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cv-modal__header">
              <span className="cv-modal__title">{label}</span>
              <div className="cv-modal__actions">
                <a className="cv-btn" href={pdfUrl} download>
                  {downloadLabel}
                </a>
                <button className="slot-modal__close" onClick={() => setOpen(false)}>✕</button>
              </div>
            </div>
            <iframe
              src={pdfUrl}
              className="cv-modal__iframe"
              title="CV"
            />
          </div>
        </div>
      )}
    </>
  );
}
