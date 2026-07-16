import type { Metadata } from "next";
import Link from "next/link";
import PortalShell from "@/components/portal/PortalShell";
import Flag from "@/components/ui/Flag";
import { getSession } from "@/utils/session";
import { achievements } from "@/data/global";
import {
  studentStats,
  weeklyActivity,
  leaderboard,
  upcomingSessions,
  dailyChallenges,
  earnedBadgeIds,
  assignments,
} from "@/data/dashboard";

export const metadata: Metadata = { title: "Mission Control — Student Dashboard" };

const nav = [
  { label: "Mission Control", icon: "◉", href: "/student", active: true },
  { label: "My Curriculum", icon: "◈", href: "/curriculum" },
  { label: "Weekly Tests", icon: "▣", href: "/student/tests" },
  { label: "Game Deck", icon: "🎮", href: "/games" },
  { label: "Achievements", icon: "🏅", href: "/student#achievements" },
  { label: "Leaderboard", icon: "⬆", href: "/student#leaderboard" },
];

export default async function StudentDashboard() {
  const session = await getSession();
  const name = session?.name ?? "Cadet";
  const firstName = name.split(" ")[0];
  const s = studentStats;
  const xpPct = Math.round((s.xp / s.xpToNextLevel) * 100);
  const maxXp = Math.max(...weeklyActivity.map((d) => d.xp));
  const earned = achievements.filter((a) => earnedBadgeIds.includes(a.id));

  return (
    <PortalShell
      title="Mission Control"
      role={`Student · Grade ${session?.grade ?? s.currentChapter.grade}`}
      userName={name}
      userId={session?.sub ?? "ISC-S-XXXX-XXXXXX"}
      nav={nav}
    >
      {/* ---------- Header ---------- */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-electric/70">
            ◉ All systems nominal
          </p>
          <h1 className="mt-2 font-display text-2xl font-bold uppercase tracking-wide text-star sm:text-3xl">
            Welcome back, <span className="text-electric">{firstName}</span>
          </h1>
        </div>
        <div className="flex gap-3">
          <div className="glass-panel px-4 py-2.5 text-center">
            <p className="font-display text-lg font-bold text-gold">◆ {s.spaceCoins.toLocaleString()}</p>
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-star/40">Space Coins</p>
          </div>
          <div className="glass-panel px-4 py-2.5 text-center">
            <p className="font-display text-lg font-bold text-orange-400">🔥 {s.streakDays}</p>
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-star/40">Day Streak</p>
          </div>
        </div>
      </div>

      {/* ---------- Row 1: XP / Current mission / Weekly chart ---------- */}
      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        {/* XP Level ring */}
        <div className="holo-panel flex items-center gap-6 p-6">
          <div className="relative h-28 w-28 shrink-0">
            <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="42" fill="none" stroke="url(#xpGrad)" strokeWidth="8"
                strokeLinecap="round" strokeDasharray={`${xpPct * 2.64} 264`}
              />
              <defs>
                <linearGradient id="xpGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#4cc9f0" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="font-display text-2xl font-black text-star">{s.level}</p>
              <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-star/40">Level</p>
            </div>
          </div>
          <div>
            <p className="font-display text-sm font-bold uppercase tracking-wider text-electric">{s.rank}</p>
            <p className="mt-1 text-xs text-star/50">
              {s.xp.toLocaleString()} / {s.xpToNextLevel.toLocaleString()} XP
            </p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-star/35">
              {s.xpToNextLevel - s.xp} XP to Flight Lieutenant
            </p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-star/35">
              Attendance <span className="text-emerald-300">{s.attendance}%</span> · Missions{" "}
              <span className="text-electric">{s.completedMissions}</span>
            </p>
          </div>
        </div>

        {/* Current mission */}
        <div className="holo-panel holo-border scan-sweep p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-electric/70">
            Current Mission · Grade {s.currentChapter.grade}
          </p>
          <h3 className="mt-2 font-display text-base font-bold uppercase tracking-wider text-star">
            {s.currentChapter.chapter}
          </h3>
          <p className="mt-1 text-xs text-star/50">Next up: {s.currentChapter.lesson}</p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-electric to-nebula-light shadow-holo"
              style={{ width: `${s.currentChapter.progress}%` }}
            />
          </div>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-star/40">
            {s.currentChapter.progress}% complete
          </p>
          <Link href={`/student/learn/${s.currentChapter.lessonId}`} className="btn-primary mt-4 w-full !py-2.5">
            Resume Mission →
          </Link>
        </div>

        {/* Weekly activity */}
        <div className="holo-panel p-6">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-electric/70">
              Weekly Activity
            </p>
            <p className="font-mono text-[10px] uppercase tracking-widest text-star/40">
              {s.weeklyProgress}% of plan
            </p>
          </div>
          <div className="mt-5 flex h-28 items-end gap-2">
            {weeklyActivity.map((d) => (
              <div key={d.day} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-galaxy to-electric opacity-80 transition-all hover:opacity-100"
                  style={{ height: `${(d.xp / maxXp) * 82}%` }}
                  title={`${d.xp} XP`}
                />
                <span className="font-mono text-[9px] uppercase text-star/40">{d.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ---------- Row 2: Challenges / Sessions / Assignments ---------- */}
      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <div className="holo-panel p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-electric/70">Daily Challenges</p>
          <ul className="mt-4 space-y-3">
            {dailyChallenges.map((c) => (
              <li key={c.id} className="flex items-center gap-3 text-sm">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-md border text-xs ${
                    c.done ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-300" : "border-white/15 text-star/30"
                  }`}
                >
                  {c.done ? "✓" : ""}
                </span>
                <span className={c.done ? "text-star/40 line-through" : "text-star/80"}>{c.title}</span>
                <span className="ml-auto font-mono text-[10px] text-gold/70">+{c.xp}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="holo-panel p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-electric/70">Upcoming Sessions</p>
          <ul className="mt-4 space-y-3.5">
            {upcomingSessions.map((u) => (
              <li key={u.id} className="flex items-start gap-3">
                <span className="mt-0.5 text-base">
                  {u.type === "live" ? "🔴" : u.type === "test" ? "▣" : "✎"}
                </span>
                <div>
                  <p className="text-sm text-star/80">{u.title}</p>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-star/40">{u.date}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="holo-panel p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-electric/70">Assignments</p>
          <ul className="mt-4 space-y-3.5">
            {assignments.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-3">
                <p className="text-sm text-star/80">{a.title}</p>
                <span
                  className={`shrink-0 rounded-full border px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-widest ${
                    a.status === "submitted"
                      ? "border-emerald-400/40 text-emerald-300"
                      : "border-gold/40 text-gold"
                  }`}
                >
                  {a.status === "submitted" ? "✓ Done" : a.due}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ---------- Row 3: Leaderboard / Badges ---------- */}
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div id="leaderboard" className="holo-panel p-6">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-electric/70">
              Grade 6 Leaderboard · Global
            </p>
            <span className="font-mono text-[10px] uppercase tracking-widest text-star/40">This week</span>
          </div>
          <ul className="mt-4 space-y-2">
            {leaderboard.map((p) => (
              <li
                key={p.rank}
                className={`flex items-center gap-4 rounded-xl border px-4 py-2.5 ${
                  p.isYou ? "border-electric/40 bg-electric/10 shadow-holo" : "border-white/5 bg-white/[0.02]"
                }`}
              >
                <span className={`font-display text-sm font-black ${p.rank <= 3 ? "text-gold" : "text-star/40"}`}>
                  {p.rank <= 3 ? ["🥇", "🥈", "🥉"][p.rank - 1] : `#${p.rank}`}
                </span>
                <Flag code={p.countryCode} size={22} />
                <span className={`text-sm ${p.isYou ? "font-semibold text-electric" : "text-star/80"}`}>{p.name}</span>
                <span className="ml-auto font-mono text-[11px] text-star/50">{p.xp.toLocaleString()} XP</span>
              </li>
            ))}
          </ul>
        </div>

        <div id="achievements" className="holo-panel p-6">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-electric/70">Badges Earned</p>
            <span className="font-mono text-[10px] uppercase tracking-widest text-star/40">
              {earned.length} / {achievements.length}
            </span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {achievements.slice(0, 8).map((a) => {
              const has = earnedBadgeIds.includes(a.id);
              return (
                <div
                  key={a.id}
                  title={a.description}
                  className={`flex flex-col items-center rounded-xl border p-3 text-center transition-all ${
                    has ? "border-gold/40 bg-gold/5 shadow-gold" : "border-white/5 opacity-35 grayscale"
                  }`}
                >
                  <span className="text-2xl">{a.icon}</span>
                  <p className="mt-1.5 font-mono text-[9px] uppercase tracking-wider text-star/60">{a.title}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
