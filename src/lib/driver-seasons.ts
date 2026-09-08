/**
 * 2026 season stat totals per driver (keyed by roster slug).
 *
 * The 16 Chase drivers are filled from NASCAR's post-Darlington standings
 * (they've run all 27 races, so these are full-season totals). top3 and
 * avgFinish aren't in that table yet — left undefined and shown as "—".
 * The other 20 full-timers are placeholders until their numbers are added.
 *
 * Race-by-race points history is NOT here — it comes from the chase_standings
 * data (see driverPointsHistory in lib/data.ts).
 */
export interface SeasonStats {
  starts?: number;
  wins?: number;
  top3?: number;
  top5?: number;
  top10?: number;
  dnf?: number;
  avgFinish?: number;
  lapsLed?: number;
  points?: number;
}

const S = (
  starts: number,
  wins: number,
  top5: number,
  top10: number,
  dnf: number,
  lapsLed: number,
  points: number,
): SeasonStats => ({ starts, wins, top5, top10, dnf, lapsLed, points });

export const DRIVER_SEASONS: Record<string, SeasonStats> = {
  "denny-hamlin": S(27, 4, 14, 17, 0, 948, 2135),
  "christopher-bell": S(27, 1, 12, 14, 4, 605, 2123),
  "ryan-blaney": S(27, 3, 7, 18, 3, 829, 2119),
  "tyler-reddick": S(27, 5, 12, 17, 2, 523, 2111),
  "chase-briscoe": S(27, 1, 10, 14, 4, 389, 2098),
  "ty-gibbs": S(27, 2, 11, 17, 5, 280, 2096),
  "kyle-larson": S(27, 0, 10, 14, 3, 758, 2086),
  "joey-logano": S(27, 2, 5, 10, 3, 536, 2063),
  "chase-elliott": S(27, 2, 6, 9, 2, 318, 2063),
  "bubba-wallace": S(27, 0, 4, 12, 3, 252, 2054),
  "chris-buescher": S(27, 0, 2, 10, 1, 81, 2047),
  "carson-hocevar": S(27, 1, 5, 9, 2, 159, 2046),
  "daniel-suarez": S(27, 1, 3, 7, 1, 42, 2041),
  "austin-cindric": S(27, 0, 2, 6, 3, 51, 2033),
  "ryan-preece": S(27, 1, 1, 8, 3, 55, 2031),
  "william-byron": S(27, 0, 4, 11, 4, 176, 2021),
};

export function driverStats(slug: string): SeasonStats {
  return DRIVER_SEASONS[slug] ?? {};
}
