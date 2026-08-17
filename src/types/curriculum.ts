/**
 * Delivery format of a lesson.
 *
 * There are deliberately NO video/animation formats: the curriculum is built on
 * book material and quizzes, so written lessons (`reading`) carry the content
 * and the interactive formats support it.
 */
export type LessonType =
  | "reading"
  | "3d-model"
  | "activity"
  | "experiment"
  | "simulation"
  | "quiz";

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  duration: number; // minutes
  xp: number;
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  hasWeeklyTest: boolean;
}

export interface Term {
  id: string;
  title: string;
  chapters: Chapter[];
}

export interface Grade {
  grade: number;
  codename: string;
  tagline: string;
  theme: string;
  color: string; // accent used on cards
  terms: Term[];
}

/** Full context for a lesson: its grade, term, chapter and neighbours. */
export interface LessonRef {
  grade: Grade;
  term: Term;
  chapter: Chapter;
  lesson: Lesson;
  prev: Lesson | null;
  next: Lesson | null;
}
