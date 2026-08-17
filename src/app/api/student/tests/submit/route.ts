import { NextResponse } from "next/server";
import { getSession } from "@/utils/session";
import {
  hasAttempted,
  recordAttempt,
  scoreAttempt,
} from "@/services/weeklyTestService";

/**
 * POST /api/student/tests/submit
 *
 * Takes the student's ANSWERS (not a score) and recomputes the score from the
 * answer key in the database. The client cannot influence XP:
 *   - a forged `score` field is ignored entirely;
 *   - a second attempt at the same test is rejected, so XP can't be farmed by
 *     resubmitting.
 */
export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { testId, answers } = body as {
    testId?: string;
    answers?: Record<string, unknown>;
  };

  if (!testId) {
    return NextResponse.json({ error: "Missing testId" }, { status: 400 });
  }
  if (!answers || typeof answers !== "object") {
    return NextResponse.json({ error: "Missing answers" }, { status: 400 });
  }

  try {
    // One graded attempt per test, per student.
    const existing = await hasAttempted(session.sub, testId);
    if (existing) {
      return NextResponse.json(
        {
          error: "You have already completed this test.",
          alreadyAttempted: true,
          score: existing.score,
        },
        { status: 409 }
      );
    }

    // Authoritative scoring — from the database, never from the request.
    const { score, total } = await scoreAttempt(testId, answers);
    if (total === 0) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 });
    }

    const { xpAwarded, coinsAwarded } = await recordAttempt(
      session.sub,
      testId,
      score,
      answers
    );

    return NextResponse.json({
      ok: true,
      score,
      total,
      xpAwarded,
      coinsAwarded,
    });
  } catch (error) {
    console.error("[tests/submit] failed:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
