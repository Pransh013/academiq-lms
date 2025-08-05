import "server-only";

import { type ArcjetNext, request as arcjetRequest } from "@arcjet/next";
import { NextRequest } from "next/server";

export async function verifyRequest(
  aj: ArcjetNext<{
    fingerprint: string | number | boolean;
  }>,
  sessionId: string,
  req?: NextRequest
) {
  const request = req ?? (await arcjetRequest());
  const decision = await aj.protect(request, { fingerprint: sessionId });

  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return "Too many requests. Please try again later.";
    }
    if (decision.reason.isBot()) {
      return "Request blocked: bot detected.";
    }
    return "Request denied by security policy.";
  }

  return null;
}
