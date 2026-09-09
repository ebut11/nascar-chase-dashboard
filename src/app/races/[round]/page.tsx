import { notFound } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RaceStrip } from "@/components/race-strip";
import { PredictionsCompare } from "@/components/predictions-compare";
import { PredictedVsActual } from "@/components/predicted-vs-actual";
import { AccuracyPanel } from "@/components/accuracy-panel";
import { ImportancePanel } from "@/components/importance-panel";
import { StandingsSwing } from "@/components/standings-swing";
import { PredActualScatter } from "@/components/pred-actual-scatter";
import { TrackShape } from "@/components/track-shape";
import { DataSourceNote } from "@/components/data-source-note";
import { trackSlug } from "@/lib/tracks";
import { TRACK_PHOTO } from "@/lib/track-photos";
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
  const carNumbers: Record<string, number | null> = Object.fromEntries(
    data.drivers.map((d) => [d.name, d.car_number]),
  );
  const hasPredictions = basicPreds.length > 0 && advancedPreds.length > 0;

  return (
    <div className="space-y-8">
      <RaceStrip races={data.races} activeRound={roundNum} />

      {(() => {
        const slug = trackSlug(race.track);
        const photo = slug ? TRACK_PHOTO[slug] : undefined;
        return (
          <header
            className={
              "relative space-y-2 overflow-hidden rounded-xl" +
              (photo ? " px-5 py-6 sm:px-6" : "")
            }
          >
            {photo ? (
              <div className="pointer-events-none absolute inset-0 z-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo} alt="" className="h-full w-full object-cover opacity-30" />
                <div className="absolute inset-0 bg-gradient-to-r from-background from-25% via-background/80 to-background/35" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent" />
              </div>
            ) : (
              <TrackShape
                slug={slug}
                strokeWidth={1.6}
                className="pointer-events-none absolute -right-6 -top-10 z-0 h-40 w-64 text-speed/15"
              />
            )}

            <div className="relative z-10 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground [text-shadow:0_1px_8px_rgb(0_0_0_/0.7)]">
              <span className="h-px w-6 bg-speed" />
              Race {race.chase_round} of 10 · {done ? "Final" : "Upcoming"}
            </div>
            <h1 className="relative z-10 text-3xl font-bold tracking-tight [text-shadow:0_2px_14px_rgb(0_0_0_/0.75)]">
              {race.track}
            </h1>
            <div className="relative z-10 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-foreground/80 [text-shadow:0_1px_8px_rgb(0_0_0_/0.7)]">
              {race.name && race.name !== race.track && (
                <span className="font-medium text-foreground">{race.name}</span>
              )}
              <span>· {fmtDate(race.race_date)}</span>
              {race.track_type && (
                <span className="rounded-sm bg-muted/90 px-1.5 py-0.5 text-xs [text-shadow:none]">
                  {race.track_type}
                  {race.track_length_mi ? ` · ${race.track_length_mi} mi` : ""}
                </span>
              )}
              {done && race.winner && (
                <span>
                  · Winner: <span className="font-medium text-foreground">{race.winner}</span>
                </span>
              )}
              {race.blend_note && <span>· Blend: {race.blend_note}</span>}
            </div>
            <div className="relative z-10">
              <DataSourceNote source={source} />
            </div>
          </header>
        );
      })()}

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
            <PredictionsCompare
              basic={basicPreds}
              advanced={advancedPreds}
              carNumbers={carNumbers}
            />
          </TabsContent>

          {done && (
            <TabsContent value="vs">
              <PredictedVsActual rows={rows} />
            </TabsContent>
          )}

          {done && scores.basic && scores.advanced && (
            <TabsContent value="acc">
              <div className="space-y-8">
                <AccuracyPanel basic={scores.basic} advanced={scores.advanced} rows={rows} />
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Projected vs. actual finish</h3>
                  <PredActualScatter rows={rows} />
                </div>
              </div>
            </TabsContent>
          )}

          {standings.length > 0 && (
            <TabsContent value="standings">
              <div className="space-y-3">
                <p className="max-w-2xl text-sm text-muted-foreground">
                  Chase-points gap to the standings leader, entering {race.track}{" "}
                  versus after the checkered flag. Toggle to replay the swing; the
                  arrows show places gained or lost.
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
