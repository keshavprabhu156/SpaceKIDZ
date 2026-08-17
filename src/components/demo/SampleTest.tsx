"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchActiveTest,
  gradeAnswer,
  submitTest,
} from "@/services/assessmentService";
import type { Question } from "@/types/assessment";

/**
 * Weekly-test engine — the same question-type components power the real
 * assessments inside the student portal.
 *
 * Two grading paths, by design:
 *  - signed-in student → answers are graded by the SERVER (the answer key is
 *    never sent to the browser) and the final score is recomputed on submit;
 *  - anonymous visitor → the static demo test is graded locally, because it
 *    awards no XP and records no attempt, so there is nothing to cheat.
 */

const fallbackQuestions: Question[] = [
  {
    kind: "mcq",
    prompt: "A satellite in orbit is constantly…",
    options: [
      "Floating with no gravity",
      "Falling around the Earth",
      "Pushed up by its engines",
      "Held up by the atmosphere",
    ],
    answer: 1,
    explain:
      "Orbit is free fall with enough sideways speed that the ground keeps curving away beneath you.",
  },
  {
    kind: "boolean",
    prompt: "Geostationary satellites appear fixed over one point on the equator.",
    answer: true,
    explain:
      "At ~35,786 km altitude an orbit takes exactly one day, matching Earth's rotation.",
  },
  {
    kind: "image",
    prompt: "Identify the highlighted satellite component.",
    figure: "🛰 ⟵ [ ▤▤ flat panels on both wings ]",
    options: ["Antenna dish", "Solar arrays", "Thruster block", "Star tracker"],
    answer: 1,
    explain: "The flat wing panels are solar arrays — the satellite's power plant.",
  },
  {
    kind: "match",
    prompt: "Match each orbit to its typical mission.",
    pairs: [
      { left: "Low Earth Orbit", right: "Space stations & imaging" },
      { left: "Geostationary", right: "TV & weather satellites" },
      { left: "Polar Orbit", right: "Whole-Earth mapping" },
    ],
    explain:
      "LEO is close and fast, GEO hovers over one spot, polar orbits sweep the whole globe as Earth spins beneath.",
  },
];

interface Feedback {
  correct: boolean;
  explain: string;
}

