import { z } from "zod";
import { Mailer } from "@/core/domain/ports/Mailer";
import { SlotRepository } from "@/core/domain/repositories/SlotRepository";

const inputSchema = z.object({
  slotId: z.string().min(1),
  dayKey: z.string().min(1),
  fullName: z.string().min(2),
  email: z.string().email(),
  message: z.string().max(1000).optional(),
  startsAtIso: z.string().min(1),
  endsAtIso: z.string().min(1),
  gdprConsent: z.literal(true),
});

export type BookSlotInput = z.infer<typeof inputSchema>;
export type BookSlotResult = { ok: true } | { ok: false; reasonCode: "slot_unavailable" };

export class BookSlotUseCase {
  constructor(
    private readonly slotRepository: SlotRepository,
    private readonly mailer: Mailer,
  ) {}

  async execute(rawInput: BookSlotInput): Promise<BookSlotResult> {
    const input = inputSchema.parse(rawInput);
    const wasBooked = await this.slotRepository.tryBookSlot(input.slotId, input.dayKey, {
      fullName: input.fullName,
      email: input.email,
      message: input.message,
      bookedAtIso: new Date().toISOString(),
    });

    if (!wasBooked) {
      return { ok: false, reasonCode: "slot_unavailable" };
    }

    // Email non bloquant: l'utilisateur n'est pas penalise si le SMTP est momentanement indisponible.
    this.mailer
      .sendBookingConfirmation({
        candidateName: input.fullName,
        candidateEmail: input.email,
        startsAtIso: input.startsAtIso,
        endsAtIso: input.endsAtIso,
      })
      .catch(() => undefined);

    return { ok: true };
  }
}
