"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Weekly-test engine demo — the same question-type components power the
 * real assessments inside the student portal.
 */

type Question =
  | { kind: "mcq"; prompt: string; options: string[]; answer: number; explain: string }
  | { kind: "boolean"; prompt: string; answer: boolean; explain: string }
  | { kind: "match"; prompt: string; pairs: { left: string; right: string }[]; explain: string }
  | { kind: "image"; prompt: string; figure: string; options: string[]; answer: number; explain: string };

const fallbackQuestions: Question[] = [
  {
    kind: "mcq",
    prompt: "A satellite in orbit is constantly…",
    options: ["Floating with no gravity", "Falling around the Earth", "Pushed up by its engines", "Held up by the atmosphere"],
    answer: 1,
    explain: "Orbit is free fall with enough sideways speed that the ground keeps curving away beneath you.",
  },
  {
    kind: "boolean",
    prompt: "Geostationary satellites appear fixed over one point on the equator.",
    answer: true,
    explain: "At ~35,786 km altitude an orbit takes exactly one day, matching Earth's rotation.",
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
    explain: "LEO is close and fast, GEO hovers over one spot, polar orbits sweep the whole globe as Earth spins beneath.",
  },
];

export default function SampleTest() {
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [boolPick, setBoolPick] = useState<boolean | null>(null);
  const [matches, setMatches] = useState<Record<number, string>>({});
  const [revealed, setRevealed] = useState(false);
  const [finished, setFinished] = useState(false);

  // Dynamic weekly assessment states
  const [questions, setQuestions] = useState<Question[]>([]);
  const [chapterTitle, setChapterTitle] = useState("Weekly Assessment");
  const [testId, setTestId] = useState("");
  const [hasAttempted, setHasAttempted] = useState(false);
  const [pastScore, setPastScore] = useState<number | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/student/tests/active")
      .then((res) => res.json())
      .then((data) => {
        if (data.test) {
          setQuestions(data.test.questions);
          setChapterTitle(data.test.chapterTitle);
          setTestId(data.test.id);
        }
        setHasAttempted(data.hasAttempted);
        setPastScore(data.pastScore);
        setAuthenticated(data.authenticated);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const questionsToUse = questions.length > 0 ? questions : fallbackQuestions;
  const q = questionsToUse[i];

  function checkMatch(): boolean {
    if (q.kind !== "match") return false;
    return q.pairs.every((p, idx) => matches[idx] === p.right);
  }

  function isCorrect(): boolean {
    if (q.kind === "mcq" || q.kind === "image") return picked === q.answer;
    if (q.kind === "boolean") return boolPick === q.answer;
    return checkMatch();
  }

  function submit() {
    if (revealed) return;
    if (isCorrect()) setScore((s) => s + 1);
    setRevealed(true);
  }

  function next() {
    if (i + 1 >= questionsToUse.length) {
      setFinished(true);
      
      // Submit attempt score to database if logged-in cadet
      if (authenticated && testId) {
        fetch("/api/student/tests/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            testId,
            score,
            answers: {},
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.ok) {
              setHasAttempted(true);
              setPastScore(score);
            }
          })
          .catch(console.error);
      }
      return;
    }
    setI(i + 1);
    setPicked(null);
    setBoolPick(null);
    setMatches({});
    setRevealed(false);
  }

  function restart() {
    setI(0); setScore(0); setPicked(null); setBoolPick(null);
    setMatches({}); setRevealed(false); setFinished(false);
  }

  const answered =
    (q.kind === "mcq" || q.kind === "image") ? picked !== null
    : q.kind === "boolean" ? boolPick !== null
    : Object.keys(matches).length === q.pairs.length;

  if (loading) {
    return (
      <div className="holo-panel flex h-[260px] items-center justify-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-electric/60 animate-pulse">
          Retrieving assessment...
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
        <h3 className="mt-4 font-display text-2xl font-bold uppercase tracking-wide text-star">
          Mission Debrief
        </h3>
        <p className="mt-2 font-display text-4xl font-black text-electric">{pct}%</p>
        <p className="mt-2 text-sm text-star/50">
          {displayScore} of {questionsToUse.length} correct · {pct >= 75 ? "Assessment passed — XP and badge awarded." : "Assessment completed — final score recorded."}
        </p>
        
        {authenticated ? (
          <div className="mt-6 flex flex-col items-center gap-2">
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/5 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-emerald-400">
              🔒 Assessment Completed
            </span>
            <p className="text-[10px] font-mono text-star/30 uppercase tracking-widest mt-1">
              Next weekly test unlocks Monday
            </p>
          </div>
        ) : (
          <button onClick={restart} className="btn-secondary mt-8">Retake Assessment</button>
        )}
      </div>
    );
  }

  const optionCls = (active: boolean, correct?: boolean, wrong?: boolean) =>
    `w-full rounded-xl border px-5 py-3.5 text-left text-sm transition-all ${
      correct ? "border-emerald-400/60 bg-emerald-400/10 text-emerald-300"
      : wrong ? "border-red-400/60 bg-red-400/10 text-red-300"
      : active ? "border-electric bg-electric/10 text-star shadow-holo"
      : "border-white/10 bg-white/[0.02] text-star/70 hover:border-electric/40"
    }`;

  return (
    <div className="holo-panel p-7 sm:p-9">
      <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-star/40">
        <span>{authenticated ? chapterTitle : `${chapterTitle} (Demo)`}</span>
        <span>Q {i + 1} / {questionsToUse.length} · Score {score}</span>
      </div>
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full bg-gradient-to-r from-electric to-nebula-light transition-all duration-500"
          style={{ width: `${((i + (revealed ? 1 : 0)) / questionsToUse.length) * 100}%` }}
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
            {{ mcq: "Multiple Choice", boolean: "True or False", match: "Match the Following", image: "Image Identification" }[q.kind]}
          </p>
          <h3 className="mt-2 text-lg font-medium text-star">{q.prompt}</h3>

          {q.kind === "image" && (
            <div className="mt-4 rounded-xl border border-electric/20 bg-space-panel/60 p-6 text-center font-mono text-lg text-electric">
              {q.figure}
            </div>
          )}

          <div className="mt-5 space-y-2.5">
            {(q.kind === "mcq" || q.kind === "image") &&
              q.options.map((o, oi) => (
                <button
                  key={o}
                  onClick={() => !revealed && setPicked(oi)}
                  className={optionCls(picked === oi, revealed && oi === q.answer, revealed && picked === oi && oi !== q.answer)}
                >
                  <span className="mr-3 font-mono text-electric/60">{String.fromCharCode(65 + oi)}</span>
                  {o}
                </button>
              ))}

            {q.kind === "boolean" &&
              [true, false].map((v) => (
                <button
                  key={String(v)}
                  onClick={() => !revealed && setBoolPick(v)}
                  className={optionCls(boolPick === v, revealed && v === q.answer, revealed && boolPick === v && v !== q.answer)}
                >
                  {v ? "✓ True" : "✗ False"}
                </button>
              ))}

            {q.kind === "match" &&
              q.pairs.map((p, pi) => (
                <div key={p.left} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <span className="w-full rounded-lg border border-white/10 bg-white/[0.02] px-4 py-2.5 text-sm text-star/80 sm:w-1/2">
                    {p.left}
                  </span>
                  <select
                    value={matches[pi] ?? ""}
                    disabled={revealed}
                    onChange={(e) => setMatches((m) => ({ ...m, [pi]: e.target.value }))}
                    className={`input-holo sm:w-1/2 ${revealed ? (matches[pi] === p.right ? "!border-emerald-400/60" : "!border-red-400/60") : ""}`}
                  >
                    <option value="" disabled>Select match…</option>
                    {q.pairs.map((x) => (
                      <option key={x.right} value={x.right} className="bg-space-navy">{x.right}</option>
                    ))}
                  </select>
                </div>
              ))}
          </div>

          {revealed && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-5 rounded-xl border p-4 text-sm ${isCorrect() ? "border-emerald-400/30 bg-emerald-400/5 text-emerald-200" : "border-red-400/30 bg-red-400/5 text-red-200"}`}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.25em]">
                {isCorrect() ? "✓ Correct — +60 XP" : "✗ Not quite"}
              </p>
              <p className="mt-2 text-star/70">{q.explain}</p>
            </motion.div>
          )}

          <div className="mt-7 flex justify-end gap-3">
            {!revealed ? (
              <button onClick={submit} disabled={!answered} className="btn-primary disabled:opacity-40">
                Submit Answer
              </button>
            ) : (
              <button onClick={next} className="btn-primary">
                {i + 1 >= questionsToUse.length ? "View Debrief →" : "Next Question →"}
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
