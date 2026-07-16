import { NextResponse } from "next/server";
import { findByEmail } from "@/lib/users";

/**
 * Password-reset request. Always answers 200 to prevent account enumeration.
 * PRODUCTION: generate a single-use token (store hash + expiry in PostgreSQL)
 * and send it via the transactional email provider; the /reset/[token] page
 * slots in beside /login.
 */
export async function POST(req: Request) {
  const { email } = await req.json().catch(() => ({}));
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
  }
  const user = await findByEmail(email);
  if (user) {
    console.info(`[auth] password reset requested for ${user.id} (email delivery pending integration)`);
  }
  return NextResponse.json({ ok: true });
}
