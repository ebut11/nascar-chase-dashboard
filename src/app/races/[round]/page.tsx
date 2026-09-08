import { notFound } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RaceStrip } from "@/components/race-strip";
import { PredictionsCompare } from "@/components/predictions-compare";
import { PredictedVsActual } from "@/components/predicted-vs-actual";
import { AccuracyPanel } from "@/components/accuracy-panel";
import { ImportancePanel } from "@/components/importance-panel";
import { StandingsSwing } from "@/components/standings-swing";
import { DataSourceNote } from "@/components/data-source-note";
import {
  driverRaceRows,
  getChaseData,
  importancesFor,
  predictionsFor,
  raceByRound,
  scoresFor,
  standingsFor,
} from "@/lib/data";
import { fmtDate } from "@/lib/format";

// Read Supabase on every request so the deployed site always reflects the live
// database rather than a build-time snapshot.
export const dynamic = "force-dynamic";

export default async function RacePage({ params }: PageProps<"/races/[round]">) {
  const { round } = await params;
  const roundNum = Number(round);
  if (!Number.isInteger(roundNum) || roundNum < 1 || roundNum > 10) notFound();

  const { data, source } = await getChaseData();
  const race = raceByRound(data, roundNum);
  if (!race) notFound();

  const done = race.status === "completed";
  const basicPreds = predictionsFor(data, roundNum, "basic");
  const advancedPreds = predictionsFor(data, roundNum, "advanced");
  const scores = scoresFor(data, roundNum);
  const rows = driverRaceRows(data, roundNum);
  const standings = standingsFor(data, roundNum);
  const hasPredictions = basicPreds.length > 0 && advancedPreds.length > 0;

  return (
    <div className="space-y-8">
      <RaceStrip races={data.races} activeRound={roundNum} />

      <header className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          <span className="h-px w-6 bg-speed" />
          Race {race.chase_round} of 10 · {done ? "Final" : "Upcoming"}
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{race.track}</h1>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
          {race.name && race.name !== race.track && (
            <span className="text-foreground">{race.name}</span>
          )}
          <span>· {fmtDate(race.race_date)}</span>
          {race.track_type && (
            <span className="rounded-sm bg-muted px-1.5 py-0.5 text-xs">
              {race.track_type}
              {race.track_length_mi ? ` · ${race.track_length_mi} mi` : ""}
            </span>
          )}
          {done && race.winner && (
            <span>
              · Winner: <span className="text-foreground">{race.winner}</span>
            </span>
          )}
          {race.blend_note && <span>· Blend: {race.blend_note}</span>}
        </div>
        <DataSourceNote source={source} />
      </header>

      {!hasPredictions ? (
        <div className="rounded-xl border border-dashed border-border/70 bg-card p-10 text-center">
          <p className="text-sm font-medium">Predictions not published yet</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
            Both models are rebuilt the week of each race from fresh
            track-history and season-form data. Check back once {race.track} is
            on deck.
          </p>
        </div>
      ) : (
        <Tabs defaultValue={done ? "vs" : "pred"} className="gap-6">
          <TabsList variant="line" className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="pred">Predictions</TabsTrigger>
            {done && <TabsTrigger value="vs">Predicted vs. Actual</TabsTrigger>}
            {done && scores.basic && scores.advanced && (
              <TabsTrigger value="acc">Accuracy</TabsTrigger>
            )}
            {standings.length > 0 && <TabsTrigger value="standings">Standings</TabsTrigger>}
            <TabsTrigger value="feat">What mattered</TabsTrigger>
          </TabsList>

          <TabsContent value="pred">
            <PredictionsCompare basic={basicPreds} advanced={advancedPreds} />
          </TabsContent>

          {done && (
            <TabsContent value="vs">
              <PredictedVsActual rows={rows} />
            </TabsContent>
          )}

          {done && scores.basic && scores.advanced && (
            <TabsContent value="acc">
              <AccuracyPanel basic={scores.basic} advanced={scores.advanced} rows={rows} />
            </TabsContent>
          )}

          {standings.length > 0 && (
            <TabsContent value="standings">
              <div className="space-y-3">
                <p className="max-w-2xl text-sm text-muted-foreground">
                  Playoff-points gap to the standings leader, entering{" "}
                  {race.track} versus after the checkered flag. Toggle to replay the
                  swing; the arrows show places gained or lost.
                </p>
                <StandingsSwing raceName={race.track} rows={standings} />
              </div>
            </TabsContent>
          )}

          <TabsContent value="feat">
            <ImportancePanel
              basic={importancesFor(data, roundNum, "basic")}
              advanced={importancesFor(data, roundNum, "advanced")}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
