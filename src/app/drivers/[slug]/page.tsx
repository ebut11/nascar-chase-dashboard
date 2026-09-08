import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DriverAvatar } from "@/components/driver-avatar";
import { DriverPointsChart } from "@/components/driver-points-chart";
import { DataSourceNote } from "@/components/data-source-note";
import { driverPointsHistory, getChaseData } from "@/lib/data";
import { driverStats } from "@/lib/driver-seasons";
import { MFR_PLATE } from "@/lib/manufacturers";
import { ROSTER, rosterBySlug } from "@/lib/roster";
import { fmt } from "@/lib/format";

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
  const history = driverPointsHistory(data, d.name);
  const num = (v: number | undefined) => (v === undefined ? "—" : String(v));

  return (
    <div className="space-y-8">
      <Link href="/drivers" className="text-xs text-muted-foreground hover:text-foreground">
        ← All drivers
      </Link>

      <header className="flex flex-wrap items-center gap-4">
        <DriverAvatar name={d.name} slug={d.slug} manufacturer={d.manufacturer} size={80} />
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
        <h2 className="text-lg font-semibold">2026 season</h2>
        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6">
          <Stat label="Wins" value={num(s.wins)} />
          <Stat label="Top 3" value={num(s.top3)} />
          <Stat label="Top 5" value={num(s.top5)} />
          <Stat label="Top 10" value={num(s.top10)} />
          <Stat label="DNFs" value={num(s.dnf)} />
          <Stat label="Avg Fin" value={s.avgFinish === undefined ? "—" : fmt(s.avgFinish, 1)} />
        </div>
        {s.wins === undefined && (
          <p className="text-xs text-muted-foreground">
            Season totals for this driver haven&apos;t been entered yet.
          </p>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Points through the year</h2>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Points behind the standings leader at each checkpoint. Flat along the
          top is the lead; a falling line is ground lost.
        </p>
        <DriverPointsChart
          checkpoints={history.checkpoints}
          line={history.line}
          color={MFR_PLATE[d.manufacturer].bg}
        />
        <DataSourceNote source={source} />
      </section>
    </div>
  );
}
