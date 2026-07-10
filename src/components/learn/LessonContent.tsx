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

/** Placeholder player for video/animation lessons until media assets upload.
 *  The layout (player + storyboard) matches the production lesson design. */
function MediaPlaceholder({ title, briefing, kind }: { title: string; briefing: string; kind: string }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <div className="holo-panel relative flex aspect-video items-center justify-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-holo-grid bg-[size:44px_44px] opacity-25" />
        <div className="relative text-center">
          <button
            aria-label={`Play ${kind}`}
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-electric/50 bg-electric/10 text-3xl text-electric shadow-holo-strong transition-all hover:scale-105 hover:bg-electric/20"
          >
            ▶
          </button>
          <p className="mt-5 font-display text-sm font-bold uppercase tracking-wider text-star">{title}</p>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.25em] text-star/40">
            {kind} · content package uploads with curriculum assets
          </p>
        </div>
      </div>
      <div className="holo-panel p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-electric/70">Mission Briefing</p>
        <p className="mt-3 text-sm leading-relaxed text-star/65">{briefing}</p>
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-electric/70">You will learn to</p>
        <ul className="mt-2 space-y-1.5 text-xs text-star/55">
          <li>▸ Explain the key idea in your own words</li>
          <li>▸ Connect it to a real mission example</li>
          <li>▸ Pass the checkpoint at the end of this chapter</li>
        </ul>
      </div>
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
}: {
  type: LessonType;
  title: string;
  briefing: string;
}) {
  switch (type) {
    case "3d-model":
      return <SatelliteExplorer />;
    case "simulation":
      return <OrbitSimulator />;
    case "quiz":
      return <SampleTest />;
    case "video":
      return <MediaPlaceholder title={title} briefing={briefing} kind="Video" />;
    case "animation":
      return <MediaPlaceholder title={title} briefing={briefing} kind="Animation" />;
    default:
      return <InstructionCard title={title} briefing={briefing} kind={type} />;
  }
}
