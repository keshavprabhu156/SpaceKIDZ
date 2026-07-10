/**
 * Mock dashboard telemetry. In production these come from /api/students/:id/*
 * backed by PostgreSQL — shapes are stable, only the source changes.
 */

export const studentStats = {
  xp: 4820,
  xpToNextLevel: 6000,
  level: 12,
  rank: "Orbit Officer",
  spaceCoins: 1240,
  streakDays: 9,
  attendance: 94,
  completedMissions: 23,
  weeklyProgress: 68, // percent of this week's plan
  currentChapter: {
    grade: 6,
    chapter: "Anatomy of a Satellite",
    lesson: "Satellite Anatomy Explorer",
    lessonId: "g6-c1-l1", // deep link target for Resume Mission
    progress: 62,
  },
};

export const weeklyActivity = [
  { day: "Mon", xp: 220 },
  { day: "Tue", xp: 340 },
  { day: "Wed", xp: 180 },
  { day: "Thu", xp: 420 },
  { day: "Fri", xp: 300 },
  { day: "Sat", xp: 520 },
  { day: "Sun", xp: 140 },
];

export const leaderboard = [
  { rank: 1, name: "Aisha K.", countryCode: "AE", xp: 7240 },
  { rank: 2, name: "Rohan S.", countryCode: "IN", xp: 6980 },
  { rank: 3, name: "Emma L.", countryCode: "GB", xp: 6710 },
  { rank: 4, name: "You", countryCode: "IN", xp: 4820, isYou: true },
  { rank: 5, name: "Kenji T.", countryCode: "JP", xp: 4590 },
];

export const upcomingSessions = [
  { id: 1, title: "Live: Orbits Q&A with Mission Scientist", date: "Wed 16:00 IST", type: "live" },
  { id: 2, title: "Weekly Test — Satellite Anatomy", date: "Fri 10:00 IST", type: "test" },
  { id: 3, title: "Group Activity: Label the Satellite", date: "Sat 11:00 IST", type: "activity" },
];

export const dailyChallenges = [
  { id: 1, title: "Complete 1 lesson", xp: 50, done: true },
  { id: 2, title: "Score 80%+ on a mini quiz", xp: 80, done: false },
  { id: 3, title: "Play any game for 10 minutes", xp: 40, done: false },
];

export const earnedBadgeIds = ["first-launch", "week-streak", "quiz-ace", "constellation"];

export const assignments = [
  { id: 1, title: "Orbit Types — worksheet", due: "Tomorrow", status: "pending" },
  { id: 2, title: "Satellite report: pick any Earth-observation satellite", due: "In 4 days", status: "pending" },
  { id: 3, title: "Crater experiment photos", due: "Done", status: "submitted" },
];

// ---------------- Teacher portal ----------------

export const teacherClasses = [
  { id: "6A", name: "Grade 6 — Section A", students: 32, avgProgress: 71, avgScore: 82 },
  { id: "6B", name: "Grade 6 — Section B", students: 29, avgProgress: 64, avgScore: 78 },
  { id: "7A", name: "Grade 7 — Section A", students: 30, avgProgress: 58, avgScore: 74 },
];

export const teacherResources = [
  { id: 1, title: "Teacher Manual — Grade 6", type: "manual", size: "12 MB" },
  { id: 2, title: "Lesson Plans — Term 1", type: "plan", size: "4 MB" },
  { id: 3, title: "Question Bank — Satellites", type: "questions", size: "2 MB" },
  { id: 4, title: "Weekly Test 4 + Answer Key", type: "test", size: "1 MB" },
  { id: 5, title: "Experiment Guide — Orbits", type: "experiment", size: "6 MB" },
  { id: 6, title: "Slides — Anatomy of a Satellite", type: "slides", size: "18 MB" },
];

export const classPerformance = [
  { chapter: "Ch 1", avg: 84 },
  { chapter: "Ch 2", avg: 79 },
  { chapter: "Ch 3", avg: 88 },
  { chapter: "Ch 4", avg: 72 },
  { chapter: "Ch 5", avg: 81 },
];

// ---------------- Admin panel ----------------

export const adminStats = {
  students: 37700,
  teachers: 1240,
  schools: 262,
  countries: 12,
  activeToday: 8431,
  testsThisWeek: 5120,
};

export const recentSignups = [
  { id: "SA-2041-8871", name: "Fatima Al Zaabi", grade: 5, countryCode: "AE", countryName: "UAE", date: "Today" },
  { id: "SA-2041-8870", name: "Arjun Mehta", grade: 7, countryCode: "IN", countryName: "India", date: "Today" },
  { id: "SA-2041-8869", name: "Sophie Turner", grade: 4, countryCode: "GB", countryName: "UK", date: "Yesterday" },
  { id: "SA-2041-8868", name: "Lucas Silva", grade: 9, countryCode: "BR", countryName: "Brazil", date: "Yesterday" },
];
