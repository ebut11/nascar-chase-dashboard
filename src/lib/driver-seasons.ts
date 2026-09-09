/**
 * 2026 full-season stat totals per driver (owner-supplied). Keyed by roster slug.
 */
export interface SeasonStats {
  starts?: number;
  points?: number;
  wins?: number;
  top3?: number;
  top5?: number;
  top10?: number;
  avgStart?: number;
  avgFinish?: number;
  avgRunning?: number;
  succ?: number; // success rate %
  speedScore?: number;
}

export const DRIVER_SEASONS: Record<string, SeasonStats> = {
  "aj-allmendinger": { starts: 27, points: 478, wins: 0, top3: 0, top5: 1, top10: 4, avgStart: 21.78, avgFinish: 21.44, avgRunning: 22.95, succ: 37.0, speedScore: -85.86 },
  "alex-bowman": { starts: 23, points: 415, wins: 0, top3: 2, top5: 3, top10: 6, avgStart: 20.3, avgFinish: 20.35, avgRunning: 18.9, succ: 47.8, speedScore: -75.9 },
  "austin-cindric": { starts: 27, points: 659, wins: 0, top3: 1, top5: 2, top10: 6, avgStart: 19.22, avgFinish: 17.04, avgRunning: 13.82, succ: 70.4, speedScore: -40.11 },
  "austin-dillon": { starts: 27, points: 435, wins: 0, top3: 0, top5: 0, top10: 4, avgStart: 21.19, avgFinish: 21.56, avgRunning: 21.05, succ: 40.7, speedScore: -104.91 },
  "brad-keselowski": { starts: 27, points: 550, wins: 0, top3: 1, top5: 2, top10: 6, avgStart: 19.3, avgFinish: 18.78, avgRunning: 17.48, succ: 51.9, speedScore: -118.42 },
  "bubba-wallace": { starts: 27, points: 695, wins: 0, top3: 3, top5: 4, top10: 12, avgStart: 18.7, avgFinish: 16.19, avgRunning: 12.81, succ: 55.6, speedScore: 11.1 },
  "carson-hocevar": { starts: 27, points: 690, wins: 1, top3: 2, top5: 5, top10: 9, avgStart: 13.04, avgFinish: 16.52, avgRunning: 16.56, succ: 48.1, speedScore: 12.89 },
  "chase-briscoe": { starts: 27, points: 804, wins: 1, top3: 7, top5: 10, top10: 14, avgStart: 13.15, avgFinish: 14.26, avgRunning: 10.46, succ: 66.7, speedScore: 66.51 },
  "chase-elliott": { starts: 27, points: 736, wins: 2, top3: 3, top5: 6, top10: 9, avgStart: 16.15, avgFinish: 14.74, avgRunning: 13.28, succ: 59.3, speedScore: 2.85 },
  "chris-buescher": { starts: 27, points: 694, wins: 0, top3: 1, top5: 2, top10: 10, avgStart: 13.74, avgFinish: 15.11, avgRunning: 15.46, succ: 63.0, speedScore: 1.82 },
  "christopher-bell": { starts: 27, points: 825, wins: 1, top3: 9, top5: 12, top10: 14, avgStart: 14.81, avgFinish: 13.89, avgRunning: 10.95, succ: 63.0, speedScore: 83.84 },
  "cody-ware": { starts: 27, points: 202, wins: 0, top3: 0, top5: 0, top10: 0, avgStart: 34.19, avgFinish: 29.78, avgRunning: 31.44, succ: 22.2, speedScore: -321.91 },
  "cole-custer": { starts: 27, points: 333, wins: 0, top3: 0, top5: 0, top10: 1, avgStart: 25.22, avgFinish: 24.89, avgRunning: 26.91, succ: 33.3, speedScore: -214.4 },
  "connor-zilisch": { starts: 27, points: 274, wins: 0, top3: 0, top5: 0, top10: 1, avgStart: 23.56, avgFinish: 27.74, avgRunning: 25.11, succ: 14.8, speedScore: -220.82 },
  "daniel-suarez": { starts: 27, points: 688, wins: 1, top3: 2, top5: 3, top10: 7, avgStart: 13.93, avgFinish: 14.93, avgRunning: 17.23, succ: 66.7, speedScore: -43.53 },
  "denny-hamlin": { starts: 27, points: 1061, wins: 4, top3: 9, top5: 14, top10: 17, avgStart: 11.26, avgFinish: 8.59, avgRunning: 9.03, succ: 85.2, speedScore: 106.58 },
  "erik-jones": { starts: 27, points: 520, wins: 0, top3: 1, top5: 2, top10: 5, avgStart: 20.44, avgFinish: 19.7, avgRunning: 18.46, succ: 44.4, speedScore: -87.24 },
  "joey-logano": { starts: 27, points: 727, wins: 2, top3: 5, top5: 5, top10: 10, avgStart: 14.56, avgFinish: 16.85, avgRunning: 13.26, succ: 59.3, speedScore: -51.63 },
  "john-hunter-nemechek": { starts: 27, points: 425, wins: 0, top3: 0, top5: 1, top10: 2, avgStart: 22.15, avgFinish: 22.15, avgRunning: 23.26, succ: 40.7, speedScore: -146.67 },
  "josh-berry": { starts: 27, points: 443, wins: 0, top3: 1, top5: 2, top10: 8, avgStart: 22.37, avgFinish: 22.7, avgRunning: 18.2, succ: 33.3, speedScore: -110.28 },
  "kyle-larson": { starts: 27, points: 757, wins: 0, top3: 4, top5: 10, top10: 14, avgStart: 10.3, avgFinish: 16.78, avgRunning: 10.85, succ: 51.9, speedScore: 73.73 },
  "michael-mcdowell": { starts: 27, points: 530, wins: 0, top3: 1, top5: 3, top10: 6, avgStart: 15.85, avgFinish: 18.74, avgRunning: 20.56, succ: 40.7, speedScore: -87.95 },
  "noah-gragson": { starts: 27, points: 351, wins: 0, top3: 0, top5: 0, top10: 2, avgStart: 28.74, avgFinish: 24.19, avgRunning: 25.07, succ: 37.0, speedScore: -161.59 },
  "ricky-stenhouse-jr": { starts: 27, points: 428, wins: 0, top3: 1, top5: 3, top10: 4, avgStart: 22.89, avgFinish: 22.37, avgRunning: 24.27, succ: 37.0, speedScore: -187.22 },
  "riley-herbst": { starts: 26, points: 409, wins: 0, top3: 0, top5: 0, top10: 3, avgStart: 21.85, avgFinish: 22.5, avgRunning: 20.51, succ: 50.0, speedScore: -102.26 },
  "ross-chastain": { starts: 27, points: 528, wins: 0, top3: 1, top5: 1, top10: 5, avgStart: 17.74, avgFinish: 20.11, avgRunning: 17.73, succ: 51.9, speedScore: -130.2 },
  "ryan-blaney": { starts: 27, points: 973, wins: 3, top3: 6, top5: 7, top10: 18, avgStart: 9.89, avgFinish: 11.19, avgRunning: 9.1, succ: 74.1, speedScore: 55.45 },
  "ryan-preece": { starts: 27, points: 676, wins: 1, top3: 1, top5: 1, top10: 8, avgStart: 18.78, avgFinish: 16.33, avgRunning: 16.42, succ: 63.0, speedScore: -69.1 },
  "shane-van-gisbergen": { starts: 27, points: 611, wins: 2, top3: 3, top5: 5, top10: 7, avgStart: 18.04, avgFinish: 18.67, avgRunning: 18.89, succ: 55.6, speedScore: -121.74 },
  "todd-gilliland": { starts: 27, points: 486, wins: 0, top3: 0, top5: 0, top10: 2, avgStart: 25.0, avgFinish: 20.96, avgRunning: 23.13, succ: 51.9, speedScore: -162.72 },
  "ty-dillon": { starts: 27, points: 316, wins: 0, top3: 0, top5: 0, top10: 0, avgStart: 30.11, avgFinish: 25.33, avgRunning: 26.75, succ: 37.0, speedScore: -225.83 },
  "ty-gibbs": { starts: 27, points: 926, wins: 2, top3: 5, top5: 11, top10: 17, avgStart: 9.67, avgFinish: 11.96, avgRunning: 9.91, succ: 70.4, speedScore: 90.47 },
  "tyler-reddick": { starts: 27, points: 940, wins: 5, top3: 8, top5: 12, top10: 17, avgStart: 8.78, avgFinish: 11.89, avgRunning: 10.78, succ: 70.4, speedScore: 105.58 },
  "william-byron": { starts: 27, points: 672, wins: 0, top3: 2, top5: 4, top10: 11, avgStart: 15.07, avgFinish: 16.89, avgRunning: 13.35, succ: 59.3, speedScore: 44.48 },
  "zane-smith": { starts: 27, points: 467, wins: 0, top3: 0, top5: 2, top10: 6, avgStart: 21.22, avgFinish: 21.0, avgRunning: 20.64, succ: 51.9, speedScore: -101.04 },
};

export function driverStats(slug: string): SeasonStats {
  return DRIVER_SEASONS[slug] ?? {};
}
