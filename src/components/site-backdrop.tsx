"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { CHASE_TRACK_ORDER } from "@/lib/tracks";
import { TRACK_PHOTO } from "@/lib/track-photos";

const INTERVAL = 7000;

/**
 * Full-viewport track photo. Cycles through the Chase tracks in running order;
 * on a race page it locks to that race's track.
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
  if (!photo) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <div key={slug} className="absolute inset-0 animate-[backdrop-in_1.6s_ease]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo} alt="" className="h-full w-full object-cover opacity-[0.4]" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/45 via-background/65 to-background/88" />
      </div>
    </div>
  );
}
