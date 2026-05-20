import { Slot } from "@/core/domain/entities/Slot";
import { SlotRepository } from "@/core/domain/repositories/SlotRepository";

export class ListAvailableSlotsUseCase {
  constructor(private readonly slotRepository: SlotRepository) {}

  async execute(): Promise<Slot[]> {
    return this.slotRepository.listAvailable();
  }
}
