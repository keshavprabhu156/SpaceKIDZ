import type { Metadata } from "next";
import PortalLayout from "@/layouts/PortalLayout";
import PortalPageHeader from "@/components/common/PortalPageHeader";
import EnquiryHandledToggle from "@/components/common/EnquiryHandledToggle";
import { adminSidebar } from "@/configs/portalSidebarConfig";
import { getSession } from "@/utils/session";
import { getEnquiries } from "@/services/adminService";

export const metadata: Metadata = { title: "Enquiries" };
export const dynamic = "force-dynamic";

export default async function EnquiriesPage() {
  const session = await getSession();
  const enquiries = await getEnquiries();
  const openCount = enquiries.filter((e) => !e.handled).length;

  return (
    <PortalLayout
      title="Enquiries"
      role="Administrator"
      roleValue="admin"
      userName={session?.name ?? "Administrator"}
      userId={session?.sub ?? "—"}
      nav={adminSidebar}
    >
      <PortalPageHeader eyebrow="Contact form submissions" title="Enquiries" />
      <p className="mt-2 text-sm text-star/50">
        {openCount === 0
          ? "Nothing outstanding."
          : `${openCount} open of ${enquiries.length} total.`}
      </p>

      <div className="mt-6 space-y-3">
        {enquiries.length === 0 && (
          <p className="rounded-lg border border-star/10 px-4 py-6 text-center text-sm text-star/45">
            No enquiries yet — submissions from the public contact form will show up here.
          </p>
        )}
        {enquiries.map((e) => (
          <div key={e.id} className="rounded-lg border border-star/10 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-star">
                  {e.name} <span className="font-normal text-star/45">· {e.email}</span>
                </p>
                {e.organization && (
                  <p className="mt-0.5 text-xs text-star/45">{e.organization}</p>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="text-xs text-star/35">
                  {new Date(e.createdAt).toLocaleDateString()}
                </span>
                <EnquiryHandledToggle id={e.id} handled={e.handled} />
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-star/70">{e.message}</p>
          </div>
        ))}
      </div>
    </PortalLayout>
  );
}
