import type { Metadata } from "next";
import Link from "next/link";
import { SeasonStandingsChart } from "@/components/season-standings-chart";
import {
  seasonStandingsSeries,
  REGULAR_SEASON_RACES,
} from "@/lib/season-standings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Season Standings — The Model Duel",
  description:
    "Every full-time driver's points standing across all 27 races of the 2026 NASCAR Cup regular season, race by race.",
};

export default function StandingsPage() {
  const series = seasonStandingsSeries();
  const lastCp = series.checkpoints.at(-1);
  const inChase = series.nWeeks > REGULAR_SEASON_RACES;
  const current = series.lines
    .map((l) => ({ driver: l.driver, isChase: l.isChase, now: l.points.at(-1) }))
    .filter((r) => r.now)
    .sort((a, b) => a.now!.pos - b.now!.pos);

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          <span className="h-px w-6 bg-speed" />
          Season points
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          Standings across the season
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          One line per full-time driver, tracking the points standings race by
          race. Press <em>Play season</em> to watch the order shake out from
          Daytona to Darlington. Chase races are marked in{" "}
          <span className="font-medium text-speed">yellow</span>: at the reset the
          16 playoff drivers jump to 2,000 points plus their playoff points, while
          everyone else keeps their regular-season total — so the field splits in
          two. Switch between <em>Position</em> and <em>Behind leader</em> below.
        </p>
      </header>

      <SeasonStandingsChart series={series} />

      {current.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">
            Standing order{lastCp ? ` — after ${lastCp.sub}` : ""}
            {inChase && (
              <span className="ml-2 align-middle text-xs font-normal text-speed">
                Chase reset applied
              </span>
            )}
          </h2>
          <div className="overflow-x-auto rounded-lg border border-border/70">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/40 text-left text-xs text-muted-foreground">
                  <th className="px-3 py-2 font-medium">Pos</th>
                  <th className="px-3 py-2 font-medium">Driver</th>
                  <th className="px-3 py-2 text-right font-medium">Points</th>
                  <th className="px-3 py-2 text-right font-medium">Behind leader</th>
                </tr>
              </thead>
              <tbody>
                {current.map((r, i) => (
                  <tr
                    key={r.driver}
                    className={`border-t border-border/60 ${
                      inChase && i === 15 ? "border-b-2 border-b-speed/60" : ""
                    }`}
                  >
                    <td className="tabular px-3 py-2 font-medium">{i + 1}</td>
                    <td className="px-3 py-2">
                      <Link
                        href={`/drivers/${series.lines.find((l) => l.driver === r.driver)?.slug ?? ""}`}
                        className="hover:text-foreground hover:underline"
                      >
                        {r.driver}
                      </Link>
                      {inChase && r.isChase && (
                        <span className="ml-2 rounded-full bg-speed/15 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-speed">
                          Chase
                        </span>
                      )}
                    </td>
                    <td className="tabular px-3 py-2 text-right text-muted-foreground">
                      {r.now!.cum}
                    </td>
                    <td className="tabular px-3 py-2 text-right text-muted-foreground">
                      {r.now!.behind === 0 ? "Leader" : `-${r.now!.behind}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {inChase && (
            <p className="text-xs text-muted-foreground">
              Playoff points = 5 per win plus the regular-season seeding bonus
              (15-10-8…1 for the top 10); stage-win playoff points aren&apos;t
              included, so seeds within the 16 are approximate.
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Race-by-race point swings and rank changes are on each{" "}
            <Link
              href="/races/1"
              className="underline underline-offset-2 hover:text-foreground"
            >
              race page
            </Link>
            , and every driver&apos;s own chart is on their{" "}
            <Link
              href="/drivers"
              className="underline underline-offset-2 hover:text-foreground"
            >
              driver page
            </Link>
            .
          </p>
        </section>
      )}
    </div>
  );
}
