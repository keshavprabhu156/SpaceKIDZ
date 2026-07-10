import { NextResponse } from "next/server";
import { findByEmail, verifyPassword } from "@/lib/users";
import { signSession, SESSION_COOKIE } from "@/lib/auth";

export async function POST(req: Request) {
  const { email, password, remember } = await req.json().catch(() => ({}));

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  const user = findByEmail(email);
  if (!user || !verifyPassword(user, password)) {
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
