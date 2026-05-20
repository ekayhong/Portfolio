import { NextResponse } from "next/server";
import { getContainer } from "@/core/infrastructure/di/container";

export async function GET() {
  const container = getContainer();
  const slots = await container.listAvailableSlotsUseCase.execute();
  return NextResponse.json({ slots });
}
