import { z } from "zod";

type Env = {
  mongoUri: string;
  mongoDatabase: string;
  mongoCollection: string;
};

type MailEnv = {
  smtpHost: string;
  smtpPort: number;
  smtpSecure: boolean;
  smtpUser: string;
  smtpPass: string;
  mailFrom: string;
  mailTo: string;
};

type PublicEnv = {
  cvPdfUrl: string;
  cvDocxUrl: string;
  turnstileSiteKey: string;
};

const boolFromEnv = z.preprocess((value) => {
  if (value === undefined || value === null || value === "") {
    return false;
  }

  if (typeof value === "boolean") {
    return value;
  }

  const normalized = String(value).trim().toLowerCase();
  if (["true", "1", "yes", "y", "on"].includes(normalized)) {
    return true;
  }

  if (["false", "0", "no", "n", "off"].includes(normalized)) {
    return false;
  }

  return value;
}, z.boolean());

const envSchema = z.object({
  MONGODB_URI: z
    .string()
    .trim()
    .min(1, "MONGODB_URI is required")
    .refine(
      (value) => value.startsWith("mongodb://") || value.startsWith("mongodb+srv://"),
      "MONGODB_URI must start with mongodb:// or mongodb+srv://",
    ),
  MONGODB_DATABASE: z.string().min(1).default("portfolio"),
  MONGODB_COLLECTION: z.string().min(1).default("slots"),
});

const mailEnvSchema = z.object({
  SMTP_HOST: z.string().min(1, "SMTP_HOST is required"),
  SMTP_PORT: z.coerce
    .number()
    .int("SMTP_PORT must be an integer")
    .min(1, "SMTP_PORT must be >= 1")
    .max(65535, "SMTP_PORT must be <= 65535")
    .default(587),
  SMTP_SECURE: boolFromEnv,
  SMTP_USER: z.string().min(1, "SMTP_USER is required"),
  SMTP_PASS: z.string().min(1, "SMTP_PASS is required"),
  MAIL_FROM: z.string().min(1, "MAIL_FROM is required").email("MAIL_FROM must be a valid email"),
  MAIL_TO: z.string().min(1, "MAIL_TO is required").email("MAIL_TO must be a valid email"),
});

const turnstileEnvSchema = z.object({
  TURNSTILE_SECRET_KEY: z.string().default(""),
});

const publicEnvSchema = z.object({
  NEXT_PUBLIC_CV_PDF_URL: z.string().default(""),
  NEXT_PUBLIC_CV_DOCX_URL: z.string().default(""),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().default(""),
});

let cachedEnv: Env | null = null;
let cachedPublicEnv: PublicEnv | null = null;

function formatValidationError(scope: string, issues: z.core.$ZodIssue[]): Error {
  const details = issues
    .map((issue) => {
      const path = issue.path.length > 0 ? issue.path.join(".") : "unknown";
      return `- ${path}: ${issue.message}`;
    })
    .join("\n");

  return new Error(`Invalid ${scope} environment configuration:\n${details}`);
}

export function readEnv(): Env {
  if (cachedEnv) {
    return cachedEnv;
  }

  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    throw formatValidationError("server", parsed.error.issues);
  }

  cachedEnv = {
    mongoUri: parsed.data.MONGODB_URI,
    mongoDatabase: parsed.data.MONGODB_DATABASE,
    mongoCollection: parsed.data.MONGODB_COLLECTION,
  };

  return cachedEnv;
}

export function readAdminApiKey(): string {
  const value = process.env.ADMIN_API_KEY?.trim();

  if (!value) {
    throw new Error("ADMIN_API_KEY is required");
  }

  return value;
}

export function readMailEnv(): MailEnv {
  const parsed = mailEnvSchema.safeParse(process.env);

  if (!parsed.success) {
    throw formatValidationError("mail", parsed.error.issues);
  }

  return {
    smtpHost: parsed.data.SMTP_HOST,
    smtpPort: parsed.data.SMTP_PORT,
    smtpSecure: parsed.data.SMTP_SECURE,
    smtpUser: parsed.data.SMTP_USER,
    smtpPass: parsed.data.SMTP_PASS,
    mailFrom: parsed.data.MAIL_FROM,
    mailTo: parsed.data.MAIL_TO,
  };
}

export function readTurnstileSecretKey(): string {
  const parsed = turnstileEnvSchema.safeParse(process.env);

  if (!parsed.success) {
    throw formatValidationError("turnstile", parsed.error.issues);
  }

  return parsed.data.TURNSTILE_SECRET_KEY;
}

export function readPublicEnv(): PublicEnv {
  if (cachedPublicEnv) {
    return cachedPublicEnv;
  }

  cachedPublicEnv = {
    cvPdfUrl: process.env.NEXT_PUBLIC_CV_PDF_URL ?? "",
    cvDocxUrl: process.env.NEXT_PUBLIC_CV_DOCX_URL ?? "",
    turnstileSiteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "",
  };

  return cachedPublicEnv;
}
