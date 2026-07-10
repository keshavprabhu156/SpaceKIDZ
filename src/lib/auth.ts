import { SignJWT, jwtVerify } from "jose";

export type Role = "student" | "teacher" | "admin";

export interface SessionPayload {
  sub: string; // user id (e.g. student ID)
  name: string;
  role: Role;
  grade?: number;
  [key: string]: unknown;
}

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "dev-only-secret-change-in-production"
);

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
