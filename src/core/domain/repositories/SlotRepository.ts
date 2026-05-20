import { Slot } from "@/core/domain/entities/Slot";

export interface SlotRepository {
  listAvailable(): Promise<Slot[]>;
  replaceMany(slots: Slot[]): Promise<void>;
  tryBookSlot(slotId: string, dayKey: string, booking: Slot["booking"]): Promise<boolean>;
}
