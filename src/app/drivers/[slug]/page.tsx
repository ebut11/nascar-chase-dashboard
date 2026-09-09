import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DriverAvatar } from "@/components/driver-avatar";
import { DriverPointsChart } from "@/components/driver-points-chart";
import { SeasonPointsChart, type WeekRow } from "@/components/season-points-chart";
import { DataSourceNote } from "@/components/data-source-note";
import { driverPointsHistory, getChaseData } from "@/lib/data";
import { DRIVER_PHOTO } from "@/lib/driver-photos";
import { DRIVER_LINE_COLOR } from "@/lib/driver-line-colors";
import { driverStats } from "@/lib/driver-seasons";
import driverChase from "@/lib/driver-chase.json";
import seasonWeekly from "@/lib/season-weekly.json";
import { MFR_PLATE } from "@/lib/manufacturers";
import { ROSTER, rosterBySlug } from "@/lib/roster";
import { fmt } from "@/lib/format";

interface ChaseBlock {
  races: number;
  wins: number;
  top5: number;
  top10: number;
  avgStart: number;
  avgFinish: number;
  avgRunning: number;
  lapsLed: number;
}
const CHASE = driverChase as Record<string, ChaseBlock>;
const SEASON_WEEKLY = seasonWeekly as Record<string, WeekRow[]>;

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return ROSTER.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/drivers/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = rosterBySlug.get(slug);
  return { title: d ? `${d.name} — The Model Duel` : "Driver — The Model Duel" };
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/70 bg-card p-3 text-center">
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="tabular mt-1 text-xl font-semibold">{value}</div>
    </div>
  );
}

export default async function DriverPage({ params }: PageProps<"/drivers/[slug]">) {
  const { slug } = await params;
  const d = rosterBySlug.get(slug);
  if (!d) notFound();

  const { data, source } = await getChaseData();
  const s = driverStats(slug);
  const chase = CHASE[slug];
  const history = driverPointsHistory(data, d.name);
  const weekly = SEASON_WEEKLY[slug] ?? [];
  const lineColor = DRIVER_LINE_COLOR[slug] ?? MFR_PLATE[d.manufacturer].bg;
  const num = (v: number | undefined) => (v === undefined ? "—" : String(v));
  const dec = (v: number | undefined) => (v === undefined ? "—" : fmt(v, 1));

  return (
    <div className="space-y-8">
      <Link href="/drivers" className="text-xs text-muted-foreground hover:text-foreground">
        ← All drivers
      </Link>

      <header className="flex flex-wrap items-center gap-4">
        <DriverAvatar name={d.name} photo={DRIVER_PHOTO[d.slug]} manufacturer={d.manufacturer} size={80} />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{d.name}</h1>
          <p className="text-sm text-muted-foreground">
            #{d.number} · {d.team} · {d.manufacturer}
            {d.chase && (
              <span className="ml-2 rounded-full bg-speed/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-speed">
                Chase
              </span>
            )}
          </p>
        </div>
      </header>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">
          2026 season{" "}
          <span className="text-sm font-normal text-muted-foreground">
            {s.starts ? `· ${s.starts} starts` : ""}
          </span>
        </h2>
        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6">
          <Stat label="Wins" value={num(s.wins)} />
          <Stat label="Top 3" value={num(s.top3)} />
          <Stat label="Top 5" value={num(s.top5)} />
          <Stat label="Top 10" value={num(s.top10)} />
          <Stat label="Avg Start" value={dec(s.avgStart)} />
          <Stat label="Avg Fin" value={dec(s.avgFinish)} />
        </div>
        <p className="text-xs text-muted-foreground">
          {s.points !== undefined ? (
            <>
              {s.points} pts · success rate {s.succ}% · avg running{" "}
              {dec(s.avgRunning)} · speed score {dec(s.speedScore)}
            </>
          ) : (
            "Season totals for this driver haven't been entered yet."
          )}
        </p>
      </section>

      {d.chase && chase && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">
            Chase{" "}
            <span className="text-sm font-normal text-muted-foreground">
              · {chase.races} of 10 races
            </span>
          </h2>
          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6">
            <Stat label="Wins" value={num(chase.wins)} />
            <Stat label="Top 5" value={num(chase.top5)} />
            <Stat label="Top 10" value={num(chase.top10)} />
            <Stat label="Avg Start" value={dec(chase.avgStart)} />
            <Stat label="Avg Fin" value={dec(chase.avgFinish)} />
            <Stat label="Laps Led" value={num(chase.lapsLed)} />
          </div>
          <p className="text-xs text-muted-foreground">
            Postseason-only totals · avg running position {dec(chase.avgRunning)}.
            Builds race by race.
          </p>
        </section>
      )}

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Points through the year</h2>
        {weekly.length > 0 ? (
          <SeasonPointsChart
            rows={weekly}
            color={lineColor}
            highlightWeek={d.chase ? 27 : undefined}
          />
        ) : (
          <>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Points behind the standings leader at each Chase checkpoint. Flat
              along the top is the lead; a falling line is ground lost.
            </p>
            <DriverPointsChart
              checkpoints={history.checkpoints}
              line={history.line}
              color={lineColor}
            />
          </>
        )}
        <DataSourceNote source={source} />
      </section>
    </div>
  );
}
