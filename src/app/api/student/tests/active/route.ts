import { NextResponse } from "next/server";
import { getSession } from "@/utils/session";
import { getActiveTest, hasAttempted, type StoredQuestion } from "@/services/weeklyTestService";

/**
 * GET /api/student/tests/active — this week's test.
 *
 * For a signed-in student the answer key is STRIPPED: `answer` and `explain`
 * are never sent, so they can't be read out of DevTools. Grading happens via
 * /api/student/tests/grade and the final score is recomputed on submit.
 *
 * The unauthenticated /demo test is graded in the browser on purpose — it
 * carries no XP, no attempt record and no leaderboard effect, so there is
 * nothing to gain by cheating it.
 */

const demoQuestions = [
  {
    kind: "mcq",
    prompt: "A satellite in orbit is constantly…",
    options: [
      "Floating with no gravity",
      "Falling around the Earth",
      "Pushed up by its engines",
      "Held up by the atmosphere",
    ],
    answer: 1,
    explain:
      "Orbit is free fall with enough sideways speed that the ground keeps curving away beneath you.",
  },
  {
    kind: "boolean",
    prompt: "Geostationary satellites appear fixed over one point on the equator.",
    answer: true,
    explain:
      "At ~35,786 km altitude an orbit takes exactly one day, matching Earth's rotation.",
  },
  {
    kind: "image",
    prompt: "Identify the highlighted satellite component.",
    figure: "🛰 ⟵ [ ▤▤ flat panels on both wings ]",
    options: ["Antenna dish", "Solar arrays", "Thruster block", "Star tracker"],
    answer: 1,
    explain: "The flat wing panels are solar arrays — the satellite's power plant.",
  },
  {
    kind: "match",
    prompt: "Match each orbit to its typical mission.",
    pairs: [
      { left: "Low Earth Orbit", right: "Space stations & imaging" },
      { left: "Geostationary", right: "TV & weather satellites" },
      { left: "Polar Orbit", right: "Whole-Earth mapping" },
    ],
    explain:
      "LEO is close and fast, GEO hovers over one spot, polar orbits sweep the whole globe as Earth spins beneath.",
  },
];

/** Fisher–Yates — breaks the positional correlation in match choices. */
function shuffle<T>(input: T[]): T[] {
  const a = [...input];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export async function GET() {
  const session = await getSession();

  // Anonymous visitor → static, unscored demo (answers included, no stakes)
  if (!session) {
    return NextResponse.json({
      authenticated: false,
      test: {
        id: "demo-test",
        chapterTitle: "Types of Orbits",
        questions: demoQuestions,
      },
      hasAttempted: false,
      pastScore: null,
    });
  }

  try {
    const test = await getActiveTest();
    if (!test) {
      return NextResponse.json({ error: "No assessments seeded" }, { status: 404 });
    }

    const attempt = await hasAttempted(session.sub, test.id);

    // Strip the answer key before it crosses the network.
    const questions = (test.questions as unknown as StoredQuestion[]).map((q) => {
      const p = q.payload;
      return {
        id: q.id,
        kind: q.kind,
        prompt: p.prompt,
        options: p.options,
        // For a match question the ANSWER IS THE ORDER — sending aligned
        // left/right pairs would hand over the mapping. Send the prompts and a
        // shuffled pool of choices instead; the true pairing stays server-side.
        pairs: p.pairs?.map((x) => ({ left: x.left })),
        rightOptions: p.pairs ? shuffle(p.pairs.map((x) => x.right)) : undefined,
        figure: p.figure,
      };
    });

    return NextResponse.json({
      authenticated: true,
      test: {
        id: test.id,
        chapterTitle: test.chapter.title,
        questions,
      },
      hasAttempted: attempt !== null,
      pastScore: attempt ? attempt.score : null,
    });
  } catch (error) {
    console.error("[tests/active] failed:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
