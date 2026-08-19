import type { Metadata } from "next";
import PortalLayout from "@/layouts/PortalLayout";
import PortalPageHeader from "@/components/common/PortalPageHeader";
import StudentDirectoryTable from "@/components/common/StudentDirectoryTable";
import { adminSidebar } from "@/configs/portalSidebarConfig";
import { getSession } from "@/utils/session";
import { getStudentDirectory } from "@/services/adminService";

export const metadata: Metadata = { title: "Students" };
export const dynamic = "force-dynamic";

export default async function StudentsDirectoryPage() {
  const session = await getSession();
  const students = await getStudentDirectory();

  return (
    <PortalLayout
      title="Students"
      role="Administrator"
      roleValue="admin"
      userName={session?.name ?? "Administrator"}
      userId={session?.sub ?? "—"}
      nav={adminSidebar}
    >
      <PortalPageHeader eyebrow={`${students.length} across the platform`} title="Students" />
      <div className="mt-6">
        <StudentDirectoryTable rows={students} />
      </div>
    </PortalLayout>
  );
}
