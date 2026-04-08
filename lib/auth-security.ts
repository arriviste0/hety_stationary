import crypto from "crypto";

const isProduction = process.env.NODE_ENV === "production";

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

declare global {
  var __hetyRateLimitStore: Map<string, RateLimitBucket> | undefined;
}

const rateLimitStore = global.__hetyRateLimitStore || new Map<string, RateLimitBucket>();
global.__hetyRateLimitStore = rateLimitStore;

export const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  secure: isProduction,
  maxAge: 60 * 60 * 24 * 7
};

export const VERIFICATION_CODE_TTL_MS = 10 * 60 * 1000;
export const VERIFICATION_RESEND_COOLDOWN_MS = 60 * 1000;
export const VERIFICATION_MAX_ATTEMPTS = 5;

function getBaseSecret() {
  const secret = process.env.JWT_SECRET || "";
  if (!secret) {
    throw new Error("Missing JWT_SECRET environment variable.");
  }
  return secret;
}

export function getRequestClientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip") || "unknown";
}

export function consumeRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const bucket = rateLimitStore.get(key);

  if (!bucket || bucket.resetAt <= now) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + windowMs
    });
    return { allowed: true, retryAfterMs: 0 };
  }

  if (bucket.count >= limit) {
    return {
      allowed: false,
      retryAfterMs: Math.max(bucket.resetAt - now, 0)
    };
  }

  bucket.count += 1;
  rateLimitStore.set(key, bucket);
  return { allowed: true, retryAfterMs: 0 };
}

export function hashVerificationCode(email: string, code: string) {
  return crypto
    .createHmac("sha256", getBaseSecret())
    .update(`${String(email || "").trim().toLowerCase()}:${String(code || "").trim()}`)
    .digest("hex");
}
