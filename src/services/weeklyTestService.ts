import { prisma } from "./prisma";
import type { QuestionKind } from "@/types/assessment";

/**
 * SERVER-ONLY weekly-test logic.
 *
 * The answer key never leaves this layer: questions are stripped before being
 * sent to the browser, grading happens here, and the score stored against a
 * student is always recomputed from the database — never taken from the client.
 *
 * (The browser-side counterpart is services/assessmentService.ts, which only
 * makes HTTP calls.)
 */

export interface StoredQuestion {
  id: string;
  kind: string;
  payload: {
    prompt: string;
    options?: string[];
    pairs?: { left: string; right: string }[];
    figure?: string;
    answer?: number | boolean | string;
    explain?: string;
  };
}

/** Which chapter's test is live this week (rotates through the 4 seeded chapters). */
export function activeChapterId(now = new Date()): string {
  const startOfYear = new Date(now.getFullYear(), 0, 1).getTime();
  const weekOfYear = Math.floor((now.getTime() - startOfYear) / (7 * 24 * 60 * 60 * 1000));
  return `chap-6-${(weekOfYear % 4) + 1}`;
}

/** Loads this week's test (falls back to chapter 1) with its questions. */
export async function getActiveTest() {
  const chapterId = activeChapterId();

  const test =
    (await prisma.weeklyTest.findFirst({
      where: { chapterId },
      include: { chapter: true, questions: true },
    })) ??
    (await prisma.weeklyTest.findFirst({
      where: { chapterId: "chap-6-1" },
      include: { chapter: true, questions: true },
    }));

  return test;
}

/**
 * Grades one submitted answer against the stored key.
 * `submitted` shapes: mcq/image → number, boolean → boolean,
 * match → Record<pairIndex, chosenRight>.
 */
export function gradeQuestion(
  kind: QuestionKind | string,
  payload: StoredQuestion["payload"],
  submitted: unknown
): boolean {
  switch (kind) {
    case "mcq":
    case "image":
      return typeof submitted === "number" && submitted === payload.answer;

    case "boolean":
      return typeof submitted === "boolean" && submitted === payload.answer;

    case "match": {
      const pairs = payload.pairs ?? [];
      if (!submitted || typeof submitted !== "object") return false;
      const picks = submitted as Record<string, string>;
      // Every left-hand item must be paired with its own right-hand item.
      return (
        pairs.length > 0 &&
        pairs.every((p, idx) => picks[String(idx)] === p.right)
      );
    }

    default:
      return false;
  }
}

/** Grades a single question by id — powers instant per-question feedback. */
export async function gradeSingleAnswer(
  testId: string,
  questionId: string,
  submitted: unknown
): Promise<{ correct: boolean; explain: string } | null> {
  const question = await prisma.question.findFirst({
    where: { id: questionId, testId },
  });
  if (!question) return null;

  const payload = question.payload as StoredQuestion["payload"];
  return {
    correct: gradeQuestion(question.kind, payload, submitted),
    explain: payload.explain ?? "",
  };
}

/**
 * Recomputes the authoritative score for a whole attempt.
 * `answers` maps question id → the student's submitted answer.
 */
export async function scoreAttempt(
  testId: string,
  answers: Record<string, unknown>
): Promise<{ score: number; total: number }> {
  const questions = await prisma.question.findMany({ where: { testId } });

  let score = 0;
  for (const q of questions) {
    const payload = q.payload as StoredQuestion["payload"];
    if (gradeQuestion(q.kind, payload, answers[q.id])) score += 1;
  }

  return { score, total: questions.length };
}

/** True if this student has already completed this test. */
export async function hasAttempted(studentId: string, testId: string) {
  const existing = await prisma.testAttempt.findFirst({
    where: { studentId, testId },
    orderBy: { createdAt: "desc" },
  });
  return existing;
}

export const XP_PER_CORRECT = 50;
export const COINS_PER_CORRECT = 5;

/** Records the attempt and awards XP/coins from the SERVER-COMPUTED score. */
export async function recordAttempt(
  studentId: string,
  testId: string,
  score: number,
  answers: Record<string, unknown>
) {
  const xpAwarded = score * XP_PER_CORRECT;
  const coinsAwarded = score * COINS_PER_CORRECT;

  await prisma.$transaction([
    prisma.testAttempt.create({
      data: { studentId, testId, score, answers: answers as object },
    }),
    prisma.student.update({
      where: { userId: studentId },
      data: {
        xp: { increment: xpAwarded },
        spaceCoins: { increment: coinsAwarded },
      },
    }),
  ]);

  return { xpAwarded, coinsAwarded };
}
