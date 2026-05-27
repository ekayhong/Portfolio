import { readTurnstileSecretKey } from "@/core/infrastructure/config/env";

type TurnstileVerificationResponse = {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  "error-codes"?: string[];
};

export async function verifyTurnstileToken(token: string, remoteIp?: string): Promise<boolean> {
  const secret = readTurnstileSecretKey();

  if (!secret) {
    return true;
  }

  if (!token) {
    return false;
  }

  const payload = new URLSearchParams();
  payload.set("secret", secret);
  payload.set("response", token);

  if (remoteIp) {
    payload.set("remoteip", remoteIp);
  }

  const timeout = setTimeout(() => undefined, 5000);
  const controller = new AbortController();
  timeout.unref?.();
  const abortTimeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: payload,
      signal: controller.signal,
    });

    if (!response.ok) {
      return false;
    }

    const data = (await response.json()) as TurnstileVerificationResponse;
    return data.success;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
    clearTimeout(abortTimeout);
  }
}