import { NextRequest, NextResponse } from "next/server";
import { getContainer } from "@/core/infrastructure/di/container";
import { consumeRateLimit } from "@/core/infrastructure/security/rateLimit";
import { verifyTurnstileToken } from "@/core/infrastructure/security/turnstile";

const CONTACT_RATE_LIMIT = {
  limit: 5,
  windowMs: 10 * 60 * 1000,
};

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);
    const rateLimitResult = consumeRateLimit(`contact:${clientIp}`, CONTACT_RATE_LIMIT.limit, CONTACT_RATE_LIMIT.windowMs);

    if (!rateLimitResult.allowed) {
      return NextResponse.json({ ok: false, reason: "rate_limited" }, { status: 429 });
    }

    const container = getContainer();
    const body = await request.json();

    if (String(body.website ?? body.honeypot ?? "").trim()) {
      return NextResponse.json({ ok: false, reason: "bot_detected" }, { status: 400 });
    }

    const turnstileToken = String(body["cf-turnstile-response"] ?? body.turnstileToken ?? "").trim();
    const turnstileOk = await verifyTurnstileToken(turnstileToken, clientIp);

    if (!turnstileOk) {
      return NextResponse.json({ ok: false, reason: "captcha_failed" }, { status: 403 });
    }

    const result = await container.sendContactMessageUseCase.execute(body);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[contact] error:", err);
    return NextResponse.json({ ok: false, reason: "invalid_request" }, { status: 400 });
  }
}