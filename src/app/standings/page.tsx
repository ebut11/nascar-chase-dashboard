import type { Metadata } from "next";
import Link from "next/link";
import { DataSourceNote } from "@/components/data-source-note";
import { StandingsZigZag } from "@/components/standings-zigzag";
import { getChaseData, standingsSeries } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Chase Standings — The Model Duel",
  description:
    "Every Chase driver's points-behind-the-leader across the 2026 NASCAR postseason, race by race.",
};

export default async function StandingsPage() {
  const { data, source } = await getChaseData();
  const series = standingsSeries(data);
  const current = series.lines
    .map((l) => ({ driver: l.driver, now: l.points.at(-1) }))
    .filter((r) => r.now)
    .sort((a, b) => a.now!.rank - b.now!.rank);
  const lastCp = series.checkpoints.at(-1);

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          <span className="h-px w-6 bg-speed" />
          Chase points
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Standings through the Chase</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Each line is one Chase driver&apos;s deficit to the standings leader,
          checkpoint by checkpoint. Flat along the top means you&apos;re leading;
          the further a line drops, the more ground there is to make up. It fills
          in as the 10 races run.
        </p>
        <DataSourceNote source={source} />
      </header>

      <StandingsZigZag series={series} />

      {current.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">
            Current order{lastCp ? ` — after ${lastCp.sub}` : ""}
          </h2>
          <div className="overflow-x-auto rounded-lg border border-border/70">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/40 text-left text-xs text-muted-foreground">
                  <th className="px-3 py-2 font-medium">Pos</th>
                  <th className="px-3 py-2 font-medium">Driver</th>
                  <th className="px-3 py-2 text-right font-medium">Behind leader</th>
                </tr>
              </thead>
              <tbody>
                {current.map((r) => (
                  <tr key={r.driver} className="border-t border-border/60">
                    <td className="tabular px-3 py-2 font-medium">{r.now!.rank}</td>
                    <td className="px-3 py-2">{r.driver}</td>
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
            <Link href="/races/1" className="underline underline-offset-2 hover:text-foreground">
              race page
            </Link>
            .
          </p>
        </section>
      )}
    </div>
  );
}
