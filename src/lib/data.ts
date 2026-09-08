import { createClient } from "@supabase/supabase-js";
import fallback from "./fallback-data.json";
import type {
  ChaseData,
  ChaseStanding,
  DriverRaceRow,
  FeatureImportance,
  ModelScore,
  Prediction,
  Race,
  RaceResult,
  StandingRow,
} from "./types";

// The Supabase project URL and anon key are publishable by design — they ship in
// client bundles on every Supabase app, and the database is guarded by the
// public read-only RLS policies in supabase/01_schema.sql. Env vars override
// these when set (e.g. to point at a different project).
const FALLBACK_URL = "https://wwhdzyjfzovnpgofemwz.supabase.co";
const FALLBACK_ANON =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3aGR6eWpmem92bnBnb2ZlbXd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg3OTkwNjksImV4cCI6MjEwNDM3NTA2OX0.KMMo6f2i3OMk-CVxa7ydei7bkYKS4jSqDPUDRBVrvng";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || FALLBACK_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || FALLBACK_ANON;

export const usingSupabase = Boolean(url && anon);

/** Last reason the loader fell back to bundled data (for ?debug=1). */
export let lastFallbackReason: string | null = usingSupabase
  ? null
  : `env not set (url:${Boolean(url)} key:${Boolean(anon)})`;

/**
 * Load the whole dataset. Reads from Supabase when env vars are configured,
 * otherwise serves the bundled Darlington snapshot so the site always renders.
 */
export async function getChaseData(): Promise<{ data: ChaseData; source: "supabase" | "bundled" }> {
  if (!usingSupabase) {
    return { data: fallback as unknown as ChaseData, source: "bundled" };
  }

  try {
    const supabase = createClient(url!, anon!, { auth: { persistSession: false } });

    const [races, drivers, predictions, results, scores, importances, standings] = await Promise.all([
      supabase
        .from("races")
        .select("chase_round,name,track,race_date,track_type,track_length_mi,status,winner,blend_note")
        .order("chase_round"),
      supabase.from("drivers").select("name,car_number,is_chase_driver"),
      supabase
        .from("predictions")
        .select("model_type,projected_finish,data_source,races(chase_round),drivers(name)"),
      supabase
        .from("results")
        .select(
          "start_pos,finish_pos,status,avg_running_position,fastest_laps,laps_led,pct_led,quality_passes,pct_top15,races(chase_round),drivers(name)",
        ),
      supabase.from("model_scores").select("*,races(chase_round)"),
      supabase.from("feature_importances").select("model_type,feature,importance,races(chase_round)"),
      // Optional table — added later; a miss here must not fail the whole load.
      supabase
        .from("chase_standings")
        .select("phase,playoff_points,behind_leader,rank,races(chase_round),drivers(name)"),
    ]);

    const err = races.error || drivers.error || predictions.error || results.error || scores.error || importances.error;
    if (err) throw err;
    lastFallbackReason = null;

    // flatten the embedded race/driver refs back to plain fields
    const flatten = <T,>(rows: unknown[]): T[] =>
      (rows ?? []).map((r) => {
        const row = r as Record<string, unknown> & {
          races?: { chase_round: number };
          drivers?: { name: string };
        };
        const { races: raceRef, drivers: driverRef, ...rest } = row;
        return {
          ...rest,
          ...(raceRef ? { chase_round: raceRef.chase_round } : {}),
          ...(driverRef ? { driver: driverRef.name } : {}),
        } as T;
      });

    const bundledStandings = (fallback as unknown as ChaseData).chase_standings ?? [];
    const data: ChaseData = {
      races: (races.data ?? []) as Race[],
      drivers: (drivers.data ?? []) as ChaseData["drivers"],
      predictions: flatten<Prediction>(predictions.data ?? []),
      results: flatten<RaceResult>(results.data ?? []),
      model_scores: flatten<ModelScore>(scores.data ?? []),
      feature_importances: flatten<FeatureImportance>(importances.data ?? []),
      chase_standings:
        !standings.error && standings.data?.length
          ? flatten<ChaseStanding>(standings.data)
          : bundledStandings,
    };

    if (data.races.length === 0) {
      lastFallbackReason = "query returned 0 races";
      return { data: fallback as unknown as ChaseData, source: "bundled" };
    }
    return { data, source: "supabase" };
  } catch (e) {
    lastFallbackReason =
      e instanceof Error ? `${e.name}: ${e.message}` : `non-error thrown: ${String(e)}`;
    console.error("[getChaseData] falling back to bundled:", lastFallbackReason);
    return { data: fallback as unknown as ChaseData, source: "bundled" };
  }
}

/* ----------------------------- derived helpers ----------------------------- */

export function raceByRound(data: ChaseData, round: number): Race | undefined {
  return data.races.find((r) => r.chase_round === round);
}

export function predictionsFor(data: ChaseData, round: number, model: "basic" | "advanced"): Prediction[] {
  return data.predictions
    .filter((p) => p.chase_round === round && p.model_type === model)
    .sort((a, b) => a.projected_finish - b.projected_finish);
}

