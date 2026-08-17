"use client";

import SpaceBackdrop from "@/components/fx/SpaceBackdrop";

/** Full-bleed space backdrop with a legibility wash — the shell shared by the
 *  login and register pages. */
export default function CinematicBackdrop() {
  return (
    <div className="absolute inset-0" aria-hidden>
      <SpaceBackdrop />
      <div className="absolute inset-0 bg-gradient-to-r from-space-black/90 via-space-black/45 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-space-black to-transparent" />
    </div>
  );
}
