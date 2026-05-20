import { Slot } from "@/core/domain/entities/Slot";
import { SlotRepository } from "@/core/domain/repositories/SlotRepository";
import { getMongoCollection } from "@/core/infrastructure/cosmos/MongoClientFactory";

export class CosmosSlotRepository implements SlotRepository {
	async listAvailable(): Promise<Slot[]> {
		const col = await getMongoCollection();
		const now = new Date().toISOString();
		return col
			.find({ status: "available", startsAtIso: { $gt: now } })
			.sort({ startsAtIso: 1 })
			.project<Slot>({ _id: 0, id: 1, dayKey: 1, startsAtIso: 1, endsAtIso: 1, status: 1, booking: 1 })
			.toArray();
	}

	async replaceMany(slots: Slot[]): Promise<void> {
		const col = await getMongoCollection();
		await Promise.all(
			slots.map((slot) =>
				col.replaceOne({ id: slot.id }, slot, { upsert: true })
			)
		);
	}

	async tryBookSlot(slotId: string, _dayKey: string, booking: Slot["booking"]): Promise<boolean> {
		if (!booking) return false;
		const col = await getMongoCollection();
		const result = await col.findOneAndUpdate(
			{ id: slotId, status: "available" },
			{ $set: { status: "booked", booking } },
			{ returnDocument: "after" }
		);
		return result !== null;
	}
}
