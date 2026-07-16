import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

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

  // 4. Seed Teacher User
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
    update: {},
    create: {
      userId: teacherUser.id,
    },
  });
  console.log("Seeded teacher account.");

  // 5. Seed Student User
  const studentEmail = "student@demo.isc";
  const studentUser = await prisma.user.upsert({
    where: { email: studentEmail },
    update: {},
    create: {
      id: "ISC-S-2026-000001",
      email: studentEmail,
      passwordHash,
      role: "STUDENT",
      name: "Alex Sharma",
    },
  });

  await prisma.student.upsert({
    where: { userId: studentUser.id },
    update: {},
    create: {
      userId: studentUser.id,
      dateOfBirth: new Date("2014-07-16T00:00:00.000Z"),
      gender: "Male",
      grade: 6,
      schoolName: "Space Academy Elementary",
      phone: "+91 98765 43210",
      parentName: "Ramesh Sharma",
      parentContact: "+91 98765 43211",
      city: "Mumbai",
      state: "Maharashtra",
      countryCode: "IN",
      language: "English",
      timezone: "UTC+05:30 (India)",
      xp: 1200,
      spaceCoins: 150,
      streakDays: 5,
    },
  });
  console.log("Seeded student account.");
  
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
