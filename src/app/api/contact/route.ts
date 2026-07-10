import { NextResponse } from "next/server";

/**
 * Contact / partnership enquiries.
 * PRODUCTION: persist to PostgreSQL (Enquiry model) and notify the
 * partnerships inbox; until then submissions are logged server-side so the
 * flow is fully testable.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const { name, email, organization, message } = body ?? {};

  if (!name?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "Name and message are required" }, { status: 400 });
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
  }

  console.info("[contact] enquiry received", { name, email, organization: organization ?? "—" });
  return NextResponse.json({ ok: true });
}
