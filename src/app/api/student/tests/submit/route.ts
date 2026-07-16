import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession, SESSION_COOKIE } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySession(token) : null;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { testId, score, answers } = await req.json().catch(() => ({}));

    if (!testId || score === undefined) {
      return NextResponse.json({ error: "Missing testId or score" }, { status: 400 });
    }

    // Save the attempt record
    const attempt = await prisma.testAttempt.create({
      data: {
        studentId: session.sub,
        testId,
        score,
        answers: answers || {},
      },
    });

    // Award XP and SpaceCoins based on correct answer counts
    const xpReward = score * 50; // e.g. 2 correct answers = 100 XP
    const coinReward = score * 5; // e.g. 2 correct answers = 10 SpaceCoins

    await prisma.student.update({
      where: { userId: session.sub },
      data: {
        xp: { increment: xpReward },
        spaceCoins: { increment: coinReward },
      },
    });

    return NextResponse.json({
      ok: true,
      xpAwarded: xpReward,
      coinsAwarded: coinReward,
    });
  } catch (error) {
    console.error("Error submitting test result:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
