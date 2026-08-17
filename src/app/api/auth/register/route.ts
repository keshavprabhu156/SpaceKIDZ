import { NextResponse } from "next/server";
import { createStudent } from "@/services/userService";
import { signSession, SESSION_COOKIE } from "@/services/tokenService";
import { validateRegistration } from "@/validation/authValidation";
import type { RegisterPayload } from "@/types/user";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as RegisterPayload | null;

  const invalid = validateRegistration(body);
  if (invalid) {
    return NextResponse.json({ error: invalid }, { status: 400 });
  }

  const { email, password, profile } = body!;
  const grade = Number(profile.grade);

  try {
    const user = await createStudent({ email, password, profile: { ...profile, grade } });
    const token = await signSession({
      sub: user.id,
      name: user.name,
      role: "student",
      grade,
    });
    const res = NextResponse.json({ ok: true, studentId: user.id, name: user.name });
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Registration failed" },
      { status: 409 }
    );
  }
}
