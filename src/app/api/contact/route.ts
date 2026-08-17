import { NextResponse } from "next/server";
import { validateContactEnquiry } from "@/validation/contactValidation";
import type { ContactEnquiry } from "@/types/contact";

/**
 * Contact / partnership enquiries.
 * PRODUCTION: persist to PostgreSQL (Enquiry model) and notify the
 * partnerships inbox; until then submissions are logged server-side so the
 * flow is fully testable.
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as ContactEnquiry | null;

  const invalid = validateContactEnquiry(body);
  if (invalid) {
    return NextResponse.json({ error: invalid }, { status: 400 });
  }

  const { name, email, organization } = body!;
  console.info("[contact] enquiry received", {
    name,
    email,
    organization: organization ?? "—",
  });

  return NextResponse.json({ ok: true });
}
