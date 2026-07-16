import { cookies } from "next/headers";
import { verifySession, SESSION_COOKIE, type SessionPayload } from "@/services/auth";

/** Read the current session inside Server Components / Route Handlers. */
export async function getSession(): Promise<SessionPayload | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySession(token);
}
