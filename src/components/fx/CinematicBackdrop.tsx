"use client";

import dynamic from "next/dynamic";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
  loading: () => null,
});

/** Full-bleed 3D space scene (Earth, lunar surface, astronaut) with a
 *  left-to-right legibility wash — the cinematic shell used by auth pages. */
export default function CinematicBackdrop() {
  return (
    <div className="absolute inset-0" aria-hidden>
      <img
        src="/space.jpg"
        alt=""
        draggable={false}
        className="absolute inset-0 h-full w-full select-none object-cover"
      />
      <div className="absolute inset-0">
        <HeroScene />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-space-black via-space-black/65 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-space-black/85 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-space-black/60 to-transparent" />
    </div>
  );
}
