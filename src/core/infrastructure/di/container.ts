import { BookSlotUseCase } from "@/core/application/use-cases/BookSlotUseCase";
import { ListAvailableSlotsUseCase } from "@/core/application/use-cases/ListAvailableSlotsUseCase";
import { SendContactMessageUseCase } from "@/core/application/use-cases/SendContactMessageUseCase";
import { UpsertSlotsUseCase } from "@/core/application/use-cases/UpsertSlotsUseCase";
import { CosmosSlotRepository } from "@/core/infrastructure/repositories/CosmosSlotRepository";
import { SmtpMailer } from "@/core/infrastructure/email/SmtpMailer";
import { closeMongoClient } from "@/core/infrastructure/cosmos/MongoClientFactory";

let _container: (ReturnType<typeof buildContainer> & { mailer: SmtpMailer }) | null = null;

export function buildContainer() {
  const slotRepository = new CosmosSlotRepository();
  const mailer = new SmtpMailer();

  return {
    listAvailableSlotsUseCase: new ListAvailableSlotsUseCase(slotRepository),
    bookSlotUseCase: new BookSlotUseCase(slotRepository, mailer),
    sendContactMessageUseCase: new SendContactMessageUseCase(mailer),
    upsertSlotsUseCase: new UpsertSlotsUseCase(slotRepository),
    mailer,
  };
}

export function getContainer() {
  return (_container ??= buildContainer());
}

export async function cleanupContainer(): Promise<void> {
  if (_container) {
    await Promise.all([
      _container.mailer.close(),
      closeMongoClient(),
    ]);
    _container = null;
  }
}
