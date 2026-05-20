import { NextRequest, NextResponse } from "next/server";
import { getContainer } from "@/core/infrastructure/di/container";
import { resolveLocale, siteContent } from "@/content/siteContent";

export async function POST(request: NextRequest) {
  const locale = resolveLocale(request.cookies.get("locale")?.value);
  const copy = siteContent[locale];

  try {
    const container = getContainer();
    const body = await request.json();

    const result = await container.bookSlotUseCase.execute(body);
    if (!result.ok) {
      return NextResponse.json({ ok: false, reason: copy.api.slotUnavailable }, { status: 409 });
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ ok: false, reason: copy.api.invalidRequest }, { status: 400 });
  }
}