/** Merge the before/after standing phases for a race into per-driver rows. */
export function standingsFor(data: ChaseData, round: number): StandingRow[] {
  const rows = (data.chase_standings ?? []).filter((s) => s.chase_round === round);
  if (rows.length === 0) return [];
  const carNo = new Map(data.drivers.map((d) => [d.name, d.car_number]));
  const before = new Map(rows.filter((r) => r.phase === "before").map((r) => [r.driver, r]));
  const after = new Map(rows.filter((r) => r.phase === "after").map((r) => [r.driver, r]));
  const names = new Set<string>([...before.keys(), ...after.keys()]);

  return [...names]
    .map((driver): StandingRow => {
      const b = before.get(driver);
      const a = after.get(driver);
      return {
        driver,
        car_number: carNo.get(driver) ?? null,
        playoff_points_before: b?.playoff_points ?? null,
        playoff_points_after: a?.playoff_points ?? null,
        behind_before: b?.behind_leader ?? a?.behind_leader ?? 0,
        behind_after: a?.behind_leader ?? b?.behind_leader ?? 0,
        rank_before: b?.rank ?? a?.rank ?? 99,
        rank_after: a?.rank ?? b?.rank ?? 99,
      };
    })
    .sort((x, y) => x.rank_after - y.rank_after);
}

export function scoresFor(data: ChaseData, round: number): { basic?: ModelScore; advanced?: ModelScore } {
  return {
    basic: data.model_scores.find((s) => s.chase_round === round && s.model_type === "basic"),
    advanced: data.model_scores.find((s) => s.chase_round === round && s.model_type === "advanced"),
  };
}

export function importancesFor(data: ChaseData, round: number, model: "basic" | "advanced"): FeatureImportance[] {
  return data.feature_importances
    .filter((f) => f.chase_round === round && f.model_type === model)
    .sort((a, b) => b.importance - a.importance);
}

/** Build the merged predicted-vs-actual board for a completed race. */
export function driverRaceRows(data: ChaseData, round: number): DriverRaceRow[] {
  const driverMeta = new Map(data.drivers.map((d) => [d.name, d]));
  const basic = new Map(predictionsFor(data, round, "basic").map((p) => [p.driver, p.projected_finish]));
  const advanced = new Map(predictionsFor(data, round, "advanced").map((p) => [p.driver, p.projected_finish]));
  const results = new Map(
    data.results.filter((r) => r.chase_round === round).map((r) => [r.driver, r]),
  );

  const names = new Set<string>([...basic.keys(), ...advanced.keys(), ...results.keys()]);

  return [...names]
    .map((name): DriverRaceRow => {
      const meta = driverMeta.get(name);
      const res = results.get(name);
      const b = basic.get(name) ?? null;
      const a = advanced.get(name) ?? null;
      const actual = res?.finish_pos ?? null;
      return {
        driver: name,
        car_number: meta?.car_number ?? null,
        is_chase_driver: meta?.is_chase_driver ?? false,
        basic: b,
        advanced: a,
        actual,
        status: res?.status ?? null,
        laps_led: res?.laps_led ?? null,
        avg_running_position: res?.avg_running_position ?? null,
        basic_error: b != null && actual != null ? Math.abs(b - actual) : null,
        advanced_error: a != null && actual != null ? Math.abs(a - actual) : null,
      };
    })
    .sort((x, y) => (x.actual ?? 99) - (y.actual ?? 99));
}

export interface DuelStanding {
  model: "basic" | "advanced";
  racesScored: number;
  wins: number;
  avgMae: number | null;
  avgR2: number | null;
  totalTop10: number;
}

/** Season-long "which model is winning" scoreboard across all completed races. */
export function duelStandings(data: ChaseData): DuelStanding[] {
  const completed = data.races.filter((r) => r.status === "completed").map((r) => r.chase_round);
  const perModel = (model: "basic" | "advanced"): DuelStanding => {
    const scores = data.model_scores.filter((s) => s.model_type === model && completed.includes(s.chase_round));
    const maes = scores.map((s) => s.mae).filter((v): v is number => v != null);
    const r2s = scores.map((s) => s.r2).filter((v): v is number => v != null);
    let wins = 0;
    for (const round of completed) {
      const b = data.model_scores.find((s) => s.chase_round === round && s.model_type === "basic")?.mae;
      const a = data.model_scores.find((s) => s.chase_round === round && s.model_type === "advanced")?.mae;
      if (b == null || a == null) continue;
      if (model === "basic" && b < a) wins++;
      if (model === "advanced" && a < b) wins++;
    }
    return {
      model,
      racesScored: scores.length,
      wins,
      avgMae: maes.length ? maes.reduce((s, v) => s + v, 0) / maes.length : null,
      avgR2: r2s.length ? r2s.reduce((s, v) => s + v, 0) / r2s.length : null,
      totalTop10: scores.reduce((s, v) => s + (v.top10_hits ?? 0), 0),
    };
  };
  return [perModel("basic"), perModel("advanced")];
}
