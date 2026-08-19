import type { Metadata } from "next";
import Link from "next/link";
import PortalLayout from "@/layouts/PortalLayout";
import PortalPageHeader from "@/components/common/PortalPageHeader";
import ChapterScoreChart from "@/components/common/ChapterScoreChart";
import { teacherSidebar } from "@/configs/portalSidebarConfig";
import { getSession } from "@/utils/session";
import {
  getClassChapterPerformance,
  getTeacherOverview,
} from "@/services/teacherService";

export const metadata: Metadata = { title: "Teacher dashboard" };
export const dynamic = "force-dynamic";

/** "Dr. Meera Nair" -> "Dr. Meera"; "Meera Nair" -> "Meera" — a bare first
 *  token breaks on titled names ("Dr.", "Mr.", "Ms."). */
function firstName(fullName: string): string {
  const parts = fullName.split(" ");
  return parts[0].endsWith(".") ? parts.slice(0, 2).join(" ") : parts[0];
}

export default async function TeacherPortal() {
  const session = await getSession();
  if (!session) {
    return (
      <PortalLayout title="Teacher dashboard" role="Teacher" roleValue="teacher" userName="—" userId="—" nav={teacherSidebar}>
        <p className="text-sm text-star/60">Your session has expired. Please log in again.</p>
      </PortalLayout>
    );
  }

  const overview = await getTeacherOverview(session.sub);

  if (!overview) {
    return (
      <PortalLayout
        title="Teacher dashboard"
        role="Teacher"
        roleValue="teacher"
        userName={session.name}
        userId={session.sub}
        nav={teacherSidebar}
      >
        <p className="text-sm text-star/60">
          Your teacher profile isn&apos;t set up yet. Contact your school administrator.
        </p>
      </PortalLayout>
    );
  }

  // Chapter performance for her first class — the dashboard's headline view.
  // (With more than one class this becomes a per-class selector.)
  const primaryClass = overview.classes[0];
  const chapters = primaryClass
    ? await getClassChapterPerformance(primaryClass.id)
    : [];

  return (
    <PortalLayout
      title="Teacher dashboard"
      role="Teacher"
      roleValue="teacher"
      userName={overview.teacherName}
      userId={overview.teacherId}
      nav={teacherSidebar}
    >
      <PortalPageHeader
        eyebrow={overview.schoolName}
        title={`Welcome back, ${firstName(overview.teacherName)}`}
      />

      {/* ---------- KPI row ---------- */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="stat-tile">
          <p className="stat-label">Classes</p>
          <p className="stat-value">{overview.classes.length}</p>
        </div>
        <div className="stat-tile">
          <p className="stat-label">Students</p>
          <p className="stat-value">{overview.totalStudents}</p>
        </div>
        <div className="stat-tile">
          <p className="stat-label">Avg. test score</p>
          <p className="stat-value">
            {primaryClass?.avgTestScorePct !== null && primaryClass?.avgTestScorePct !== undefined
              ? `${primaryClass.avgTestScorePct}%`
              : "—"}
          </p>
        </div>
      </div>

      {/* ---------- Classes ---------- */}
      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-star">Your classes</h2>
          <Link href="/teacher/classes" className="text-xs text-electric hover:underline">
            View all →
          </Link>
        </div>
        <div className="mt-3 overflow-hidden rounded-lg border border-star/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-star/10 bg-white/[0.02] text-left text-xs text-star/45">
                <th className="px-4 py-2 font-medium">Class</th>
                <th className="px-4 py-2 font-medium">Students</th>
                <th className="px-4 py-2 font-medium">Avg. test score</th>
                <th className="px-4 py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {overview.classes.map((c) => (
                <tr key={c.id} className="border-b border-star/[0.06] last:border-0">
                  <td className="px-4 py-2.5 font-medium text-star">{c.name}</td>
                  <td className="px-4 py-2.5 text-star/70">{c.studentCount}</td>
                  <td className="px-4 py-2.5 text-star/70">
                    {c.avgTestScorePct !== null ? `${c.avgTestScorePct}%` : "No attempts yet"}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <Link href={`/teacher/classes/${c.id}`} className="text-xs text-electric hover:underline">
                      View roster →
                    </Link>
                  </td>
                </tr>
              ))}
              {overview.classes.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-star/45">
                    No classes yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ---------- Chapter performance ---------- */}
      <section className="mt-8">
        <h2 className="text-sm font-semibold text-star">
          Chapter performance {primaryClass ? `— ${primaryClass.name}` : ""}
        </h2>
        <p className="mt-1 text-xs text-star/45">Average weekly-test score per chapter.</p>

        <div className="mt-3 rounded-lg border border-star/10 p-4">
          {chapters.length === 0 ? (
            <p className="py-6 text-center text-sm text-star/45">No test data yet.</p>
          ) : (
            <ChapterScoreChart
              bars={chapters.map((c) => ({
                id: c.chapterId,
                label: `Ch. ${c.order}`,
                scorePct: c.avgScorePct,
              }))}
            />
          )}
          {(() => {
            const attempted = chapters.filter((c) => c.avgScorePct !== null);
            if (attempted.length === 0) return null;
            const weakest = attempted.reduce((a, b) => (b.avgScorePct! < a.avgScorePct! ? b : a));
            return (
              <p className="mt-4 border-t border-star/10 pt-3 text-xs text-star/55">
                <span className="font-medium text-star/75">{weakest.title}</span> is the class&apos;s
                weakest chapter at {weakest.avgScorePct}% — worth revisiting before the next test.
              </p>
            );
          })()}
        </div>
      </section>
    </PortalLayout>
  );
}
