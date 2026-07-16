import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession, SESSION_COOKIE } from "@/services/auth";
import { prisma } from "@/services/prisma";

const staticDemoQuestions = [
  {
    kind: "mcq",
    prompt: "A satellite in orbit is constantly…",
    options: ["Floating with no gravity", "Falling around the Earth", "Pushed up by its engines", "Held up by the atmosphere"],
    answer: 1,
    explain: "Orbit is free fall with enough sideways speed that the ground keeps curving away beneath you.",
  },
  {
    kind: "boolean",
    prompt: "Geostationary satellites appear fixed over one point on the equator.",
    answer: true,
    explain: "At ~35,786 km altitude an orbit takes exactly one day, matching Earth's rotation.",
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
    explain: "LEO is close and fast, GEO hovers over one spot, polar orbits sweep the whole globe as Earth spins beneath.",
  },
];

export async function GET() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySession(token) : null;

  // Unauthenticated / Anonymous Demo User
  if (!session) {
    return NextResponse.json({
      authenticated: false,
      test: {
        id: "demo-test",
        chapterTitle: "Types of Orbits",
        questions: staticDemoQuestions,
      },
      hasAttempted: false,
      pastScore: null,
    });
  }

  try {
    // Dynamic Weekly Assessment rotation (modulo-4 based on calendar week)
    const weekOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
    const chapterNum = (weekOfYear % 4) + 1; // Weeks 1 to 4
    const activeChapterId = `chap-6-${chapterNum}`;

    let test = await prisma.weeklyTest.findFirst({
      where: { chapterId: activeChapterId },
      include: {
        chapter: true,
        questions: true,
      },
    });

    // Fallback to Chapter 1 test if not found
    if (!test) {
      test = await prisma.weeklyTest.findFirst({
        where: { chapterId: "chap-6-1" },
        include: {
          chapter: true,
          questions: true,
        },
      });
    }

    if (!test) {
      return NextResponse.json({ error: "No assessments seeded" }, { status: 404 });
    }

    // Check for past attempts from this student for this test
    const attempt = await prisma.testAttempt.findFirst({
      where: {
        studentId: session.sub,
        testId: test.id,
      },
      orderBy: { createdAt: "desc" },
    });

    const formattedQuestions = test.questions.map((q) => {
      const payload = q.payload as any;
      return {
        id: q.id,
        kind: q.kind,
        prompt: payload.prompt,
        options: payload.options,
        pairs: payload.pairs,
        figure: payload.figure,
        answer: payload.answer,
        explain: payload.explain,
      };
    });

    return NextResponse.json({
      authenticated: true,
      test: {
        id: test.id,
        chapterTitle: test.chapter.title,
        questions: formattedQuestions,
      },
      hasAttempted: attempt !== null,
      pastScore: attempt ? attempt.score : null,
    });
  } catch (error) {
    console.error("Error fetching active assessment:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
