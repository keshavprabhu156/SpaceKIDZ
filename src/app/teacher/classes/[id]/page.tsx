import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PortalLayout from "@/layouts/PortalLayout";
import PortalPageHeader from "@/components/common/PortalPageHeader";
import { teacherSidebar } from "@/configs/portalSidebarConfig";
import { getSession } from "@/utils/session";
import { assertOwnsClass, getClassRoster } from "@/services/teacherService";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return { title: `Roster — ${id}` };
}

export const dynamic = "force-dynamic";

function scoreBadge(pct: number | null) {
  if (pct === null) return <span className="badge-neutral">No attempts</span>;
  if (pct >= 70) return <span className="badge-ok">{pct}%</span>;
  if (pct >= 50) return <span className="badge-warn">{pct}%</span>;
  return <span className="badge-danger">{pct}%</span>;
}

function activityLabel(daysInactive: number | null) {
  if (daysInactive === null) return "Never active";
  if (daysInactive === 0) return "Active today";
  return `Active ${daysInactive}d ago`;
}

export default async function ClassRosterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();
  if (!session) {
    return (
      <PortalLayout title="Class roster" role="Teacher" roleValue="teacher" userName="—" userId="—" nav={teacherSidebar}>
        <p className="text-sm text-star/60">Your session has expired. Please log in again.</p>
      </PortalLayout>
    );
  }

  // SECURITY: never trust `id` from the URL — a teacher must not be able to
  // view another teacher's (or another school's) roster by guessing a class
  // id. A 404 here reveals nothing about whether the class exists at all.
  try {
    await assertOwnsClass(session.sub, id);
  } catch {
    notFound();
  }

  const roster = await getClassRoster(id);
  if (!roster) notFound();

  return (
    <PortalLayout
      title="Class roster"
      role="Teacher"
      roleValue="teacher"
      userName={session.name}
      userId={session.sub}
      nav={teacherSidebar}
    >
      <PortalPageHeader eyebrow="Roster" title={roster.className} />
      <p className="mt-1 text-sm text-star/50">{roster.students.length} students</p>

      <div className="mt-6 overflow-hidden rounded-lg border border-star/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-star/10 bg-white/[0.02] text-left text-xs text-star/45">
              <th className="px-4 py-2.5 font-medium">Student</th>
              <th className="px-4 py-2.5 font-medium">XP</th>
              <th className="px-4 py-2.5 font-medium">Activity</th>
              <th className="px-4 py-2.5 font-medium">Tests taken</th>
              <th className="px-4 py-2.5 font-medium">Latest score</th>
            </tr>
          </thead>
          <tbody>
            {roster.students.map((s) => (
              <tr key={s.id} className="border-b border-star/[0.06] last:border-0">
                <td className="px-4 py-3">
                  <p className="font-medium text-star">{s.name}</p>
                  <p className="mt-0.5 font-mono text-[10px] text-star/35">{s.id}</p>
                </td>
                <td className="px-4 py-3 text-star/70">{s.xp.toLocaleString()}</td>
                <td className="px-4 py-3 text-star/60">{activityLabel(s.daysInactive)}</td>
                <td className="px-4 py-3 text-star/70">{s.attemptCount}</td>
                <td className="px-4 py-3">{scoreBadge(s.latestScorePct)}</td>
              </tr>
            ))}
            {roster.students.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-star/45">
                  No students in this class yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </PortalLayout>
  );
}
