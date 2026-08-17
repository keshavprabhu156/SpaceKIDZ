export interface Segment {
  text: string;
  /** Render this segment in the blue→violet brand gradient */
  grad?: boolean;
}

/**
 * Splits a headline into per-word spans, each masked by an overflow-hidden
 * parent so the words rise into place (the Apple headline effect).
 *
 * `immediate` → animates on mount with pure CSS. Used for above-the-fold
 * headlines so they can never be left invisible by a JS/GSAP failure.
 * Otherwise the words are tagged for ScrollFX to animate on scroll.
 */
export default function SplitText({
  segments,
  className = "",
  immediate = false,
  delay = 0.25,
}: {
  segments: Segment[];
  className?: string;
  immediate?: boolean;
  delay?: number;
}) {
  let index = -1;

  return (
    <span data-words={immediate ? undefined : ""} className={className}>
      {segments.map((seg, si) =>
        seg.text.split(" ").map((word, wi) => {
          index += 1;
          return (
            // `whitespace-pre` keeps the real trailing space — inside an
            // inline-block it would otherwise collapse, gluing the words
            // together for screen readers, copy-paste and search engines.
            <span
              key={`${si}-${wi}`}
              className="inline-block overflow-hidden pb-[0.12em] align-bottom"
            >
              <span
                data-word={immediate ? undefined : ""}
                className={`inline-block whitespace-pre ${immediate ? "word-rise" : ""} ${
                  seg.grad ? "text-grad" : ""
                }`}
                style={immediate ? { animationDelay: `${delay + index * 0.06}s` } : undefined}
              >
                {word}{" "}
              </span>
            </span>
          );
        })
      )}
    </span>
  );
}
