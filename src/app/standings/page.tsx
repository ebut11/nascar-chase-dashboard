import type { Metadata } from "next";
import Link from "next/link";
import { SeasonStandingsChart } from "@/components/season-standings-chart";
import { seasonStandingsSeries } from "@/lib/season-standings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Season Standings — The Model Duel",
  description:
    "Every full-time driver's points standing across all 27 races of the 2026 NASCAR Cup regular season, race by race.",
};

export default function StandingsPage() {
  const series = seasonStandingsSeries();
  const lastCp = series.checkpoints.at(-1);
  const current = series.lines
    .map((l) => ({ driver: l.driver, now: l.points.at(-1) }))
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
          One line per full-time driver, tracking the points standings through all
          27 races of the 2026 regular season. Press <em>Play season</em> to watch
          the order shake out from Daytona to Darlington. Switch to{" "}
          <em>Position</em> to see running places, or <em>Behind leader</em> for
          the points gap to the top of the standings.
        </p>
      </header>

      <SeasonStandingsChart series={series} />

      {current.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">
            Standing order{lastCp ? ` — after ${lastCp.sub}` : ""}
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
                  <tr key={r.driver} className="border-t border-border/60">
                    <td className="tabular px-3 py-2 font-medium">{i + 1}</td>
                    <td className="px-3 py-2">
                      <Link
                        href={`/drivers/${series.lines.find((l) => l.driver === r.driver)?.slug ?? ""}`}
                        className="hover:text-foreground hover:underline"
                      >
                        {r.driver}
                      </Link>
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
