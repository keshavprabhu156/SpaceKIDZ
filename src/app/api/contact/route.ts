import { NextResponse } from "next/server";
import { validateContactEnquiry } from "@/validation/contactValidation";
import { prisma } from "@/services/prisma";
import type { ContactEnquiry } from "@/types/contact";

/**
 * Contact / partnership enquiries — persisted so an admin can actually read
 * them at /admin/enquiries. Previously this only console.log'd the
 * submission, so every enquiry a school ever sent was silently discarded.
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as ContactEnquiry | null;

  const invalid = validateContactEnquiry(body);
  if (invalid) {
    return NextResponse.json({ error: invalid }, { status: 400 });
  }

  const { name, email, organization, message } = body!;
  await prisma.enquiry.create({
    data: { name, email, organization: organization || null, message },
  });

  return NextResponse.json({ ok: true });
}