export default function SampleTest() {
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [boolPick, setBoolPick] = useState<boolean | null>(null);
  const [matches, setMatches] = useState<Record<number, string>>({});
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [grading, setGrading] = useState(false);
  const [finished, setFinished] = useState(false);

  // Every answer given, keyed by question id — this is what gets submitted.
  const [answers, setAnswers] = useState<Record<string, unknown>>({});

  const [questions, setQuestions] = useState<Question[]>([]);
  const [chapterTitle, setChapterTitle] = useState("Weekly Assessment");
  const [testId, setTestId] = useState("");
  const [hasAttempted, setHasAttempted] = useState(false);
  const [pastScore, setPastScore] = useState<number | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchActiveTest()
      .then((data) => {
        if (data.test) {
          setQuestions(data.test.questions);
          setChapterTitle(data.test.chapterTitle);
          setTestId(data.test.id);
        }
        setHasAttempted(data.hasAttempted);
        setPastScore(data.pastScore);
        setAuthenticated(data.authenticated);
      })
      .catch(() => setError("Couldn’t load this week’s assessment."))
      .finally(() => setLoading(false));
  }, []);

  const questionsToUse = questions.length > 0 ? questions : fallbackQuestions;
  const q = questionsToUse[i];
  const questionKey = q?.id ?? String(i);

  /** The student's answer for the current question, in the server's shape. */
  function currentAnswer(): unknown {
    if (q.kind === "mcq" || q.kind === "image") return picked;
    if (q.kind === "boolean") return boolPick;
    return matches; // match → { pairIndex: chosenRight }
  }

  /** Local grading — demo test only (its answer key is already in the browser). */
  function gradeLocally(): Feedback {
    let correct = false;
    if (q.kind === "mcq" || q.kind === "image") correct = picked === q.answer;
    else if (q.kind === "boolean") correct = boolPick === q.answer;
    else correct = (q.pairs ?? []).every((p, idx) => matches[idx] === p.right);
    // (demo only — a graded match question has no `right` client-side)
    return { correct, explain: q.explain ?? "" };
  }

  async function submitAnswer() {
    if (feedback || grading) return;

    const answer = currentAnswer();
    setAnswers((a) => ({ ...a, [questionKey]: answer }));

    // Signed in → ask the server; it holds the answer key.
    if (authenticated && q.id) {
      setGrading(true);
      try {
        const result = await gradeAnswer({ testId, questionId: q.id, answer });
        setFeedback(result);
        if (result.correct) setScore((s) => s + 1);
      } catch {
        setError("Couldn’t grade that answer. Check your connection.");
      } finally {
        setGrading(false);
      }
      return;
    }

    const local = gradeLocally();
    setFeedback(local);
    if (local.correct) setScore((s) => s + 1);
  }

  async function next() {
    const isLast = i + 1 >= questionsToUse.length;

    if (isLast) {
      setFinished(true);

      if (authenticated && testId) {
        try {
          // The server recomputes the score — we don't send one.
          const result = await submitTest({ testId, answers });
          setScore(result.score);
          setPastScore(result.score);
          setHasAttempted(true);
        } catch (err) {
          // 409 = already completed; surface the recorded score instead.
          setError(
            err instanceof Error ? err.message : "Couldn’t record your attempt."
          );
        }
      }
      return;
    }

    setI(i + 1);
    setPicked(null);
    setBoolPick(null);
    setMatches({});
    setFeedback(null);
  }

  function restart() {
    setI(0);
    setScore(0);
    setPicked(null);
    setBoolPick(null);
    setMatches({});
    setFeedback(null);
    setFinished(false);
    setAnswers({});
  }

  const answered =
    q?.kind === "mcq" || q?.kind === "image"
      ? picked !== null
      : q?.kind === "boolean"
        ? boolPick !== null
        : Object.keys(matches).length === (q?.pairs?.length ?? 0);

  if (loading) {
    return (
      <div className="holo-panel flex h-[260px] items-center justify-center">
        <p className="animate-pulse font-mono text-[11px] uppercase tracking-[0.3em] text-electric/60">
          Retrieving assessment…
        </p>
      </div>
    );
  }

  const isCompleted = finished || (hasAttempted && authenticated);

  if (isCompleted) {
    const displayScore = finished ? score : (pastScore ?? 0);
    const pct = Math.round((displayScore / questionsToUse.length) * 100);
    return (
      <div className="holo-panel holo-border p-10 text-center">
        <p className="text-4xl">{pct >= 75 ? "🏅" : pct >= 50 ? "🛰" : "🔁"}</p>
        <h3 className="mt-4 font-display text-2xl font-bold text-star">
          Mission Debrief
        </h3>
        <p className="mt-2 font-display text-4xl font-black text-electric">{pct}%</p>
        <p className="mt-2 text-sm text-star/50">
          {displayScore} of {questionsToUse.length} correct ·{" "}
          {pct >= 75
            ? "Assessment passed — XP and badge awarded."
            : "Assessment completed — final score recorded."}
        </p>

        {error && (
          <p className="mt-4 rounded-lg border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-xs text-amber-200">
            {error}
          </p>
        )}

        {authenticated ? (
          <div className="mt-6 flex flex-col items-center gap-2">
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/5 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-emerald-400">
              🔒 Assessment Completed
            </span>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-star/30">
              Next weekly test unlocks Monday
            </p>
          </div>
        ) : (
          <button onClick={restart} className="btn-secondary mt-8">
            Retake Assessment
          </button>
        )}
      </div>
    );
  }

  // For a graded test we only know whether the student's own choice was right —
  // the correct option is deliberately not revealed by the server.
  const revealed = feedback !== null;
  const knowsKey = !authenticated; // demo test has the key locally

  const optionCls = (active: boolean, correct?: boolean, wrong?: boolean) =>
    `w-full rounded-xl border px-5 py-3.5 text-left text-sm transition-all ${
      correct
        ? "border-emerald-400/60 bg-emerald-400/10 text-emerald-300"
        : wrong
          ? "border-red-400/60 bg-red-400/10 text-red-300"
          : active
            ? "border-electric bg-electric/10 text-star shadow-holo"
            : "border-white/10 bg-white/[0.02] text-star/70 hover:border-electric/40"
    }`;

  return (
    <div className="holo-panel p-7 sm:p-9">
      <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-star/40">
        <span>{authenticated ? chapterTitle : `${chapterTitle} (Demo)`}</span>
        <span>
          Q {i + 1} / {questionsToUse.length} · Score {score}
        </span>
      </div>
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full bg-gradient-to-r from-electric to-nebula-light transition-all duration-500"
          style={{
            width: `${((i + (revealed ? 1 : 0)) / questionsToUse.length) * 100}%`,
          }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={i}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
        >
          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-electric/60">
            {
              {
                mcq: "Multiple Choice",
                boolean: "True or False",
                match: "Match the Following",
                image: "Image Identification",
              }[q.kind as "mcq" | "boolean" | "match" | "image"]
            }
          </p>
          <h3 className="mt-2 text-lg font-medium text-star">{q.prompt}</h3>

          {q.kind === "image" && q.figure && (
            <div className="mt-4 rounded-xl border border-electric/20 bg-space-panel/60 p-6 text-center font-mono text-lg text-electric">
              {q.figure}
            </div>
          )}

          <div className="mt-5 space-y-2.5">
            {(q.kind === "mcq" || q.kind === "image") &&
              (q.options ?? []).map((o, oi) => (
                <button
                  key={o}
                  onClick={() => !revealed && setPicked(oi)}
                  className={optionCls(
                    picked === oi,
                    revealed && knowsKey && oi === q.answer,
                    revealed && picked === oi && !feedback!.correct
                  )}
                >
                  <span className="mr-3 font-mono text-electric/60">
                    {String.fromCharCode(65 + oi)}
                  </span>
                  {o}
                </button>
              ))}

            {q.kind === "boolean" &&
              [true, false].map((v) => (
                <button
                  key={String(v)}
                  onClick={() => !revealed && setBoolPick(v)}
                  className={optionCls(
                    boolPick === v,
                    revealed && knowsKey && v === q.answer,
                    revealed && boolPick === v && !feedback!.correct
                  )}
                >
                  {v ? "✓ True" : "✗ False"}
                </button>
              ))}

            {q.kind === "match" &&
              (q.pairs ?? []).map((p, pi) => (
                <div key={p.left} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <span className="w-full rounded-lg border border-white/10 bg-white/[0.02] px-4 py-2.5 text-sm text-star/80 sm:w-1/2">
                    {p.left}
                  </span>
                  <select
                    value={matches[pi] ?? ""}
                    disabled={revealed}
                    onChange={(e) =>
                      setMatches((m) => ({ ...m, [pi]: e.target.value }))
                    }
                    className={`input-holo sm:w-1/2 ${
                      revealed && knowsKey
                        ? matches[pi] === p.right
                          ? "!border-emerald-400/60"
                          : "!border-red-400/60"
                        : ""
                    }`}
                  >
                    <option value="" disabled>
                      Select match…
                    </option>
                    {/* Graded tests get a shuffled pool from the server; the
                        demo derives it from its local pairs. */}
                    {(q.rightOptions ?? (q.pairs ?? []).map((x) => x.right!)).map(
                      (right) => (
                        <option key={right} value={right} className="bg-space-navy">
                          {right}
                        </option>
                      )
                    )}
                  </select>
                </div>
              ))}
          </div>

          {error && !revealed && (
            <p className="mt-4 rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-2 text-xs text-red-300">
              {error}
            </p>
          )}

          {revealed && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-5 rounded-xl border p-4 text-sm ${
                feedback!.correct
                  ? "border-emerald-400/30 bg-emerald-400/5 text-emerald-200"
                  : "border-red-400/30 bg-red-400/5 text-red-200"
              }`}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.25em]">
                {feedback!.correct ? "✓ Correct" : "✗ Not quite"}
              </p>
              {feedback!.explain && (
                <p className="mt-2 text-star/70">{feedback!.explain}</p>
              )}
            </motion.div>
          )}

          <div className="mt-7 flex justify-end gap-3">
            {!revealed ? (
              <button
                onClick={submitAnswer}
                disabled={!answered || grading}
                className="btn-primary disabled:opacity-40"
              >
                {grading ? "Checking…" : "Submit Answer"}
              </button>
            ) : (
              <button onClick={next} className="btn-primary">
                {i + 1 >= questionsToUse.length
                  ? "View Debrief →"
                  : "Next Question →"}
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
