import { NextResponse } from "next/server";
import { createStudent, type StudentProfile } from "@/services/users";
import { signSession, SESSION_COOKIE } from "@/services/auth";

const required: (keyof StudentProfile)[] = [
  "fullName",
  "dateOfBirth",
  "gender",
  "grade",
  "schoolName",
  "phone",
  "parentName",
  "parentContact",
  "city",
  "state",
  "country",
  "language",
  "timezone",
];

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const { email, password, profile } = body as {
    email?: string;
    password?: string;
    profile?: StudentProfile;
  };

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
  }
  if (!password || password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }
  if (!profile) return NextResponse.json({ error: "Profile is required" }, { status: 400 });

  for (const field of required) {
    if (profile[field] === undefined || profile[field] === "") {
      return NextResponse.json({ error: `Missing field: ${field}` }, { status: 400 });
    }
  }
  const grade = Number(profile.grade);
  if (grade < 4 || grade > 10) {
    return NextResponse.json({ error: "Grade must be between 4 and 10" }, { status: 400 });
  }

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
