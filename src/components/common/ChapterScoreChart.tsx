export interface ChapterScoreBar {
  id: string;
  label: string;
  scorePct: number | null;
}

/**
 * A percentage-score bar chart with a real fixed 0–100 axis and gridlines —
 * used by both the teacher (class average) and student (own score) chapter
 * views. Bars are always scaled against a fixed 100% ceiling, never against
 * the highest value in the current dataset: scaling relative to "the best bar
 * in this set" is what makes an 80% look like it's maxed out just because
 * nothing scored higher, which misrepresents the actual number.
 */
export default function ChapterScoreChart({ bars }: { bars: ChapterScoreBar[] }) {
  const gridlines = [100, 50, 0];

  return (
    <div className="flex gap-3">
      {/* Axis */}
      <div className="flex h-40 flex-col justify-between pb-5 text-[10px] text-star/35">
        {gridlines.map((g) => (
          <span key={g}>{g}%</span>
        ))}
      </div>

      {/* Plot area */}
      <div className="relative flex-1">
        {/* Gridlines */}
        <div className="absolute inset-x-0 top-0 flex h-40 flex-col justify-between">
          {gridlines.map((g) => (
            <div key={g} className="border-t border-star/[0.07]" />
          ))}
        </div>

        <div className="flex h-40 items-end gap-2.5">
          {bars.map((b) => (
            <div key={b.id} className="flex h-full flex-1 flex-col items-center justify-end">
              {b.scorePct !== null ? (
                <div
                  className="w-full rounded-t-[2px] border-t-2 border-electric bg-electric/25"
                  style={{ height: `${Math.max(2, b.scorePct)}%` }}
                  title={`${b.scorePct}%`}
                />
              ) : (
                <div className="h-1 w-full border-t border-dashed border-star/15" />
              )}
            </div>
          ))}
        </div>
        <div className="mt-1.5 flex gap-2.5">
          {bars.map((b) => (
            <span key={b.id} className="flex-1 text-center text-[10px] leading-tight text-star/40">
              {b.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
