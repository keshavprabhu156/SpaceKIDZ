/**
 * Full-bleed cinematic photo backdrop for the login/register pages.
 *
 * Deliberately a plain <img>, not a live 3D/WebGL scene: the reference look
 * (sharp astronaut with a reflective visor, lit Earth, Milky Way) is a single
 * baked composite, not something a procedural mesh composited over a photo
 * can match — and a static image costs nothing to scale/animate via CSS,
 * unlike the live-canvas approach that caused scroll jank earlier.
 *
 * object-position is biased right: the source image keeps its left third
 * dark and empty specifically so the login/register form can sit over it
 * without covering the astronaut or Earth.
 */
export default function CinematicBackdrop() {
  return (
    <div className="absolute inset-0 bg-space-black" aria-hidden>
      <img
        src="/login-hero.jpg"
        alt=""
        draggable={false}
        className="absolute inset-0 h-full w-full select-none object-cover"
        style={{ objectPosition: "68% center" }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-space-black/92 via-space-black/50 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-space-black to-transparent" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-space-black/60 to-transparent" />
    </div>
  );
}
