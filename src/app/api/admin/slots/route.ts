import { NextRequest, NextResponse } from "next/server";
import { getContainer } from "@/core/infrastructure/di/container";
import { readAdminApiKey } from "@/core/infrastructure/config/env";

export async function PUT(request: NextRequest) {
  try {
    const adminApiKey = readAdminApiKey();
    const apiKey = request.headers.get("x-admin-api-key");
    if (!apiKey || apiKey !== adminApiKey) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const container = getContainer();
    await container.upsertSlotsUseCase.execute(body.slots);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Payload invalide." }, { status: 400 });
  }
}
