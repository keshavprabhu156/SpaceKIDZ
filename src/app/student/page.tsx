import type { Metadata } from "next";
import Link from "next/link";
import PortalLayout from "@/layouts/PortalLayout";
import PortalPageHeader from "@/components/common/PortalPageHeader";
import ChapterScoreChart from "@/components/common/ChapterScoreChart";
import { studentSidebar } from "@/configs/portalSidebarConfig";
import { getSession } from "@/utils/session";
import { getStudentOverview } from "@/services/studentService";

export const metadata: Metadata = { title: "Student dashboard" };
export const dynamic = "force-dynamic";

export default async function StudentDashboard() {
  const session = await getSession();
  if (!session) {
    return (
      <PortalLayout title="Student dashboard" role="Student" roleValue="student" userName="—" userId="—" nav={studentSidebar}>
        <p className="text-sm text-star/60">Your session has expired. Please log in again.</p>
      </PortalLayout>
    );
  }

  const overview = await getStudentOverview(session.sub);
  if (!overview) {
    return (
      <PortalLayout
        title="Student dashboard"
        role="Student"
        roleValue="student"
        userName={session.name}
        userId={session.sub}
        nav={studentSidebar}
      >
        <p className="text-sm text-star/60">
          Your student profile isn&apos;t set up yet. Contact your teacher.
        </p>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout
      title="Student dashboard"
      role={`Student · Grade ${overview.grade}`}
      roleValue="student"
      userName={overview.name}
      userId={overview.id}
      nav={studentSidebar}
    >
      <PortalPageHeader
        eyebrow={[overview.className, overview.schoolName].filter(Boolean).join(" · ") || `Grade ${overview.grade}`}
        title={`Welcome back, ${overview.name.split(" ")[0]}`}
        action={
          <Link href={`/student/curriculum`} className="btn-console-primary">
            Continue learning →
          </Link>
        }
      />

      {/* ---------- KPI row ---------- */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="stat-tile">
          <p className="stat-label">XP</p>
          <p className="stat-value">{overview.xp.toLocaleString()}</p>
        </div>
        <div className="stat-tile">
          <p className="stat-label">Space Coins</p>
          <p className="stat-value text-gold">{overview.spaceCoins.toLocaleString()}</p>
        </div>
        <div className="stat-tile">
          <p className="stat-label">Day streak</p>
          <p className="stat-value">{overview.streakDays}</p>
        </div>
        <div className="stat-tile">
          <p className="stat-label">Class rank</p>
          <p className="stat-value">
            {overview.classRank ? `#${overview.classRank}` : "—"}
            {overview.classSize > 0 && (
              <span className="ml-1 text-xs font-normal text-star/40">/ {overview.classSize}</span>
            )}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* ---------- Chapter scores ---------- */}
        <section>
          <h2 className="text-sm font-semibold text-star">Your scores by chapter</h2>
          <p className="mt-1 text-xs text-star/45">
            {overview.chaptersAttempted} of {overview.chaptersTotal} chapters attempted this grade.
          </p>
          <div className="mt-3 rounded-lg border border-star/10 p-4">
            {overview.chapterScores.length === 0 ? (
              <p className="py-6 text-center text-sm text-star/45">No chapters yet for this grade.</p>
            ) : (
              <ChapterScoreChart
                bars={overview.chapterScores.map((c) => ({
                  id: c.chapterId,
                  label: `Ch. ${c.order}`,
                  scorePct: c.scorePct,
                }))}
              />
            )}
          </div>
        </section>

        {/* ---------- Recent tests ---------- */}
        <section>
          <h2 className="text-sm font-semibold text-star">Recent tests</h2>
          <div className="mt-3 overflow-hidden rounded-lg border border-star/10">
            {overview.recentAttempts.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-star/45">
                No tests taken yet — try one from{" "}
                <Link href="/student/tests" className="text-electric hover:underline">
                  Weekly Tests
                </Link>
                .
              </p>
            ) : (
              <ul className="divide-y divide-star/[0.06]">
                {overview.recentAttempts.map((a, i) => (
                  <li key={i} className="flex items-center justify-between gap-3 px-4 py-2.5">
                    <div className="min-w-0">
                      <p className="truncate text-sm text-star/85">{a.chapterTitle}</p>
                      <p className="mt-0.5 text-xs text-star/40">
                        {new Date(a.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={a.scorePct >= 70 ? "badge-ok" : a.scorePct >= 50 ? "badge-warn" : "badge-danger"}
                    >
                      {a.scorePct}%
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* ---------- Leaderboard ---------- */}
        <section id="leaderboard">
          <h2 className="text-sm font-semibold text-star">Class leaderboard</h2>
          <div className="mt-3 overflow-hidden rounded-lg border border-star/10">
            {overview.leaderboard.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-star/45">
                You&apos;re not in a class yet.
              </p>
            ) : (
              <ul className="divide-y divide-star/[0.06]">
                {overview.leaderboard.map((p, i) => (
                  <li
                    key={p.id}
                    className={`flex items-center gap-3 px-4 py-2 ${p.isYou ? "bg-electric/[0.06]" : ""}`}
                  >
                    <span className="w-5 text-xs text-star/40">#{i + 1}</span>
                    <span className={`text-sm ${p.isYou ? "font-medium text-electric" : "text-star/80"}`}>
                      {p.isYou ? "You" : p.name}
                    </span>
                    <span className="ml-auto text-xs text-star/50">{p.xp.toLocaleString()} XP</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* ---------- Badges ---------- */}
        <section id="badges">
          <h2 className="text-sm font-semibold text-star">Badges earned</h2>
          <div className="mt-3 rounded-lg border border-star/10 p-4">
            {overview.badges.length === 0 ? (
              <p className="py-6 text-center text-sm text-star/45">
                No badges yet — complete a lesson or ace a test to earn your first one.
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {overview.badges.map((b) => (
                  <div
                    key={b.id}
                    title={b.description}
                    className="flex flex-col items-center rounded-md border border-star/10 p-2.5 text-center"
                  >
                    <span className="text-xl">{b.icon}</span>
                    <p className="mt-1 text-[11px] text-star/60">{b.title}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </PortalLayout>
  );
}
