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
  // Optional query parameters to override target year/month, e.g. ?year=2026&month=7
  const url = new URL(request.url);
  const yearParam = url.searchParams.get("year");
  const monthParam = url.searchParams.get("month");

  let targetYear: number;
  let targetMonth: number;

  if (yearParam && monthParam) {
    const py = Number.parseInt(yearParam, 10);
    const pm = Number.parseInt(monthParam, 10);
    if (!Number.isFinite(py) || !Number.isFinite(pm) || pm < 1 || pm > 12) {
      return NextResponse.json({ error: "invalid_parameters" }, { status: 400 });
    }
    targetYear = py;
    targetMonth = pm;
  } else {
    const now = new Date();
    const nextMonth = now.getMonth() === 11 ? 1 : now.getMonth() + 2;
    const nextYear = now.getMonth() === 11 ? now.getFullYear() + 1 : now.getFullYear();

    targetYear = nextYear;
    targetMonth = nextMonth;
  }

  const slots = generateSlotsForMonth(targetYear, targetMonth);
  await getContainer().upsertSlotsUseCase.execute(slots);

  return NextResponse.json({
    ok: true,
    generated: slots.length,
    month: `${nextYear}-${String(nextMonth).padStart(2, "0")}`,
  });
}
