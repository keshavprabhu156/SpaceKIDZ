"use client";

import dynamic from "next/dynamic";
import type { LessonType } from "@/data/curriculum";
import SampleTest from "@/components/demo/SampleTest";

const SatelliteExplorer = dynamic(() => import("./SatelliteExplorer"), {
  ssr: false,
  loading: () => (
    <div className="holo-panel flex h-[380px] items-center justify-center sm:h-[440px]">
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-electric/60">
        Deploying model…
      </p>
    </div>
  ),
});

const OrbitSimulator = dynamic(() => import("@/components/demo/OrbitSimulator"), {
  ssr: false,
  loading: () => (
    <div className="holo-panel flex h-[420px] items-center justify-center sm:h-[520px]">
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-electric/60">
        Spooling up simulation…
      </p>
    </div>
  ),
});

/**
 * Reading lesson — the primary format, since the curriculum is built on book
 * material. Renders the chapter text in a comfortable reading measure with a
 * sidebar of objectives.
 *
 * `body` holds the book content. Until the Space Science text is loaded, the
 * briefing stands in for it.
 */
function ReadingContent({
  title,
  briefing,
  body,
}: {
  title: string;
  briefing: string;
  body?: string[];
}) {
  const paragraphs = body?.length ? body : null;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_290px]">
      <article className="holo-panel p-7 sm:p-9">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-electric/70">
          Reading
        </p>
        <h3 className="mt-2 font-display text-2xl font-bold leading-snug text-star">
          {title}
        </h3>

        {/* max-w-prose keeps the line length readable (~70 characters) */}
        <div className="mt-6 max-w-prose space-y-4 text-[15px] leading-[1.75] text-star/75">
          {paragraphs ? (
            paragraphs.map((para, i) => <p key={i}>{para}</p>)
          ) : (
            <>
              <p>{briefing}</p>
              <p className="rounded-lg border border-star/10 bg-white/[0.02] p-4 text-sm text-star/50">
                The full chapter text from <em>Space Science</em> loads here once the
                book content is added for this lesson.
              </p>
            </>
          )}
        </div>
      </article>

      <aside className="holo-panel h-fit p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-electric/70">
          You will learn to
        </p>
        <ul className="mt-3 space-y-2 text-xs leading-relaxed text-star/60">
          <li>▸ Explain the key idea in your own words</li>
          <li>▸ Connect it to a real mission example</li>
          <li>▸ Pass the checkpoint at the end of this chapter</li>
        </ul>
        <p className="mt-5 border-t border-star/10 pt-4 text-xs text-star/45">
          Take your time. You can return to this page any time from your curriculum.
        </p>
      </aside>
    </div>
  );
}

/** Structured layout for activities, experiments and readings. */
function InstructionCard({ title, briefing, kind }: { title: string; briefing: string; kind: string }) {
  const steps =
    kind === "experiment"
      ? [
          "Read the full procedure with your teacher or guardian before starting",
          "Gather the materials listed in your mission kit",
          "Follow each step and record observations in your logbook",
          "Photograph your result and submit it as an assignment",
        ]
      : [
          "Read the briefing and study the reference material",
          "Complete the worksheet section by section",
          "Compare answers with a crewmate if you're in a classroom",
          "Submit for review to earn your XP",
        ];
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="holo-panel p-7">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-electric/70">Objective</p>
        <h3 className="mt-2 font-display text-base font-bold uppercase tracking-wider text-star">{title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-star/65">{briefing}</p>
        <p className="mt-5 rounded-lg border border-white/5 bg-white/[0.02] p-3 font-mono text-[10px] uppercase tracking-widest text-star/40">
          Worksheet and materials list arrive with the curriculum content package
        </p>
      </div>
      <div className="holo-panel p-7">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-electric/70">Procedure</p>
        <ol className="mt-4 space-y-3">
          {steps.map((s, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-star/70">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-electric/30 bg-electric/5 font-mono text-[10px] text-electric">
                {i + 1}
              </span>
              {s}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default function LessonContent({
  type,
  title,
  briefing,
  body,
}: {
  type: LessonType;
  title: string;
  briefing: string;
  /** Book text for reading lessons, one entry per paragraph. */
  body?: string[];
}) {
  switch (type) {
    case "3d-model":
      return <SatelliteExplorer />;
    case "simulation":
      return <OrbitSimulator />;
    case "quiz":
      return <SampleTest />;
    case "reading":
      return <ReadingContent title={title} briefing={briefing} body={body} />;
    default:
      return <InstructionCard title={title} briefing={briefing} kind={type} />;
  }
}
