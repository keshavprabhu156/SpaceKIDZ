export interface LeaderboardEntry {
  id: string;
  name: string;
  xp: number;
  isYou: boolean;
}

export interface StudentChapterScore {
  chapterId: string;
  title: string;
  order: number;
  scorePct: number | null;
}

export interface RecentAttempt {
  chapterTitle: string;
  scorePct: number;
  createdAt: string;
}

export interface EarnedBadge {
  id: string;
  title: string;
  description: string;
  tier: string;
  icon: string;
  earnedAt: string;
}

export interface StudentOverview {
  name: string;
  id: string;
  grade: number;
  xp: number;
  spaceCoins: number;
  streakDays: number;
  className: string | null;
  schoolName: string | null;
  classRank: number | null;
  classSize: number;
  leaderboard: LeaderboardEntry[];
  chapterScores: StudentChapterScore[];
  recentAttempts: RecentAttempt[];
  badges: EarnedBadge[];
  chaptersAttempted: number;
  chaptersTotal: number;
}
