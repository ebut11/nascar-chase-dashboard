import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DataSourceNote } from "@/components/data-source-note";
import { DuelScoreboard } from "@/components/duel-scoreboard";
import { RaceStrip } from "@/components/race-strip";
import { ModelChip } from "@/components/model-chip";
import {
  duelStandings,
  getChaseData,
  scoresFor,
} from "@/lib/data";
import { fmt, fmtDate, ordinal } from "@/lib/format";

export const revalidate = 300;

export default async function HubPage() {
  const { data, source } = await getChaseData();
  const standings = duelStandings(data);

  const completed = data.races
    .filter((r) => r.status === "completed")
    .sort((a, b) => b.chase_round - a.chase_round);
  const latest = completed[0];
  const latestScores = latest ? scoresFor(data, latest.chase_round) : null;

  return (
    <div className="space-y-10">
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          <span className="h-px w-6 bg-speed" />
          Basic stats vs. engineered metrics
        </div>
        <h1 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
          Two Random Forests. Ten Chase races. One question:{" "}
          <span className="text-speed">do fancy metrics actually predict better?</span>
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Every race of the 2026 NASCAR Playoffs, a <ModelChip model="basic" className="mx-0.5 align-middle" />{" "}
          model built on box-score stats and an <ModelChip model="advanced" className="mx-0.5 align-middle" />{" "}
          model built on engineered loop-data metrics each project the finishing
          order. After the checkered flag, both get scored against reality.
        </p>
        <DataSourceNote source={source} />
      </section>

      <DuelScoreboard standings={standings} />

      <section className="space-y-3">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-semibold">Chase schedule</h2>
          <span className="text-xs text-muted-foreground">
            {completed.length} of {data.races.length} races scored
          </span>
        </div>
        <RaceStrip races={data.races} activeRound={latest?.chase_round} />
      </section>

      {latest && latestScores?.basic && latestScores?.advanced && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Latest: {latest.track}</h2>
          <div className="grid gap-4 rounded-xl border border-border/70 bg-card p-5 sm:grid-cols-[1fr_auto]">
            <div className="space-y-3">
              <p className="text-sm">
                <span className="font-medium">{latest.winner}</span> won the{" "}
                {fmtDate(latest.race_date)} race
                {latestScores.basic.predicted_winner && (
                  <>
                    ; both models had{" "}
                    <span className="font-medium">{latestScores.basic.predicted_winner}</span> on top
                    {latestScores.basic.predicted_winner_actual_finish != null && (
                      <> (finished {ordinal(latestScores.basic.predicted_winner_actual_finish)})</>
                    )}
                    .
                  </>
                )}
              </p>
              <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
                {(["basic", "advanced"] as const).map((m) => {
                  const s = latestScores[m]!;
                  return (
                    <div key={m} className="space-y-1">
                      <ModelChip model={m} />
                      <div className="tabular text-muted-foreground">
                        MAE {fmt(s.mae, 2)} · R² {fmt(s.r2, 3)} · top-10 {s.top10_hits}/10
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <Link
              href={`/races/${latest.chase_round}`}
              className="inline-flex h-10 items-center gap-1.5 self-start rounded-lg bg-speed px-4 text-sm font-medium text-black transition-opacity hover:opacity-90"
            >
              Full breakdown <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
