import { PrismaClient, Prisma } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Deterministic, dependency-free code generator for seeding — mirrors
// src/utils/joinCode.ts without needing a TS path alias inside this script.
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function code(prefix: string, seedStr: string): string {
  let h = 0;
  for (let i = 0; i < seedStr.length; i++) h = (h * 31 + seedStr.charCodeAt(i)) >>> 0;
  let out = "";
  for (let i = 0; i < 4; i++) {
    out += CODE_ALPHABET[h % CODE_ALPHABET.length];
    h = Math.floor(h / CODE_ALPHABET.length) || (h + 7);
  }
  return `${prefix}-${out}`;
}

async function main() {
  console.log("Seeding database...");

  // 1. Seed Countries
  const countriesData = [
    { code: "IN", name: "India" },
    { code: "US", name: "United States" },
    { code: "AE", name: "United Arab Emirates" },
    { code: "SG", name: "Singapore" },
    { code: "GB", name: "United Kingdom" },
    { code: "AU", name: "Australia" },
    { code: "JP", name: "Japan" },
    { code: "DE", name: "Germany" },
    { code: "FR", name: "France" },
    { code: "BR", name: "Brazil" },
    { code: "ZA", name: "South Africa" },
    { code: "KE", name: "Kenya" },
  ];

  for (const c of countriesData) {
    await prisma.country.upsert({
      where: { code: c.code },
      update: { name: c.name },
      create: { code: c.code, name: c.name },
    });
  }
  console.log(`Seeded ${countriesData.length} countries.`);

  // 2. Seed Badges (Achievements)
  const badgesData = [
    { id: "first-launch", title: "First Launch", description: "Complete your very first lesson", tier: "bronze", icon: "🚀" },
    { id: "week-streak", title: "Steady Orbit", description: "7-day learning streak", tier: "bronze", icon: "🔥" },
    { id: "quiz-ace", title: "Quiz Ace", description: "Score 100% on any weekly test", tier: "silver", icon: "🎯" },
    { id: "chapter-master", title: "Chapter Master", description: "Complete every lesson in a chapter", tier: "silver", icon: "📗" },
    { id: "constellation", title: "Constellation Hunter", description: "Find 10 constellations", tier: "silver", icon: "✨" },
    { id: "cubesat-cert", title: "CubeSat Certified", description: "Pass launch review in Build a CubeSat", tier: "gold", icon: "🛰" },
    { id: "mission-commander", title: "Mission Commander", description: "Complete a full mission simulation", tier: "gold", icon: "🎖" },
    { id: "term-complete", title: "Term Graduate", description: "Finish an entire term with 80%+ average", tier: "gold", icon: "🏅" },
    { id: "top-orbit", title: "Top of the Orbit", description: "Reach #1 on your grade leaderboard", tier: "platinum", icon: "👑" },
    { id: "grade-complete", title: "Academy Graduate", description: "Complete a full grade curriculum", tier: "platinum", icon: "🌟" },
  ];

  for (const b of badgesData) {
    await prisma.badge.upsert({
      where: { id: b.id },
      update: { title: b.title, description: b.description, tier: b.tier, icon: b.icon },
      create: { id: b.id, title: b.title, description: b.description, tier: b.tier, icon: b.icon },
    });
  }
  console.log(`Seeded ${badgesData.length} badges.`);

  const passwordHash = bcrypt.hashSync("space123", 10);

  // 2b. Seed Super Admin — platform owner, full access to every portal
  // including the /super console. Rename/repoint this to a real email before
  // going anywhere near production; it's a demo credential like the rest.
  const superAdminEmail = "owner@demo.isc";
  await prisma.user.upsert({
    where: { email: superAdminEmail },
    update: { role: "SUPER_ADMIN" },
    create: {
      id: "ISC-SA-2026-000001",
      email: superAdminEmail,
      passwordHash,
      role: "SUPER_ADMIN",
      name: "Founder",
    },
  });
  console.log(`Seeded super admin account (${superAdminEmail}).`);

  // 3. Seed Admin User
  const adminEmail = "admin@demo.isc";
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      id: "ISC-A-2026-000001",
      email: adminEmail,
      passwordHash,
      role: "ADMIN",
      name: "Mission Director",
    },
  });
  console.log("Seeded admin account.");

  // 4. Seed School — every teacher/class/student below hangs off this
  const school = await prisma.school.upsert({
    where: { id: "school-demo-001" },
    update: {},
    create: {
      id: "school-demo-001",
      name: "Space Academy Elementary",
      city: "Mumbai",
      countryCode: "IN",
      teacherCode: code("SPC", "school-demo-001"),
      academicYear: "2026-27",
    },
  });
  console.log(`Seeded school "${school.name}" (teacher code: ${school.teacherCode}).`);

  // 5. Seed Teacher User
  const teacherEmail = "teacher@demo.isc";
  const teacherUser = await prisma.user.upsert({
    where: { email: teacherEmail },
    update: {},
    create: {
      id: "ISC-T-2026-000001",
      email: teacherEmail,
      passwordHash,
      role: "TEACHER",
      name: "Dr. Meera Nair",
    },
  });

  await prisma.teacher.upsert({
    where: { userId: teacherUser.id },
    update: { schoolId: school.id },
    create: {
      userId: teacherUser.id,
      schoolId: school.id,
    },
  });
  console.log("Seeded teacher account.");

  // 6. Seed her class — this is what a teacher actually manages
  const classRoom = await prisma.class.upsert({
    where: { id: "class-demo-6a" },
    update: {},
    create: {
      id: "class-demo-6a",
      name: "Section A",
      grade: 6,
      schoolId: school.id,
      teacherId: teacherUser.id,
      joinCode: code("6A", "class-demo-6a"),
    },
  });
  console.log(`Seeded class "Grade 6 · ${classRoom.name}" (join code: ${classRoom.joinCode}).`);

  // 7. Seed a small roster with DELIBERATELY varied progress — this is what
  // makes the teacher dashboard's "needs attention" logic show something real
  // instead of one lonely account.
  const now = new Date();
  const daysAgo = (n: number) => new Date(now.getTime() - n * 24 * 60 * 60 * 1000);

  const roster: {
    id: string;
    email: string;
    name: string;
    xp: number;
    spaceCoins: number;
    streakDays: number;
    lastActiveAt: Date;
  }[] = [
    { id: "ISC-S-2026-000001", email: "student@demo.isc", name: "Alex Sharma", xp: 1200, spaceCoins: 150, streakDays: 5, lastActiveAt: daysAgo(0) },
    { id: "ISC-S-2026-000002", email: "priya.n@demo.isc", name: "Priya Nair", xp: 1850, spaceCoins: 210, streakDays: 12, lastActiveAt: daysAgo(0) },
    { id: "ISC-S-2026-000003", email: "kabir.s@demo.isc", name: "Kabir Singh", xp: 640, spaceCoins: 60, streakDays: 0, lastActiveAt: daysAgo(9) },
    { id: "ISC-S-2026-000004", email: "aisha.r@demo.isc", name: "Aisha Rahman", xp: 990, spaceCoins: 110, streakDays: 2, lastActiveAt: daysAgo(1) },
    { id: "ISC-S-2026-000005", email: "dev.p@demo.isc", name: "Dev Patel", xp: 210, spaceCoins: 20, streakDays: 0, lastActiveAt: daysAgo(15) },
    { id: "ISC-S-2026-000006", email: "meera.k@demo.isc", name: "Meera Krishnan", xp: 1420, spaceCoins: 175, streakDays: 8, lastActiveAt: daysAgo(2) },
  ];

  for (const s of roster) {
    const user = await prisma.user.upsert({
      where: { email: s.email },
      update: {},
      create: { id: s.id, email: s.email, passwordHash, role: "STUDENT", name: s.name },
    });

    await prisma.student.upsert({
      where: { userId: user.id },
      update: { classId: classRoom.id, schoolId: school.id, lastActiveAt: s.lastActiveAt },
      create: {
        userId: user.id,
        dateOfBirth: new Date("2014-07-16T00:00:00.000Z"),
        gender: "Prefer not to say",
        grade: 6,
        schoolId: school.id,
        schoolName: school.name,
        classId: classRoom.id,
        phone: "+91 98765 43210",
        parentName: `${s.name.split(" ")[0]}'s Guardian`,
        parentContact: "+91 98765 43211",
        city: "Mumbai",
        state: "Maharashtra",
        countryCode: "IN",
        language: "English",
        timezone: "UTC+05:30 (India)",
        xp: s.xp,
        spaceCoins: s.spaceCoins,
        streakDays: s.streakDays,
        lastActiveAt: s.lastActiveAt,
      },
    });
  }
  console.log(`Seeded a roster of ${roster.length} students in Grade 6 · Section A.`);

  // 6. Seed Grade 6 Cadet Curriculum, Chapters & Weekly Tests
  console.log("Seeding Grade 6 curriculum...");
  const grade = 6;
  
  await prisma.gradeTier.upsert({
    where: { grade },
    update: {
      codename: "Cadet",
      tagline: "Orbital Mechanics & Earth Systems",
      theme: "blue",
      color: "#4cc9f0",
    },
    create: {
      grade,
      codename: "Cadet",
      tagline: "Orbital Mechanics & Earth Systems",
      theme: "blue",
      color: "#4cc9f0",
    },
  });

  const termId = "term-6-1";
  await prisma.term.upsert({
    where: { id: termId },
    update: { title: "Term 1", order: 1 },
    create: { id: termId, title: "Term 1", grade, order: 1 },
  });

  // Seed 4 weekly chapters
  const chaptersData = [
    { id: "chap-6-1", title: "Our Home Planet Earth", description: "Structure, magnetosphere, and gravitational pull", order: 1 },
    { id: "chap-6-2", title: "The Moon", description: "Tidal locking, phases, and lunar exploration", order: 2 },
    { id: "chap-6-3", title: "Anatomy of a Satellite", description: "Subsystems, solar panels, and communications", order: 3 },
    { id: "chap-6-4", title: "Types of Orbits", description: "Low Earth, Medium Earth, and Geostationary orbits", order: 4 },
  ];

  for (const chap of chaptersData) {
    await prisma.chapter.upsert({
      where: { id: chap.id },
      update: { title: chap.title, description: chap.description, order: chap.order },
      create: { id: chap.id, title: chap.title, description: chap.description, order: chap.order, termId, hasWeeklyTest: true },
    });

    // Create a WeeklyTest for this chapter
    const testId = `test-6-${chap.order}`;
    await prisma.weeklyTest.upsert({
      where: { id: testId },
      update: {},
      create: { id: testId, chapterId: chap.id },
    });
  }

  // Seed questions for Week 1: Our Home Planet Earth (test-6-1)
  const q1Data = [
    {
      testId: "test-6-1",
      kind: "mcq",
      payload: {
        prompt: "What protects Earth from harmful solar winds?",
        options: ["Atmosphere", "Magnetosphere", "Ozone Layer", "Gravity"],
        answer: 1,
        explain: "The magnetosphere acts as a magnetic shield deflecting charged solar wind particles.",
      },
    },
    {
      testId: "test-6-1",
      kind: "boolean",
      payload: {
        prompt: "Earth is a perfect geometric sphere.",
        answer: false,
        explain: "Due to rotation, Earth is an oblate spheroid, slightly squashed at the poles.",
      },
    },
  ];

  // Seed questions for Week 2: The Moon (test-6-2)
  const q2Data = [
    {
      testId: "test-6-2",
      kind: "mcq",
      payload: {
        prompt: "Why does the same side of the Moon always face Earth?",
        options: ["It doesn't rotate", "Tidal locking", "Solar gravity", "It's hollow"],
        answer: 1,
        explain: "Tidal locking occurs because the Moon takes the same amount of time to rotate once as it does to orbit Earth.",
      },
    },
    {
      testId: "test-6-2",
      kind: "boolean",
      payload: {
        prompt: "The Moon has active volcanic eruptions today.",
        answer: false,
        explain: "While the Moon has volcanic plains (maria) from its past, it is volcanically dead today.",
      },
    },
  ];

  // Seed questions for Week 3: Anatomy of a Satellite (test-6-3)
  const q3Data = [
    {
      testId: "test-6-3",
      kind: "mcq",
      payload: {
        prompt: "Which subsystem regulates the internal temperature of a satellite?",
        options: ["Power system", "Thermal control system", "Telemetry", "Attitude control"],
        answer: 1,
        explain: "The Thermal Control System keeps components within safe temperature limits using active heaters or passive insulators.",
      },
    },
    {
      testId: "test-6-3",
      kind: "boolean",
      payload: {
        prompt: "Passive thermal control uses electrical heaters and heat pipes.",
        answer: false,
        explain: "Passive systems use blankets, paints, and shutters; active systems use electrical heaters and fluid loops.",
      },
    },
  ];

  // Seed questions for Week 4: Types of Orbits (test-6-4)
  const q4Data = [
    {
      testId: "test-6-4",
      kind: "mcq",
      payload: {
        prompt: "A satellite in orbit is constantly…",
        options: ["Floating with no gravity", "Falling around the Earth", "Pushed up by its engines", "Held up by the atmosphere"],
        answer: 1,
        explain: "Orbit is free fall with enough sideways speed that the ground keeps curving away beneath you.",
      },
    },
    {
      testId: "test-6-4",
      kind: "boolean",
      payload: {
        prompt: "Geostationary satellites appear fixed over one point on the equator.",
        answer: true,
        explain: "At ~35,786 km altitude an orbit takes exactly one day, matching Earth's rotation.",
      },
    },
    {
      testId: "test-6-4",
      kind: "image",
      payload: {
        prompt: "Identify the highlighted satellite component.",
        figure: "🛰 ⟵ [ ▤▤ flat panels on both wings ]",
        options: ["Antenna dish", "Solar arrays", "Thruster block", "Star tracker"],
        answer: 1,
        explain: "The flat wing panels are solar arrays — the satellite's power plant.",
      },
    },
    {
      testId: "test-6-4",
      kind: "match",
      payload: {
        prompt: "Match each orbit to its typical mission.",
        pairs: [
          { left: "Low Earth Orbit", right: "Space stations & imaging" },
          { left: "Geostationary", right: "TV & weather satellites" },
          { left: "Polar Orbit", right: "Whole-Earth mapping" },
        ],
        explain: "LEO is close and fast, GEO hovers over one spot, polar orbits sweep the whole globe as Earth spins beneath.",
      },
    },
  ];

  const allQuestions = [...q1Data, ...q2Data, ...q3Data, ...q4Data];
  
  // Clear old questions to avoid duplication on re-seeding
  await prisma.question.deleteMany({});
  
  for (const q of allQuestions) {
    await prisma.question.create({
      data: {
        testId: q.testId,
        kind: q.kind,
        payload: q.payload,
      },
    });
  }
  console.log(`Seeded ${allQuestions.length} weekly assessment questions.`);

  // 9. Seed real TestAttempt rows for the roster — this is what the teacher
  // dashboard's chapter-performance chart and "avg test score" actually read.
  // Only mcq/boolean questions are used here (chapters 1-3), since a match
  // question's answer is the pairing order, not a simple index.
  await prisma.testAttempt.deleteMany({ where: { testId: { in: ["test-6-1", "test-6-2", "test-6-3"] } } });

  // Base XP/coins from the roster definition above, keyed by id — attempt XP
  // is added on TOP of these as an absolute `set`, not an `increment`, so
  // re-running the seed never double-awards XP.
  const baseByStudent = new Map(roster.map((s) => [s.id, { xp: s.xp, coins: s.spaceCoins }]));

  async function seedAttempt(testId: string, studentId: string, correctCount: number) {
    const questions = await prisma.question.findMany({ where: { testId } });
    const answers: Record<string, unknown> = {};
    let score = 0;
    questions.forEach((q, i) => {
      const payload = q.payload as { answer?: number | boolean };
      const shouldBeCorrect = i < correctCount;
      if (q.kind === "boolean") {
        answers[q.id] = shouldBeCorrect ? payload.answer : !payload.answer;
      } else {
        answers[q.id] = shouldBeCorrect ? payload.answer : (typeof payload.answer === "number" ? -1 : 0);
      }
      if (shouldBeCorrect) score += 1;
    });

    await prisma.testAttempt.create({
      data: { studentId, testId, score, answers: answers as Prisma.InputJsonValue },
    });

    const base = baseByStudent.get(studentId)!;
    base.xp += score * 50;
    base.coins += score * 5;
  }

  // { studentId: [chap1Correct, chap2Correct, chap3Correct] } out of 2 each —
  // deliberately uneven so Chapter 4 (untested) and low scorers stand out.
  const attemptPlan: Record<string, [number, number, number]> = {
    "ISC-S-2026-000001": [2, 1, 2], // Alex   — solid
    "ISC-S-2026-000002": [2, 2, 2], // Priya  — top of class
    "ISC-S-2026-000003": [0, 1, 0], // Kabir  — struggling, matches his inactivity
    "ISC-S-2026-000004": [1, 2, 1], // Aisha  — mid
    "ISC-S-2026-000006": [2, 2, 1], // Meera  — strong
    // Dev (000005) intentionally has NO attempts — hasn't started, most inactive.
  };

  for (const [studentId, [c1, c2, c3]] of Object.entries(attemptPlan)) {
    await seedAttempt("test-6-1", studentId, c1);
    await seedAttempt("test-6-2", studentId, c2);
    await seedAttempt("test-6-3", studentId, c3);
  }

  // Apply the final XP/coins totals as an absolute set (idempotent).
  for (const [studentId, totals] of baseByStudent) {
    await prisma.student.update({
      where: { userId: studentId },
      data: { xp: totals.xp, spaceCoins: totals.coins },
    });
  }

  // 10. Award a couple of real StudentBadge rows — so the student dashboard's
  // badge wall shows genuine earned badges instead of a hardcoded list.
  const badgeAwards: [string, string][] = [
    ["ISC-S-2026-000001", "first-launch"], // Alex — completed a lesson
    ["ISC-S-2026-000002", "first-launch"], // Priya
    ["ISC-S-2026-000002", "quiz-ace"],     // Priya — 100% on chapter 1 & 2
    ["ISC-S-2026-000002", "week-streak"],  // Priya — 12-day streak
    ["ISC-S-2026-000006", "first-launch"], // Meera
  ];
  for (const [studentId, badgeId] of badgeAwards) {
    await prisma.studentBadge.upsert({
      where: { studentId_badgeId: { studentId, badgeId } },
      update: {},
      create: { studentId, badgeId },
    });
  }
  console.log(`Seeded ${badgeAwards.length} earned badges.`);
  console.log(`Seeded weekly-test attempts for ${Object.keys(attemptPlan).length} students across 3 chapters.`);

  // 11. Seed a couple of demo enquiries — so /admin/enquiries has something
  // real to show rather than an empty inbox on first view.
  const enquiryCount = await prisma.enquiry.count();
  if (enquiryCount === 0) {
    await prisma.enquiry.createMany({
      data: [
        {
          name: "Fatima Al Zaabi",
          email: "fatima.alzaabi@example.ae",
          organization: "Al Noor International School, Dubai",
          message:
            "We're exploring a full-curriculum pilot for our Grade 6-8 science stream next term. Could someone share pricing and a teacher-training timeline?",
        },
        {
          name: "Marcus Webb",
          email: "m.webb@example.co.uk",
          organization: "Riverside Academy",
          message:
            "Our physics department would like a live demo of the orbit simulator before committing to a partnership. What dates do you have this month?",
          handled: true,
        },
      ],
    });
    console.log("Seeded 2 demo enquiries.");
  }

  console.log("Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
