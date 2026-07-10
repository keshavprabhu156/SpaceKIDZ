"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Lesson completion + navigation. Progress lives in localStorage until the
 * Prisma backend lands (key mirrors the LessonProgress model); the XP toast
 * matches the production award flow.
 */

const STORE_KEY = "isc:completed-lessons:v1";

function readCompleted(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export default function LessonFooter({
  lessonId,
  xp,
  prevId,
  nextId,
  gradeHref,
}: {
  lessonId: string;
  xp: number;
  prevId: string | null;
  nextId: string | null;
  gradeHref: string;
}) {
  const [completed, setCompleted] = useState(false);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    setCompleted(readCompleted().includes(lessonId));
  }, [lessonId]);

  function markComplete() {
    if (completed) return;
    const list = readCompleted();
    if (!list.includes(lessonId)) {
      localStorage.setItem(STORE_KEY, JSON.stringify([...list, lessonId]));
    }
    setCompleted(true);
    setToast(true);
    setTimeout(() => setToast(false), 2600);
  }

  return (
    <div className="mt-8">
      <div className="holo-panel flex flex-col items-center justify-between gap-4 p-5 sm:flex-row">
        {prevId ? (
          <Link href={`/student/learn/${prevId}`} className="btn-ghost !py-2.5">
            ← Previous Lesson
          </Link>
        ) : (
          <Link href={gradeHref} className="btn-ghost !py-2.5">
            ← Chapter Overview
          </Link>
        )}

        <button
          onClick={markComplete}
          disabled={completed}
          className={completed ? "btn-secondary !cursor-default !py-2.5" : "btn-primary !py-2.5"}
        >
          {completed ? "✓ Mission Logged" : `Complete Lesson · +${xp} XP`}
        </button>

        {nextId ? (
          <Link href={`/student/learn/${nextId}`} className="btn-secondary !py-2.5">
            Next Lesson →
          </Link>
        ) : (
          <Link href="/student/tests" className="btn-secondary !py-2.5">
            Take Weekly Test →
          </Link>
        )}
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed bottom-8 left-1/2 z-[70] -translate-x-1/2"
          >
            <div className="holo-panel holo-border flex items-center gap-3 px-6 py-3.5 shadow-holo-strong">
              <span className="text-2xl">🏅</span>
              <div>
                <p className="font-display text-sm font-bold uppercase tracking-wider text-gold text-glow-gold">
                  +{xp} XP Earned
                </p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-star/50">
                  Mission logged · keep the streak alive
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
