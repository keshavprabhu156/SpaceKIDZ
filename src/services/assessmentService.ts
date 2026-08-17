import apiClient from "./apiClient";
import type {
  ActiveTestResponse,
  GradeRequest,
  GradeResult,
  TestSubmission,
  TestSubmitResult,
} from "@/types/assessment";

/** This week's rotating weekly test (visitors get a static demo test). */
export const fetchActiveTest = () =>
  apiClient.get<ActiveTestResponse>("/api/student/tests/active", {
    skipAuthRedirect: true,
  } as RequestInit);

/** Grades a single answer server-side — instant feedback without shipping the key. */
export const gradeAnswer = (payload: GradeRequest) =>
  apiClient.post<GradeResult>("/api/student/tests/grade", payload);

/** Submits all answers; the server scores them and awards XP + Space Coins. */
export const submitTest = (payload: TestSubmission) =>
  apiClient.post<TestSubmitResult>("/api/student/tests/submit", payload);
