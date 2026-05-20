type Env = {
  mongoUri: string;
  mongoDatabase: string;
  mongoCollection: string;
  smtpHost: string;
  smtpPort: number;
  smtpSecure: boolean;
  smtpUser: string;
  smtpPass: string;
  mailFrom: string;
  mailTo: string;
  adminApiKey: string;
  turnstileSecretKey: string;
};

type PublicEnv = {
  cvPdfUrl: string;
  cvDocxUrl: string;
  turnstileSiteKey: string;
};

function mustRead(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing env var: ${name}`);
  }
  return value;
}

export function readEnv(): Env {
  return {
    mongoUri: mustRead("MONGODB_URI"),
    mongoDatabase: process.env.MONGODB_DATABASE ?? "portfolio",
    mongoCollection: process.env.MONGODB_COLLECTION ?? "slots",
    smtpHost: mustRead("SMTP_HOST"),
    smtpPort: Number(process.env.SMTP_PORT ?? "587"),
    smtpSecure: process.env.SMTP_SECURE === "true",
    smtpUser: mustRead("SMTP_USER"),
    smtpPass: mustRead("SMTP_PASS"),
    mailFrom: mustRead("MAIL_FROM"),
    mailTo: mustRead("MAIL_TO"),
    adminApiKey: mustRead("ADMIN_API_KEY"),
    turnstileSecretKey: process.env.TURNSTILE_SECRET_KEY ?? "",
  };
}

export function readPublicEnv(): PublicEnv {
  return {
    cvPdfUrl: process.env.NEXT_PUBLIC_CV_PDF_URL ?? "",
    cvDocxUrl: process.env.NEXT_PUBLIC_CV_DOCX_URL ?? "",
    turnstileSiteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "",
  };
}
