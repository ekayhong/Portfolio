import { NextRequest, NextResponse } from "next/server";
import { readEnv } from "@/core/infrastructure/config/env";
import { getContainer } from "@/core/infrastructure/di/container";
import { generateSlotsForMonth } from "@/core/application/generateSlotsForMonth";

export async function GET(request: NextRequest) {
  const env = readEnv();
  const apiKey = request.headers.get("x-admin-api-key");
  if (!apiKey || apiKey !== env.adminApiKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const nextMonth = now.getMonth() === 11 ? 1 : now.getMonth() + 2;
  const nextYear = now.getMonth() === 11 ? now.getFullYear() + 1 : now.getFullYear();

  const slots = generateSlotsForMonth(nextYear, nextMonth);
  await getContainer().upsertSlotsUseCase.execute(slots);

  return NextResponse.json({
    ok: true,
    generated: slots.length,
    month: `${nextYear}-${String(nextMonth).padStart(2, "0")}`,
  });
}
