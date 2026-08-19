import { prisma } from "./prisma";
import type { StudentOverview } from "@/types/student";

/**
 * SERVER-ONLY student queries.
 *
 * SECURITY: every function here takes the CALLER's own studentId (from
 * `getSession()`), never one supplied by the client. A student must only ever
 * be able to read their own row this way — there is deliberately no
 * `getStudentOverview(studentId)` callable with an arbitrary id from a route
 * that isn't already scoped to `session.sub`.
 */
export async function getStudentOverview(studentId: string): Promise<StudentOverview | null> {
  const student = await prisma.student.findUnique({
    where: { userId: studentId },
    include: { user: true, class: { include: { school: true } } },
  });
  if (!student) return null;

  // Classmates (leaderboard) — only meaningful once the student has a class.
  let leaderboard: StudentOverview["leaderboard"] = [];
  let classRank: number | null = null;
  let classSize = 0;
  if (student.classId) {
    const classmates = await prisma.student.findMany({
      where: { classId: student.classId },
      include: { user: true },
      orderBy: { xp: "desc" },
    });
    classSize = classmates.length;
    leaderboard = classmates.map((c) => ({
      id: c.userId,
      name: c.user.name,
      xp: c.xp,
      isYou: c.userId === studentId,
    }));
    classRank = classmates.findIndex((c) => c.userId === studentId) + 1 || null;
  }

  // Per-chapter score for this student's grade, from their own attempts only.
  const chapters = await prisma.chapter.findMany({
    where: { term: { grade: student.grade } },
    include: { tests: { include: { questions: true, attempts: { where: { studentId } } } } },
    orderBy: { order: "asc" },
  });
  const chapterScores = chapters.map((chapter) => {
    const test = chapter.tests[0];
    const attempt = test?.attempts[0];
    const scorePct =
      attempt && test.questions.length
        ? Math.round((attempt.score / test.questions.length) * 100)
        : null;
    return { chapterId: chapter.id, title: chapter.title, order: chapter.order, scorePct };
  });
  const chaptersAttempted = chapterScores.filter((c) => c.scorePct !== null).length;

  // Recent attempts, most recent first.
  const attempts = await prisma.testAttempt.findMany({
    where: { studentId },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { test: { include: { chapter: true, questions: true } } },
  });
  const recentAttempts = attempts.map((a) => ({
    chapterTitle: a.test.chapter.title,
    scorePct: a.test.questions.length ? Math.round((a.score / a.test.questions.length) * 100) : 0,
    createdAt: a.createdAt.toISOString(),
  }));

  // Earned badges.
  const studentBadges = await prisma.studentBadge.findMany({
    where: { studentId },
    include: { badge: true },
    orderBy: { earnedAt: "desc" },
  });
  const badges = studentBadges.map((sb) => ({
    id: sb.badge.id,
    title: sb.badge.title,
    description: sb.badge.description,
    tier: sb.badge.tier,
    icon: sb.badge.icon,
    earnedAt: sb.earnedAt.toISOString(),
  }));

  return {
    name: student.user.name,
    id: student.userId,
    grade: student.grade,
    xp: student.xp,
    spaceCoins: student.spaceCoins,
    streakDays: student.streakDays,
    className: student.class ? `Grade ${student.class.grade} · ${student.class.name}` : null,
    schoolName: student.class?.school.name ?? null,
    classRank,
    classSize,
    leaderboard,
    chapterScores,
    recentAttempts,
    badges,
    chaptersAttempted,
    chaptersTotal: chapterScores.length,
  };
}
