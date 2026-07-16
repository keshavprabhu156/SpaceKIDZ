"use client";

import dynamic from "next/dynamic";
import SampleTest from "@/components/demo/SampleTest";

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

export default function DemoClient() {
  return (
    <div className="space-y-16">
      <OrbitSimulator />
      <div id="quiz-section">
        <h2 className="mb-5 font-display text-lg font-bold uppercase tracking-[0.2em] text-electric">
          Mission 2 · Sample Weekly Assessment
        </h2>
        <SampleTest />
      </div>
    </div>
  );
}
