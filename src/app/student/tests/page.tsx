import type { Metadata } from "next";
import PortalLayout from "@/layouts/PortalLayout";
import PortalPageHeader from "@/components/common/PortalPageHeader";
import { studentSidebar } from "@/configs/portalSidebarConfig";
import SampleTest from "@/components/demo/SampleTest";
import { getSession } from "@/utils/session";
import { getStudentOverview } from "@/services/studentService";

export const metadata: Metadata = { title: "Weekly Tests" };
export const dynamic = "force-dynamic";

const scoreBadge = (pct: number) =>
  pct >= 70 ? "badge-ok" : pct >= 50 ? "badge-warn" : "badge-danger";

export default async function WeeklyTestsPage() {
  const session = await getSession();
  const overview = session ? await getStudentOverview(session.sub) : null;

  return (
    <PortalLayout
      title="Weekly Tests"
      role={`Student · Grade ${session?.grade ?? "—"}`}
      roleValue="student"
      userName={session?.name ?? "Student"}
      userId={session?.sub ?? "—"}
      nav={studentSidebar}
    >
      <PortalPageHeader eyebrow="Assessments" title="Weekly Tests" />

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_300px]">
        <div>
          <SampleTest />
        </div>

        <div className="space-y-5">
          <div className="rounded-lg border border-star/10 p-5">
            <p className="text-xs font-semibold text-star/50">Past results</p>
            {overview && overview.recentAttempts.length > 0 ? (
              <ul className="mt-3 space-y-3">
                {overview.recentAttempts.map((a, i) => (
                  <li key={i} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm text-star/80">{a.chapterTitle}</p>
                      <p className="text-xs text-star/40">
                        {new Date(a.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`shrink-0 ${scoreBadge(a.scorePct)}`}>{a.scorePct}%</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-xs text-star/45">
                No tests completed yet — your first result will show up here.
              </p>
            )}
          </div>

          <div className="rounded-lg border border-star/10 p-5">
            <p className="text-xs font-semibold text-star/50">How scoring works</p>
            <ul className="mt-3 space-y-2 text-xs leading-relaxed text-star/55">
              <li>Instant evaluation with an explanation for every question.</li>
              <li>75%+ passes the chapter and awards its badge.</li>
              <li>XP counts toward your class leaderboard rank.</li>
              <li>Each weekly test allows one attempt — make it count.</li>
            </ul>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
