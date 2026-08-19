import type { Metadata } from "next";
import PortalLayout from "@/layouts/PortalLayout";
import PortalPageHeader from "@/components/common/PortalPageHeader";
import { teacherSidebar } from "@/configs/portalSidebarConfig";
import { getSession } from "@/utils/session";
import { getTeacherOverview } from "@/services/teacherService";
import { getGrade } from "@/data/curriculum";

export const metadata: Metadata = { title: "Curriculum" };
export const dynamic = "force-dynamic";

/**
 * A teacher's own read-only view of the syllabus she teaches — kept INSIDE
 * the portal shell (sidebar, session chrome) rather than sending her to the
 * public marketing page at /curriculum, which drops the portal entirely and
 * swaps in the logged-out navbar with no way back but the browser's back
 * button. Content still comes from the shared curriculum data module — same
 * source the public site and the lesson viewer use.
 */
export default async function TeacherCurriculumPage() {
  const session = await getSession();
  if (!session) {
    return (
      <PortalLayout title="Curriculum" role="Teacher" roleValue="teacher" userName="—" userId="—" nav={teacherSidebar}>
        <p className="text-sm text-star/60">Your session has expired. Please log in again.</p>
      </PortalLayout>
    );
  }

  const overview = await getTeacherOverview(session.sub);
  const grades = [...new Set((overview?.classes ?? []).map((c) => c.grade))]
    .sort((a, b) => a - b)
    .map((g) => getGrade(g))
    .filter((g): g is NonNullable<typeof g> => g !== undefined);

  return (
    <PortalLayout
      title="Curriculum"
      role="Teacher"
      roleValue="teacher"
      userName={overview?.teacherName ?? session.name}
      userId={session.sub}
      nav={teacherSidebar}
    >
      <PortalPageHeader eyebrow={overview?.schoolName ?? ""} title="Curriculum" />
      <p className="mt-2 text-sm text-star/50">
        The syllabus for the grade{grades.length !== 1 ? "s" : ""} you teach.
      </p>

      {grades.length === 0 && (
        <p className="mt-8 text-sm text-star/45">
          You aren&apos;t assigned to a class yet, so there&apos;s no syllabus to show.
        </p>
      )}

      {grades.map((g) => (
        <section key={g.grade} className="mt-8">
          <div className="flex items-baseline gap-3">
            <h2 className="text-base font-semibold text-star">Grade {g.grade}</h2>
            <span className="text-sm text-star/45">{g.codename} · {g.tagline}</span>
          </div>

          <div className="mt-4 space-y-5">
            {g.terms.map((term) => (
              <div key={term.id}>
                <h3 className="text-sm font-semibold text-electric">{term.title}</h3>
                <div className="mt-3 space-y-3">
                  {term.chapters.map((ch, i) => (
                    <div key={ch.id} className="rounded-lg border border-star/10 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-medium text-star">
                          <span className="mr-2 text-star/35">{String(i + 1).padStart(2, "0")}</span>
                          {ch.title}
                        </p>
                        {ch.hasWeeklyTest && <span className="badge-neutral">Weekly test</span>}
                      </div>
                      <p className="mt-1.5 text-xs text-star/50">{ch.description}</p>
                      <p className="mt-3 text-xs text-star/40">
                        {ch.lessons.length} lesson{ch.lessons.length !== 1 ? "s" : ""} ·{" "}
                        {ch.lessons.reduce((n, l) => n + l.duration, 0)} min ·{" "}
                        {ch.lessons.reduce((n, l) => n + l.xp, 0)} XP total
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </PortalLayout>
  );
}
