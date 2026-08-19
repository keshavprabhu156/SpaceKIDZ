import type { Metadata } from "next";
import PortalLayout from "@/layouts/PortalLayout";
import PortalPageHeader from "@/components/common/PortalPageHeader";
import { adminSidebar } from "@/configs/portalSidebarConfig";
import { getSession } from "@/utils/session";
import { grades } from "@/data/curriculum";

export const metadata: Metadata = { title: "Curriculum" };
export const dynamic = "force-dynamic";

/**
 * Cross-grade reference browser, kept INSIDE the admin console rather than
 * sending admins to the public marketing /curriculum page.
 *
 * Unlike the sidebar-anchor bug fixed earlier, the in-page jump list below IS
 * a legitimate use of anchors: this page stacks all 7 grades and is genuinely
 * long enough that jumping actually scrolls something, unlike a sidebar item
 * pointing at a section already fully on screen.
 */
export default async function AdminCurriculumPage() {
  const session = await getSession();

  return (
    <PortalLayout
      title="Curriculum"
      role="Administrator"
      roleValue="admin"
      userName={session?.name ?? "Administrator"}
      userId={session?.sub ?? "—"}
      nav={adminSidebar}
    >
      <PortalPageHeader eyebrow="Platform reference" title="Curriculum" />

      {/* Jump list — legitimate here, this page is long */}
      <div className="mt-5 flex flex-wrap gap-2">
        {grades.map((g) => (
          <a key={g.grade} href={`#grade-${g.grade}`} className="btn-console">
            Grade {g.grade}
          </a>
        ))}
      </div>

      <div className="mt-8 space-y-12">
        {grades.map((g) => {
          const chapters = g.terms.reduce((n, t) => n + t.chapters.length, 0);
          const lessons = g.terms.reduce(
            (n, t) => n + t.chapters.reduce((m, c) => m + c.lessons.length, 0),
            0
          );
          return (
            <section key={g.grade} id={`grade-${g.grade}`} className="scroll-mt-24">
              <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-star/10 pb-3">
                <div className="flex items-baseline gap-3">
                  <h2 className="text-base font-semibold text-star">
                    Grade {g.grade}
                  </h2>
                  <span className="text-sm text-star/45">{g.codename} · {g.tagline}</span>
                </div>
                <span className="text-xs text-star/40">
                  {g.terms.length} terms · {chapters} chapters · {lessons} lessons
                </span>
              </div>

              <div className="mt-5 space-y-6">
                {g.terms.map((term) => (
                  <div key={term.id}>
                    <h3 className="text-sm font-semibold text-electric">{term.title}</h3>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {term.chapters.map((ch, i) => (
                        <div key={ch.id} className="rounded-xl border border-star/10 p-4">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-medium text-star">
                              <span className="mr-1.5 text-star/35">{String(i + 1).padStart(2, "0")}</span>
                              {ch.title}
                            </p>
                            {ch.hasWeeklyTest && <span className="badge-neutral">Test</span>}
                          </div>
                          <p className="mt-1 text-xs text-star/45">{ch.lessons.length} lessons</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </PortalLayout>
  );
}
