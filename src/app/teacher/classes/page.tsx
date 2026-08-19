import type { Metadata } from "next";
import Link from "next/link";
import PortalLayout from "@/layouts/PortalLayout";
import PortalPageHeader from "@/components/common/PortalPageHeader";
import { teacherSidebar } from "@/configs/portalSidebarConfig";
import { getSession } from "@/utils/session";
import { getTeacherOverview } from "@/services/teacherService";

export const metadata: Metadata = { title: "Your classes" };
export const dynamic = "force-dynamic";

export default async function TeacherClassesPage() {
  const session = await getSession();
  if (!session) {
    return (
      <PortalLayout title="Your classes" role="Teacher" roleValue="teacher" userName="—" userId="—" nav={teacherSidebar}>
        <p className="text-sm text-star/60">Your session has expired. Please log in again.</p>
      </PortalLayout>
    );
  }

  const overview = await getTeacherOverview(session.sub);

  return (
    <PortalLayout
      title="Your classes"
      role="Teacher"
      roleValue="teacher"
      userName={overview?.teacherName ?? session.name}
      userId={session.sub}
      nav={teacherSidebar}
    >
      <PortalPageHeader eyebrow={overview?.schoolName ?? ""} title="Your classes" />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(overview?.classes ?? []).map((c) => (
          <Link key={c.id} href={`/teacher/classes/${c.id}`} className="card-edu block !p-5 hover:border-electric/40">
            <p className="font-display text-lg font-semibold text-star">{c.name}</p>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-star/55">{c.studentCount} students</span>
              <span className="text-star/55">
                {c.avgTestScorePct !== null ? `${c.avgTestScorePct}% avg.` : "No attempts yet"}
              </span>
            </div>
            <span className="mt-3 inline-block text-xs text-electric">View roster →</span>
          </Link>
        ))}
        {(!overview || overview.classes.length === 0) && (
          <p className="text-sm text-star/45">No classes yet.</p>
        )}
      </div>
    </PortalLayout>
  );
}
