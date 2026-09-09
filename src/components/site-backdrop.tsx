"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { TrackShape } from "@/components/track-shape";
import { CHASE_TRACK_ORDER } from "@/lib/tracks";

const INTERVAL = 7000;

/**
 * Faint, full-viewport track-shape watermark. Cycles through the Chase tracks in
 * running order; on a race page it locks to that race's track.
 */
export function SiteBackdrop() {
  const pathname = usePathname();
  const raceMatch = pathname.match(/^\/races\/(\d+)/);
  const locked = raceMatch
    ? CHASE_TRACK_ORDER[Number(raceMatch[1]) - 1] ?? null
    : null;

  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (locked) return;
    const id = setInterval(
      () => setIdx((i) => (i + 1) % CHASE_TRACK_ORDER.length),
      INTERVAL,
    );
    return () => clearInterval(id);
  }, [locked]);

  const slug = locked ?? CHASE_TRACK_ORDER[idx];

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden"
      aria-hidden
    >
      <TrackShape
        key={slug}
        slug={slug}
        strokeWidth={1.4}
        className="w-[min(94vw,1150px)] animate-[backdrop-in_1.4s_ease] text-foreground/[0.055]"
      />
    </div>
  );
}
