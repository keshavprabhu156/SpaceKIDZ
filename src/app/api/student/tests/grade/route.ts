import { NextResponse } from "next/server";
import { getSession } from "@/utils/session";
import { gradeSingleAnswer } from "@/services/weeklyTestService";
import { rateLimit } from "@/utils/rateLimit";

// A question is answered once per attempt. Allowing only a couple of grade
// calls per question stops this endpoint being used as an oracle — trying every
// option to discover the answer before submitting. (Two, not one, so an
// accidental refresh mid-test isn't punished.)
const GRADE_LIMIT = { max: 2, windowMs: 30 * 60 * 1000 };

/**
 * POST /api/student/tests/grade — grades ONE answer against the stored key.
 *
 * This exists so the student still gets instant per-question feedback and the
 * explanation, without the answer key ever being shipped to the browser.
 * It records nothing; only /submit writes an attempt.
 */
export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { testId, questionId, answer } = await req.json().catch(() => ({}));

  if (!testId || !questionId) {
    return NextResponse.json(
      { error: "Missing testId or questionId" },
      { status: 400 }
    );
  }

  const probe = rateLimit(
    `grade:${session.sub}:${questionId}`,
    GRADE_LIMIT.max,
    GRADE_LIMIT.windowMs
  );
  if (!probe.allowed) {
    return NextResponse.json(
      { error: "This question has already been answered." },
      { status: 429 }
    );
  }

  try {
    const result = await gradeSingleAnswer(testId, questionId, answer);
    if (!result) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }
    return NextResponse.json(result);
  } catch (error) {
    console.error("[tests/grade] failed:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
