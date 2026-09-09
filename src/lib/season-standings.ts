import seasonWeekly from "./season-weekly.json";
import { ROSTER } from "./roster";
import type { WeekRow } from "@/components/season-points-chart";

const SW = seasonWeekly as Record<string, WeekRow[]>;

export interface SeasonStandPoint {
  x: number; // week index, 0-based
  cum: number; // cumulative season points
  behind: number; // points behind the season leader
  rank: number; // full-field points-standings place (matches driver pages)
  pos: number; // dense place among the full-time roster, 1..N
}
export interface SeasonStandLine {
  slug: string;
  driver: string;
  car_number: number | null;
  points: SeasonStandPoint[];
}
export interface SeasonStandSeries {
  checkpoints: { label: string; sub: string }[];
  lines: SeasonStandLine[];
  maxBehind: number;
  nWeeks: number;
}

/** Whole-season points standings for every full-time driver, race by race.
 *  Built from the bundled season-weekly data (no Supabase needed). */
export function seasonStandingsSeries(): SeasonStandSeries {
  const slugs = Object.keys(SW);
  const nWeeks = Math.max(
    1,
    ...slugs.flatMap((s) => SW[s].map((r) => r.week)),
  );

  const trackByWeek = new Map<number, string>();
  for (const s of slugs) {
    for (const r of SW[s]) if (!trackByWeek.has(r.week)) trackByWeek.set(r.week, r.track);
  }
  const checkpoints = Array.from({ length: nWeeks }, (_, i) => ({
    label: `R${i + 1}`,
    sub: trackByWeek.get(i + 1) ?? `Race ${i + 1}`,
  }));

  // carry each driver's cumulative points / place forward across weeks they sat out
  const carriedCum: Record<string, number[]> = {};
  const carriedRank: Record<string, number[]> = {};
  for (const slug of slugs) {
    const byWeek = new Map(SW[slug].map((r) => [r.week, r]));
    const cum: number[] = [];
    const rank: number[] = [];
    let lastCum = 0;
    let lastRank = slugs.length;
    for (let w = 1; w <= nWeeks; w++) {
      const r = byWeek.get(w);
      if (r) {
        lastCum = r.cumPoints;
        lastRank = r.place;
      }
      cum.push(lastCum);
      rank.push(lastRank);
    }
    carriedCum[slug] = cum;
    carriedRank[slug] = rank;
  }

  const rosterBySlug = new Map(ROSTER.map((d) => [d.slug, d]));
  let maxBehind = 1;

  const lines: SeasonStandLine[] = slugs.map((slug) => {
    const d = rosterBySlug.get(slug);
    const points: SeasonStandPoint[] = [];
    for (let w = 0; w < nWeeks; w++) {
      const cum = carriedCum[slug][w];
      const leader = Math.max(...slugs.map((s) => carriedCum[s][w]));
      const behind = leader - cum;
      maxBehind = Math.max(maxBehind, behind);
      // dense place among the roster this week (min method for ties)
      const ahead = slugs.filter((s) => carriedCum[s][w] > cum).length;
      points.push({ x: w, cum, behind, rank: carriedRank[slug][w], pos: ahead + 1 });
    }
    return {
      slug,
      driver: d?.name ?? slug,
      car_number: d ? Number(d.number) : null,
      points,
    };
  });

  lines.sort(
    (a, b) => (a.points.at(-1)?.pos ?? 99) - (b.points.at(-1)?.pos ?? 99),
  );

  return { checkpoints, lines, maxBehind, nWeeks };
}
