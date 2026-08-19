import { NextResponse } from "next/server";
import { getSession } from "@/utils/session";
import { setEnquiryHandled } from "@/services/adminService";

/**
 * PATCH /api/admin/enquiries/:id — toggle an enquiry's handled state.
 *
 * SECURITY: middleware only protects PAGE routes (/admin/:path*), not API
 * routes — this handler is reachable at /api/admin/... which middleware's
 * matcher does not cover. Every admin API route must check the role itself,
 * the same way the rest of this codebase's route handlers do.
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || (session.role !== "admin" && session.role !== "super_admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { handled } = await req.json().catch(() => ({ handled: true }));

  await setEnquiryHandled(id, Boolean(handled));
  return NextResponse.json({ ok: true });
}
