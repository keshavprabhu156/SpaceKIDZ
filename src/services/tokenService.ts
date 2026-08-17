import { SignJWT, jwtVerify } from "jose";
import type { Role, SessionPayload } from "@/types/user";

/** JWT session signing/verification (server-side). */

// Re-exported so existing `import { type Role } from "@/services/tokenService"`
// call sites keep working.
export type { Role, SessionPayload };

const DEV_FALLBACK_SECRET = "dev-only-secret-change-in-production";
const configuredSecret = process.env.JWT_SECRET;

// Refuse to boot in production without a real secret. Falling back to a value
// that is committed to the repo would let anyone forge an admin session.
if (process.env.NODE_ENV === "production" && !configuredSecret) {
  throw new Error(
    "JWT_SECRET is not set. Refusing to start in production with the development fallback secret."
  );
}
if (!configuredSecret) {
  console.warn(
    "[auth] JWT_SECRET is not set — using the development fallback. Never do this in production."
  );
}

const SECRET = new TextEncoder().encode(configuredSecret ?? DEV_FALLBACK_SECRET);

export const SESSION_COOKIE = "isc_session";
const SESSION_HOURS = 24 * 7;

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_HOURS}h`)
    .sign(SECRET);
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}
