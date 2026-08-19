import type { Metadata } from "next";
import Link from "next/link";
import PortalLayout from "@/layouts/PortalLayout";
import PortalPageHeader from "@/components/common/PortalPageHeader";
import { studentSidebar } from "@/configs/portalSidebarConfig";
import { getSession } from "@/utils/session";
import { getGrade, lessonTypeMeta } from "@/data/curriculum";

export const metadata: Metadata = { title: "Curriculum" };
export const dynamic = "force-dynamic";

/**
 * A student's own syllabus, kept INSIDE the portal shell — the public
 * /curriculum/[grade] page swaps in the logged-out marketing navbar and drops
 * the portal entirely, which is disorienting mid-session even though its
 * lesson rows do deep-link correctly for an authenticated student. This page
 * keeps the same real "Start" links, just without leaving the dashboard.
 */
export default async function StudentCurriculumPage() {
  const session = await getSession();
  if (!session) {
    return (
      <PortalLayout title="Curriculum" role="Student" roleValue="student" userName="—" userId="—" nav={studentSidebar}>
        <p className="text-sm text-star/60">Your session has expired. Please log in again.</p>
      </PortalLayout>
    );
  }

  const grade = session.grade ? getGrade(session.grade) : undefined;

  return (
    <PortalLayout
      title="Curriculum"
      role={`Student · Grade ${session.grade ?? "—"}`}
      roleValue="student"
      userName={session.name}
      userId={session.sub}
      nav={studentSidebar}
    >
      <PortalPageHeader
        eyebrow="Your syllabus"
        title={grade ? `Grade ${grade.grade} — ${grade.codename}` : "Curriculum"}
      />
      {grade && <p className="mt-2 text-sm text-star/50">{grade.theme}</p>}

      {!grade && (
        <p className="mt-8 text-sm text-star/45">
          We couldn&apos;t find a syllabus for your grade. Contact your teacher.
        </p>
      )}

      {grade && (
        <div className="mt-6 space-y-8">
          {grade.terms.map((term) => (
            <div key={term.id}>
              <h2 className="text-sm font-semibold text-electric">{term.title}</h2>
              <div className="mt-3 space-y-3">
                {term.chapters.map((ch, i) => (
                  <div key={ch.id} className="overflow-hidden rounded-lg border border-star/10">
                    <div className="border-b border-star/10 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-medium text-star">
                          <span className="mr-2 text-star/35">{String(i + 1).padStart(2, "0")}</span>
                          {ch.title}
                        </p>
                        {ch.hasWeeklyTest && <span className="badge-neutral">Weekly test</span>}
                      </div>
                      <p className="mt-1.5 text-xs text-star/50">{ch.description}</p>
                    </div>
                    <ul className="divide-y divide-star/[0.06]">
                      {ch.lessons.map((l) => {
                        const meta = lessonTypeMeta[l.type];
                        return (
                          <li key={l.id} className="flex items-center gap-4 px-5 py-3">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-electric/20 bg-electric/5 text-sm text-electric">
                              {meta.icon}
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm text-star/85">{l.title}</p>
                              <p className="text-xs text-star/40">
                                {meta.label} · {l.duration} min · +{l.xp} XP
                              </p>
                            </div>
                            <Link
                              href={`/student/learn/${l.id}`}
                              className="btn-console shrink-0"
                            >
                              Start
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </PortalLayout>
  );
}
