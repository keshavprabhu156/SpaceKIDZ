export interface Country {
  code: string;
  name: string;
  flag: string;
  students: number;
  schools: number;
}

export const countries: Country[] = [
  { code: "IN", name: "India", flag: "🇮🇳", students: 12400, schools: 86 },
  { code: "US", name: "United States", flag: "🇺🇸", students: 8200, schools: 54 },
  { code: "AE", name: "United Arab Emirates", flag: "🇦🇪", students: 3100, schools: 22 },
  { code: "SG", name: "Singapore", flag: "🇸🇬", students: 2100, schools: 15 },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", students: 2900, schools: 19 },
  { code: "AU", name: "Australia", flag: "🇦🇺", students: 1800, schools: 12 },
  { code: "JP", name: "Japan", flag: "🇯🇵", students: 1500, schools: 11 },
  { code: "DE", name: "Germany", flag: "🇩🇪", students: 1200, schools: 9 },
  { code: "FR", name: "France", flag: "🇫🇷", students: 1100, schools: 8 },
  { code: "BR", name: "Brazil", flag: "🇧🇷", students: 1700, schools: 13 },
  { code: "ZA", name: "South Africa", flag: "🇿🇦", students: 900, schools: 7 },
  { code: "KE", name: "Kenya", flag: "🇰🇪", students: 800, schools: 6 },
];

export const languages = [
  "English",
  "Hindi",
  "Arabic",
  "French",
  "German",
  "Japanese",
  "Portuguese",
  "Spanish",
  "Mandarin",
] as const;

export const timezones = [
  "UTC-08:00 (Pacific)",
  "UTC-05:00 (Eastern)",
  "UTC±00:00 (GMT)",
  "UTC+01:00 (CET)",
  "UTC+03:00 (EAT)",
  "UTC+04:00 (Gulf)",
  "UTC+05:30 (India)",
  "UTC+08:00 (Singapore/China)",
  "UTC+09:00 (Japan)",
  "UTC+10:00 (Sydney)",
] as const;

export interface Achievement {
  id: string;
  title: string;
  description: string;
  tier: "bronze" | "silver" | "gold" | "platinum";
  icon: string;
}

export const achievements: Achievement[] = [
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
