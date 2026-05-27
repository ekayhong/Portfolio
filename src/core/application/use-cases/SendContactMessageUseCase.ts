import { z } from "zod";
import { Mailer } from "@/core/domain/ports/Mailer";

const inputSchema = z.object({
  senderName: z.string().trim().min(2).max(120),
  senderEmail: z.string().trim().email(),
  subject: z.string().trim().min(3).max(140),
  message: z.string().trim().min(10).max(4000),
});

export type SendContactMessageInput = z.infer<typeof inputSchema>;
export type SendContactMessageResult = { ok: true } | { ok: false; reasonCode: "invalid_message" };

export class SendContactMessageUseCase {
  constructor(private readonly mailer: Mailer) {}

  async execute(rawInput: SendContactMessageInput): Promise<SendContactMessageResult> {
    const input = inputSchema.parse(rawInput);

    await this.mailer.sendContactMessage({
      senderName: input.senderName,
      senderEmail: input.senderEmail,
      subject: input.subject,
      message: input.message,
    });

    return { ok: true };
  }
}