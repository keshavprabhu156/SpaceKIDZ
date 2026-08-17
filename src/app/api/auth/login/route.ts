import { NextResponse } from "next/server";
import { findByEmail, verifyPassword } from "@/services/userService";
import { signSession, SESSION_COOKIE } from "@/services/tokenService";
import { validateLogin } from "@/validation/authValidation";
import { clientIp, rateLimit } from "@/utils/rateLimit";

// 10 attempts per IP per 5 minutes, and 5 per account per 15 minutes — enough
// for a forgetful student, far too slow to brute-force a password.
const IP_LIMIT = { max: 10, windowMs: 5 * 60 * 1000 };
const ACCOUNT_LIMIT = { max: 5, windowMs: 15 * 60 * 1000 };

export async function POST(req: Request) {
  const { email, password, remember } = await req.json().catch(() => ({}));

  const invalid = validateLogin({ email, password });
  if (invalid) {
    return NextResponse.json({ error: invalid }, { status: 400 });
  }

  const ip = clientIp(req);
  const byIp = rateLimit(`login:ip:${ip}`, IP_LIMIT.max, IP_LIMIT.windowMs);
  const byAccount = rateLimit(
    `login:acct:${String(email).toLowerCase().trim()}`,
    ACCOUNT_LIMIT.max,
    ACCOUNT_LIMIT.windowMs
  );

  if (!byIp.allowed || !byAccount.allowed) {
    const retryAfter = Math.max(byIp.retryAfter, byAccount.retryAfter);
    return NextResponse.json(
      { error: `Too many attempts. Try again in ${retryAfter} seconds.` },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  const user = await findByEmail(email);
  if (!user || !(await verifyPassword(user, password))) {
    // Deliberately identical message for unknown email vs wrong password, so
    // the endpoint can't be used to discover which accounts exist.
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await signSession({
    sub: user.id,
    name: user.name,
    role: user.role,
    grade: user.grade,
  });

  const res = NextResponse.json({
    ok: true,
    role: user.role,
    name: user.name,
    id: user.id,
  });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: remember ? 60 * 60 * 24 * 7 : 60 * 60 * 8,
  });
  return res;
}
