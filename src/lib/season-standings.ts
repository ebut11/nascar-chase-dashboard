import seasonWeekly from "./season-weekly.json";
import { ROSTER } from "./roster";
import type { WeekRow } from "@/components/season-points-chart";

const SW = seasonWeekly as Record<string, WeekRow[]>;

/** Regular season ends after this race; the Chase (playoffs) opens the next
 *  week at Darlington, where the 16 playoff drivers reset. */
export const REGULAR_SEASON_RACES = 26;

/** Official NASCAR Cup standings the moment the Chase opened — i.e. after the
 *  Southern 500 at Darlington (race 27): the 16 playoff drivers reset to
 *  2000 + playoff points and then scored Darlington; everyone else carried
 *  their regular-season total. Points are the real published values. */
const RESET_POINTS: Record<string, number> = {
  "denny-hamlin": 2135,
  "christopher-bell": 2123,
  "ryan-blaney": 2119,
  "tyler-reddick": 2111,
  "chase-briscoe": 2098,
  "ty-gibbs": 2096,
  "kyle-larson": 2086,
  "joey-logano": 2063,
  "chase-elliott": 2063,
  "bubba-wallace": 2054,
  "chris-buescher": 2047,
  "carson-hocevar": 2046,
  "daniel-suarez": 2041,
  "austin-cindric": 2033,
  "ryan-preece": 2031,
  "william-byron": 2021,
};

/** Full standings order after the Chase opener (P1..P35), used to break ties
 *  and lock the finishing order to the official result. */
const OPENER_ORDER: string[] = [
  "denny-hamlin",
  "christopher-bell",
  "ryan-blaney",
  "tyler-reddick",
  "chase-briscoe",
  "ty-gibbs",
  "kyle-larson",
  "joey-logano",
  "chase-elliott",
  "bubba-wallace",
  "chris-buescher",
  "carson-hocevar",
  "daniel-suarez",
  "austin-cindric",
  "ryan-preece",
  "william-byron",
  "shane-van-gisbergen",
  "brad-keselowski",
  "michael-mcdowell",
  "ross-chastain",
  "erik-jones",
  "todd-gilliland",
  "aj-allmendinger",
  "zane-smith",
  "josh-berry",
  "austin-dillon",
  "ricky-stenhouse-jr",
  "john-hunter-nemechek",
  "alex-bowman",
  "riley-herbst",
  "noah-gragson",
  "cole-custer",
  "ty-dillon",
  "connor-zilisch",
  "cody-ware",
];
const OPENER_SEED = new Map(OPENER_ORDER.map((s, i) => [s, i + 1]));

export interface SeasonStandPoint {
  x: number; // week index, 0-based
  cum: number; // standings points (post-reset from the Chase opener on)
  behind: number; // points behind the standings leader
  rank: number; // standings place
  pos: number; // place among the full-time roster, 1..N
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
  const chaseSlugs = new Set(ROSTER.filter((d) => d.chase).map((d) => d.slug));

  // per-driver points scored each week, and raw cumulative carried across byes
  const scoredByWeek: Record<string, Map<number, number>> = {};
  const rawCum: Record<string, number[]> = {};
  for (const slug of slugs) {
    const byWeek = new Map(SW[slug].map((r) => [r.week, r]));
    scoredByWeek[slug] = new Map(
      Array.from({ length: nWeeks }, (_, i) => [i + 1, byWeek.get(i + 1)?.points ?? 0]),
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

  // standings points per driver per week, reset applied from the Chase opener
  const adjCum: Record<string, number[]> = {};
  for (const slug of slugs) {
    const arr: number[] = [];
    let laterChasePts = 0; // points scored in Chase races after the opener
    for (let w = 1; w <= nWeeks; w++) {
      if (w <= REGULAR_SEASON_RACES || !chaseSlugs.has(slug)) {
        // regular season, and non-playoff drivers all season: raw carried total
        arr.push(rawCum[slug][w - 1]);
      } else {
        // playoff driver in a Chase race: official reset total (which already
        // includes the opener) plus anything scored in later Chase races
        if (w > REGULAR_SEASON_RACES + 1) laterChasePts += scoredByWeek[slug].get(w) ?? 0;
        arr.push((RESET_POINTS[slug] ?? 2000) + laterChasePts);
      }
    }
    adjCum[slug] = arr;
  }

  // place per week: regular season uses min-method ties (Racing Reference view);
  // Chase weeks lock to the official order (points, then opener seed).
  const placeByWeek: Record<string, number>[] = [];
  for (let w = 0; w < nWeeks; w++) {
    const rk: Record<string, number> = {};
    if (w < REGULAR_SEASON_RACES) {
      const order = [...slugs].sort((a, b) => adjCum[b][w] - adjCum[a][w]);
      let i = 0;
      while (i < order.length) {
        let j = i;
        while (j + 1 < order.length && adjCum[order[j + 1]][w] === adjCum[order[i]][w]) j++;
        for (let k = i; k <= j; k++) rk[order[k]] = i + 1;
        i = j + 1;
      }
    } else {
      const order = [...slugs].sort(
        (a, b) =>
          adjCum[b][w] - adjCum[a][w] ||
          (OPENER_SEED.get(a) ?? 99) - (OPENER_SEED.get(b) ?? 99),
      );
      order.forEach((s, i) => (rk[s] = i + 1));
    }
    placeByWeek.push(rk);
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
      points.push({
        x: w,
        cum,
        behind,
        rank: placeByWeek[w][slug],
        pos: placeByWeek[w][slug],
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

  lines.sort((a, b) => (a.points.at(-1)?.pos ?? 99) - (b.points.at(-1)?.pos ?? 99));

  return {
    checkpoints,
    lines,
    maxBehind,
    nWeeks,
    resetAfter: Math.min(REGULAR_SEASON_RACES, nWeeks) - 1,
  };
}
