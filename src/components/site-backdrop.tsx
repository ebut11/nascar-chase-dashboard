"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { TrackShape } from "@/components/track-shape";
import { CHASE_TRACK_ORDER } from "@/lib/tracks";
import { TRACK_PHOTO } from "@/lib/track-photos";

const INTERVAL = 7000;

/**
 * Full-viewport track background. Cycles through the Chase tracks in running
 * order; on a race page it locks to that race's track. Shows a photo when one
 * is available for the track, otherwise a faint track-shape watermark.
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
  const photo = TRACK_PHOTO[slug];

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      {photo ? (
        <div key={slug} className="absolute inset-0 animate-[backdrop-in_1.6s_ease]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo}
            alt=""
            className="h-full w-full object-cover opacity-[0.18]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/92 to-background" />
        </div>
      ) : (
        <div
          key={slug}
          className="absolute inset-0 flex items-center justify-center animate-[backdrop-in_1.4s_ease]"
        >
          <TrackShape
            slug={slug}
            strokeWidth={1.4}
            className="w-[min(94vw,1150px)] text-foreground/[0.055]"
          />
        </div>
      )}
    </div>
  );
}
