import Link from "next/link";
import StarBackground from "@/components/fx/StarBackground";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-space-black px-6">
      <StarBackground />
      <div className="relative z-10 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-red-400/80">
          ⚠ Signal Lost
        </p>
        <h1 className="mt-4 font-display text-7xl font-black text-star sm:text-8xl">
          4<span className="text-electric">0</span>4
        </h1>
        <p className="mt-4 max-w-md text-sm text-star/50">
          This sector of space is uncharted. The page you&apos;re looking for drifted out of
          communication range.
        </p>
        <Link href="/" className="btn-primary mt-8">
          ← Return to Mission Control
        </Link>
      </div>
    </main>
  );
}
