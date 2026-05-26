import nodemailer from "nodemailer";
import { Mailer } from "@/core/domain/ports/Mailer";
import { readEnv } from "@/core/infrastructure/config/env";

export class SmtpMailer implements Mailer {
  private transport: nodemailer.Transporter | null = null;
  private env: ReturnType<typeof readEnv> | null = null;

  private getEnv() {
    return (this.env ??= readEnv());
  }

  private getTransport(): nodemailer.Transporter {
    if (!this.transport) {
      const env = this.getEnv();
      this.transport = nodemailer.createTransport({
        host: env.smtpHost,
        port: env.smtpPort,
        secure: env.smtpSecure,
        auth: {
          user: env.smtpUser,
          pass: env.smtpPass,
        },
      });
    }
    return this.transport;
  }

  async sendBookingConfirmation(payload: {
    candidateName: string;
    candidateEmail: string;
    startsAtIso: string;
    endsAtIso: string;
  }): Promise<void> {
    const transport = this.getTransport();
    const env = this.getEnv();

    await transport.sendMail({
      from: env.mailFrom,
      to: payload.candidateEmail,
      subject: "Confirmation de reservation d'entretien",
      text: `Bonjour ${payload.candidateName}, votre entretien est confirme du ${payload.startsAtIso} au ${payload.endsAtIso}.`,
    });

    await transport.sendMail({
      from: env.mailFrom,
      to: env.mailTo,
      subject: "Nouvelle reservation recue",
      text: `${payload.candidateName} (${payload.candidateEmail}) a reserve le creneau ${payload.startsAtIso} -> ${payload.endsAtIso}.`,
    });
  }

  async sendContactMessage(payload: {
    senderName: string;
    senderEmail: string;
    subject: string;
    message: string;
  }): Promise<void> {
    const transport = this.getTransport();
    const env = this.getEnv();

    await transport.sendMail({
      from: env.mailFrom,
      to: env.mailTo,
      replyTo: payload.senderEmail,
      subject: payload.subject,
      text: [
        `Nom: ${payload.senderName}`,
        `Email: ${payload.senderEmail}`,
        "",
        payload.message,
      ].join("\n"),
    });
  }

  async close(): Promise<void> {
    if (this.transport) {
      await this.transport.close();
      this.transport = null;
    }
  }
}
