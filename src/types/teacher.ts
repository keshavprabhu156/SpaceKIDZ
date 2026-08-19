export interface ClassSummary {
  id: string;
  name: string;
  grade: number;
  studentCount: number;
  avgTestScorePct: number | null;
}

export interface ChapterPerformance {
  chapterId: string;
  title: string;
  order: number;
  avgScorePct: number | null;
  attemptCount: number;
}

export interface TeacherOverview {
  teacherName: string;
  teacherId: string;
  schoolName: string;
  classes: ClassSummary[];
  totalStudents: number;
}

/** One row of a class roster — powers /teacher/classes/[id]. */
export interface RosterStudent {
  id: string;
  name: string;
  xp: number;
  lastActiveAt: string | null;
  daysInactive: number | null;
  latestScorePct: number | null;
  attemptCount: number;
}

export interface ClassRoster {
  classId: string;
  className: string;
  grade: number;
  students: RosterStudent[];
}
