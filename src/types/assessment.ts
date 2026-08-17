export type QuestionKind =
  | "mcq"
  | "boolean"
  | "match"
  | "drag-drop"
  | "image"
  | "label"
  | "short"
  | "numeric";

export interface MatchPair {
  left: string;
  right: string;
}

/**
 * A question as served to the client.
 *
 * `answer` / `explain` are present ONLY for the unauthenticated demo test,
 * which is graded in the browser and carries no XP. For a signed-in student
 * they are stripped server-side and grading happens over the network.
 */
export interface Question {
  id?: string;
  kind: QuestionKind;
  prompt: string;
  options?: string[];
  /** For graded tests only `left` is populated — the pairing is the answer. */
  pairs?: Partial<MatchPair>[];
  /** Shuffled pool of right-hand choices for a graded match question. */
  rightOptions?: string[];
  figure?: string;
  answer?: number | boolean | string;
  explain?: string;
}

/** Payload for POST /api/student/tests/grade */
export interface GradeRequest {
  testId: string;
  questionId: string;
  answer: unknown;
}

export interface GradeResult {
  correct: boolean;
  explain: string;
}

export interface WeeklyTest {
  id: string;
  chapterTitle: string;
  questions: Question[];
}

/** Response shape of GET /api/student/tests/active */
export interface ActiveTestResponse {
  authenticated: boolean;
  test: WeeklyTest;
  hasAttempted: boolean;
  pastScore: number | null;
}

/**
 * Payload for POST /api/student/tests/submit.
 * Note there is no `score` — the server computes it from the answer key.
 */
export interface TestSubmission {
  testId: string;
  answers: Record<string, unknown>;
}

export interface TestSubmitResult {
  ok: true;
  /** Authoritative, server-computed score. */
  score: number;
  total: number;
  xpAwarded: number;
  coinsAwarded: number;
}
