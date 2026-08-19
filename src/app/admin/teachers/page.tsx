import type { Metadata } from "next";
import PortalLayout from "@/layouts/PortalLayout";
import PortalPageHeader from "@/components/common/PortalPageHeader";
import { adminSidebar } from "@/configs/portalSidebarConfig";
import { getSession } from "@/utils/session";
import { getTeacherDirectory } from "@/services/adminService";

export const metadata: Metadata = { title: "Teachers" };
export const dynamic = "force-dynamic";

export default async function TeachersDirectoryPage() {
  const session = await getSession();
  const teachers = await getTeacherDirectory();

  return (
    <PortalLayout
      title="Teachers"
      role="Administrator"
      roleValue="admin"
      userName={session?.name ?? "Administrator"}
      userId={session?.sub ?? "—"}
      nav={adminSidebar}
    >
      <PortalPageHeader eyebrow={`${teachers.length} across the platform`} title="Teachers" />

      <div className="mt-6 overflow-hidden rounded-lg border border-star/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-star/10 bg-white/[0.02] text-left text-xs text-star/45">
              <th className="px-4 py-2 font-medium">Teacher</th>
              <th className="px-4 py-2 font-medium">School</th>
              <th className="px-4 py-2 font-medium">Classes</th>
              <th className="px-4 py-2 font-medium">Students</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((t) => (
              <tr key={t.id} className="border-b border-star/[0.06] last:border-0">
                <td className="px-4 py-2.5">
                  <p className="font-medium text-star">{t.name}</p>
                  <p className="mt-0.5 text-xs text-star/40">{t.email}</p>
                </td>
                <td className="px-4 py-2.5 text-star/70">{t.schoolName}</td>
                <td className="px-4 py-2.5 text-star/70">{t.classCount}</td>
                <td className="px-4 py-2.5 text-star/70">{t.studentCount}</td>
              </tr>
            ))}
            {teachers.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-star/45">
                  No teachers yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </PortalLayout>
  );
}
