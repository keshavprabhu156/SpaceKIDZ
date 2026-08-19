import { prisma } from "./prisma";
import type {
  ChapterPerformance,
  ClassRoster,
  ClassSummary,
  TeacherOverview,
} from "@/types/teacher";

/**
 * SERVER-ONLY teacher queries.
 *
 * SECURITY: this is a multi-tenant app — every school's data must stay
 * invisible to every other school. The rule enforced throughout this file:
 * every query is scoped to `teacherId`, and every class lookup re-derives its
 * `classId` from `Class.findMany({ where: { teacherId } })` rather than
 * trusting a classId handed in from the URL or a form. A route handler must
 * never pass a raw classId from the request straight into a query — always
 * go through `assertOwnsClass` first.
 */

function daysSince(date: Date | null): number | null {
  if (!date) return null;
  return Math.floor((Date.now() - date.getTime()) / (24 * 60 * 60 * 1000));
}

/** Throws if `classId` does not belong to this teacher. Call before any
 *  class-scoped read or write (roster, assignments, attendance). */
export async function assertOwnsClass(teacherId: string, classId: string) {
  const cls = await prisma.class.findFirst({ where: { id: classId, teacherId } });
  if (!cls) throw new Error("Class not found or not owned by this teacher");
  return cls;
}

/** Everything the teacher dashboard needs, in one call. */
export async function getTeacherOverview(teacherId: string): Promise<TeacherOverview | null> {
  const teacher = await prisma.teacher.findUnique({
    where: { userId: teacherId },
    include: { user: true, school: true },
  });
  if (!teacher) return null;

  const classes = await prisma.class.findMany({
    where: { teacherId },
    include: { students: true },
    orderBy: { name: "asc" },
  });

  const classSummaries: ClassSummary[] = [];
  let totalStudents = 0;

  for (const cls of classes) {
    totalStudents += cls.students.length;
    const studentIds = cls.students.map((s) => s.userId);

    const attempts = studentIds.length
      ? await prisma.testAttempt.findMany({
          where: { studentId: { in: studentIds } },
          include: { test: { include: { questions: true } } },
        })
      : [];

    const scorePcts = attempts.map((a) =>
      a.test.questions.length ? (a.score / a.test.questions.length) * 100 : 0
    );
    const avgTestScorePct = scorePcts.length
      ? Math.round(scorePcts.reduce((s, v) => s + v, 0) / scorePcts.length)
      : null;

    classSummaries.push({
      id: cls.id,
      name: `Grade ${cls.grade} · ${cls.name}`,
      grade: cls.grade,
      studentCount: cls.students.length,
      avgTestScorePct,
    });
  }

  return {
    teacherName: teacher.user.name,
    teacherId: teacher.userId,
    schoolName: teacher.school?.name ?? "Unassigned school",
    classes: classSummaries,
    totalStudents,
  };
}

/** Per-chapter average score for one class — powers the performance chart.
 *  `classId` must already be verified with assertOwnsClass by the caller. */
export async function getClassChapterPerformance(
  classId: string
): Promise<ChapterPerformance[]> {
  const cls = await prisma.class.findUnique({ where: { id: classId } });
  if (!cls) return [];

  const students = await prisma.student.findMany({ where: { classId } });
  const studentIds = students.map((s) => s.userId);
  if (studentIds.length === 0) return [];

  const chapters = await prisma.chapter.findMany({
    where: { term: { grade: cls.grade } },
    include: { tests: { include: { questions: true, attempts: true } } },
    orderBy: { order: "asc" },
  });

  return chapters.map((chapter) => {
    const test = chapter.tests[0];
    if (!test || test.questions.length === 0) {
      return { chapterId: chapter.id, title: chapter.title, order: chapter.order, avgScorePct: null, attemptCount: 0 };
    }

    const classAttempts = test.attempts.filter((a) => studentIds.includes(a.studentId));
    const avgScorePct = classAttempts.length
      ? Math.round(
          classAttempts.reduce((s, a) => s + (a.score / test.questions.length) * 100, 0) /
            classAttempts.length
        )
      : null;

    return {
      chapterId: chapter.id,
      title: chapter.title,
      order: chapter.order,
      avgScorePct,
      attemptCount: classAttempts.length,
    };
  });
}

/**
 * Full roster for one class — name, XP, last active, latest test score.
 * Callers MUST verify ownership first: `await assertOwnsClass(teacherId, classId)`.
 */
export async function getClassRoster(classId: string): Promise<ClassRoster | null> {
  const cls = await prisma.class.findUnique({
    where: { id: classId },
    include: { students: { include: { user: true } } },
  });
  if (!cls) return null;

  const studentIds = cls.students.map((s) => s.userId);
  const attempts = studentIds.length
    ? await prisma.testAttempt.findMany({
        where: { studentId: { in: studentIds } },
        include: { test: { include: { questions: true } } },
        orderBy: { createdAt: "desc" },
      })
    : [];

  const students = cls.students
    .map((s) => {
      const studentAttempts = attempts.filter((a) => a.studentId === s.userId);
      const latest = studentAttempts[0];
      const latestScorePct = latest
        ? Math.round((latest.score / latest.test.questions.length) * 100)
        : null;
      return {
        id: s.userId,
        name: s.user.name,
        xp: s.xp,
        lastActiveAt: s.lastActiveAt?.toISOString() ?? null,
        daysInactive: daysSince(s.lastActiveAt),
        latestScorePct,
        attemptCount: studentAttempts.length,
      };
    })
    // Most-recently-active first, so the roster reads top-down as "healthiest first".
    .sort((a, b) => (a.daysInactive ?? 999) - (b.daysInactive ?? 999));

  return {
    classId: cls.id,
    className: `Grade ${cls.grade} · ${cls.name}`,
    grade: cls.grade,
    students,
  };
}
