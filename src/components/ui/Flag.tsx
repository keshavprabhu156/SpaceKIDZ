"use client";

import { useState } from "react";

/**
 * Country flag with graceful degradation.
 * Emoji flags render as bare letter codes on Windows, so we use flagcdn's
 * tiny PNGs; if the CDN is unreachable (offline classrooms), we fall back to
 * a mission-control style code chip. Swap for self-hosted SVGs in
 * /public/flags when brand assets arrive.
 */
export default function Flag({
  code,
  size = 20,
  className = "",
}: {
  code: string; // ISO-3166 alpha-2
  size?: number;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const cc = code.toLowerCase();

  if (failed) {
    return (
      <span
        className={`inline-flex items-center justify-center rounded border border-electric/30 bg-electric/10 px-1 font-mono text-[9px] uppercase tracking-widest text-electric ${className}`}
        style={{ minWidth: size, height: size * 0.75 }}
        aria-label={code}
      >
        {code.toUpperCase()}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://flagcdn.com/w40/${cc}.png`}
      srcSet={`https://flagcdn.com/w80/${cc}.png 2x`}
      width={size}
      height={Math.round(size * 0.75)}
      alt={`${code} flag`}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`inline-block rounded-[3px] object-cover shadow-[0_0_8px_rgba(0,0,0,0.5)] ${className}`}
      style={{ width: size, height: Math.round(size * 0.75) }}
    />
  );
}
