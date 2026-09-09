import seasonWeekly from "./season-weekly.json";
import { ROSTER } from "./roster";
import { DRIVER_SEASONS } from "./driver-seasons";
import type { WeekRow } from "@/components/season-points-chart";

const SW = seasonWeekly as Record<string, WeekRow[]>;

/** Regular season ends after this race; the Chase (playoffs) opens the next
 *  week at Darlington, where the 16 playoff drivers reset. */
export const REGULAR_SEASON_RACES = 26;
const RESET_BASE = 2000;
// playoff points for finishing top-10 in regular-season points
const SEED_BONUS = [15, 10, 8, 7, 6, 5, 4, 3, 2, 1];
const WIN_PLAYOFF_POINTS = 5; // stage-win playoff points are not modelled

export interface SeasonStandPoint {
  x: number; // week index, 0-based
  cum: number; // standings points (post-reset from the Chase opener on)
  behind: number; // points behind the standings leader
  rank: number; // standings place
  pos: number; // dense place among the full-time roster, 1..N
  chase: boolean; // this point is in the Chase
}
export interface SeasonStandLine {
  slug: string;
  driver: string;
  car_number: number | null;
  isChase: boolean;
  points: SeasonStandPoint[];
}
export interface SeasonStandCheckpoint {
  label: string;
  sub: string;
  chase: boolean;
}
export interface SeasonStandSeries {
  checkpoints: SeasonStandCheckpoint[];
  lines: SeasonStandLine[];
  maxBehind: number;
  nWeeks: number;
  resetAfter: number; // checkpoint index the Chase reset lands after
}

/** Whole-season points standings for every full-time driver, race by race,
 *  with the NASCAR playoff reset applied at the Chase opener (Darlington).
 *  Built from the bundled season-weekly data (no Supabase needed). */
export function seasonStandingsSeries(): SeasonStandSeries {
  const slugs = Object.keys(SW);
  const nWeeks = Math.max(1, ...slugs.flatMap((s) => SW[s].map((r) => r.week)));

  const trackByWeek = new Map<number, string>();
  for (const s of slugs) {
    for (const r of SW[s]) if (!trackByWeek.has(r.week)) trackByWeek.set(r.week, r.track);
  }
  const checkpoints: SeasonStandCheckpoint[] = Array.from(
    { length: nWeeks },
    (_, i) => ({
      label: `R${i + 1}`,
      sub: trackByWeek.get(i + 1) ?? `Race ${i + 1}`,
      chase: i + 1 > REGULAR_SEASON_RACES,
    }),
  );

  const rosterBySlug = new Map(ROSTER.map((d) => [d.slug, d]));
  const chaseSlugs = new Set(
    ROSTER.filter((d) => d.chase).map((d) => d.slug),
  );

  // per-driver points scored each week, and raw cumulative carried across byes
  const scoredByWeek: Record<string, Map<number, number>> = {};
  const rawCum: Record<string, number[]> = {};
  for (const slug of slugs) {
    const byWeek = new Map(SW[slug].map((r) => [r.week, r]));
    scoredByWeek[slug] = new Map(
      Array.from({ length: nWeeks }, (_, i) => [
        i + 1,
        byWeek.get(i + 1)?.points ?? 0,
      ]),
    );
    const cum: number[] = [];
    let last = 0;
    for (let w = 1; w <= nWeeks; w++) {
      const r = byWeek.get(w);
      if (r) last = r.cumPoints;
      cum.push(last);
    }
    rawCum[slug] = cum;
  }

  // regular-season points standing (through the finale) -> seeding bonus
  const regIdx = Math.min(REGULAR_SEASON_RACES, nWeeks) - 1;
  const regRank = [...slugs].sort((a, b) => rawCum[b][regIdx] - rawCum[a][regIdx]);
  const playoffPoints: Record<string, number> = {};
  regRank.forEach((slug, i) => {
    if (!chaseSlugs.has(slug)) return;
    const wins = DRIVER_SEASONS[slug]?.wins ?? 0;
    playoffPoints[slug] =
      wins * WIN_PLAYOFF_POINTS + (i < SEED_BONUS.length ? SEED_BONUS[i] : 0);
  });

  // standings points per driver per week, reset applied from the Chase opener
  const adjCum: Record<string, number[]> = {};
  for (const slug of slugs) {
    const arr: number[] = [];
    let chasePts = 0;
    for (let w = 1; w <= nWeeks; w++) {
      if (w <= REGULAR_SEASON_RACES) {
        arr.push(rawCum[slug][w - 1]);
      } else {
        chasePts += scoredByWeek[slug].get(w) ?? 0;
        if (chaseSlugs.has(slug)) {
          arr.push(RESET_BASE + (playoffPoints[slug] ?? 0) + chasePts);
        } else {
          // non-playoff drivers keep their regular-season points and play on
          arr.push(rawCum[slug][regIdx] + chasePts);
        }
      }
    }
    adjCum[slug] = arr;
  }

  let maxBehind = 1;
  const lines: SeasonStandLine[] = slugs.map((slug) => {
    const d = rosterBySlug.get(slug);
    const points: SeasonStandPoint[] = [];
    for (let w = 0; w < nWeeks; w++) {
      const cum = adjCum[slug][w];
      const leader = Math.max(...slugs.map((s) => adjCum[s][w]));
      const behind = leader - cum;
      maxBehind = Math.max(maxBehind, behind);
      const ahead = slugs.filter((s) => adjCum[s][w] > cum).length;
      points.push({
        x: w,
        cum,
        behind,
        rank: ahead + 1,
        pos: ahead + 1,
        chase: w + 1 > REGULAR_SEASON_RACES,
      });
    }
    return {
      slug,
      driver: d?.name ?? slug,
      car_number: d ? Number(d.number) : null,
      isChase: chaseSlugs.has(slug),
      points,
    };
  });

  lines.sort(
    (a, b) => (a.points.at(-1)?.pos ?? 99) - (b.points.at(-1)?.pos ?? 99),
  );

  return {
    checkpoints,
    lines,
    maxBehind,
    nWeeks,
    resetAfter: Math.min(REGULAR_SEASON_RACES, nWeeks) - 1,
  };
}
