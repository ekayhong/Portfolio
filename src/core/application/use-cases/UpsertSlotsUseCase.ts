import { z } from "zod";
import { Slot } from "@/core/domain/entities/Slot";
import { SlotRepository } from "@/core/domain/repositories/SlotRepository";

const slotSchema = z.object({
  id: z.string().min(1),
  dayKey: z.string().min(1),
  startsAtIso: z.string().min(1),
  endsAtIso: z.string().min(1),
  status: z.enum(["available", "booked"]),
});

export class UpsertSlotsUseCase {
  constructor(private readonly slotRepository: SlotRepository) {}

  async execute(rawSlots: unknown): Promise<void> {
    const parsed = z.array(slotSchema).parse(rawSlots);
    const slots: Slot[] = parsed.map((slot) => ({ ...slot }));
    await this.slotRepository.replaceMany(slots);
  }
}
