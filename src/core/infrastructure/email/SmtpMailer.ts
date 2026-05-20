import nodemailer from "nodemailer";
import { Mailer } from "@/core/domain/ports/Mailer";
import { readEnv } from "@/core/infrastructure/config/env";

export class SmtpMailer implements Mailer {
  private transport: nodemailer.Transporter | null = null;
  private env = readEnv();

  private getTransport(): nodemailer.Transporter {
    if (!this.transport) {
      this.transport = nodemailer.createTransport({
        host: this.env.smtpHost,
        port: this.env.smtpPort,
        secure: this.env.smtpSecure,
        auth: {
          user: this.env.smtpUser,
          pass: this.env.smtpPass,
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

    await transport.sendMail({
      from: this.env.mailFrom,
      to: payload.candidateEmail,
      subject: "Confirmation de reservation d'entretien",
      text: `Bonjour ${payload.candidateName}, votre entretien est confirme du ${payload.startsAtIso} au ${payload.endsAtIso}.`,
    });

    await transport.sendMail({
      from: this.env.mailFrom,
      to: this.env.mailTo,
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

    await transport.sendMail({
      from: this.env.mailFrom,
      to: this.env.mailTo,
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
