import { NextResponse } from "next/server";
import { getContainer } from "@/core/infrastructure/di/container";

export async function GET() {
  try {
    const container = getContainer();
    const slots = await container.listAvailableSlotsUseCase.execute();
    return NextResponse.json({ slots });
  } catch (error: any) {
    const message = error?.message ?? "unknown_error";
    console.error("[api/slots] failed to load available slots:", error);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
