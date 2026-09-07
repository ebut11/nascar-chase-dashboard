import { cn } from "@/lib/utils";
import { fmt } from "@/lib/format";
import { MODEL_BLURB, MODEL_LABEL } from "@/lib/format";
import type { DuelStanding } from "@/lib/data";

function Side({
  standing,
  leading,
}: {
  standing: DuelStanding;
  leading: boolean;
}) {
  const model = standing.model;
  return (
    <div
      className={cn(
        "relative flex-1 rounded-xl border p-5",
        model === "basic" ? "border-basic/30" : "border-advanced/30",
        leading && "ring-1",
        leading && (model === "basic" ? "ring-basic/50" : "ring-advanced/50"),
      )}
    >
      <div className="flex items-center gap-2">
        <span
          className={cn("size-2.5 rounded-full", model === "basic" ? "bg-basic" : "bg-advanced")}
          aria-hidden
        />
        <h3 className="text-sm font-semibold">{MODEL_LABEL[model]} model</h3>
        {leading && (
          <span className="ml-auto rounded-full bg-speed/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-speed">
            Leading
          </span>
        )}
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{MODEL_BLURB[model]}</p>

      <div className="mt-4 flex items-end gap-1">
        <span
          className={cn(
            "tabular text-5xl font-bold leading-none",
            model === "basic" ? "text-basic" : "text-advanced",
          )}
        >
          {standing.wins}
        </span>
        <span className="mb-1 text-xs text-muted-foreground">
          / {standing.racesScored} race{standing.racesScored === 1 ? "" : "s"} won
        </span>
      </div>

      <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-md bg-muted/50 py-2">
          <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">Avg MAE</dt>
          <dd className="tabular text-sm font-semibold">{fmt(standing.avgMae, 2)}</dd>
        </div>
        <div className="rounded-md bg-muted/50 py-2">
          <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">Avg R²</dt>
          <dd className="tabular text-sm font-semibold">{fmt(standing.avgR2, 3)}</dd>
        </div>
        <div className="rounded-md bg-muted/50 py-2">
          <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">Top-10</dt>
          <dd className="tabular text-sm font-semibold">{standing.totalTop10}</dd>
        </div>
      </dl>
    </div>
  );
}

export function DuelScoreboard({ standings }: { standings: DuelStanding[] }) {
  const [basic, advanced] = standings;
  const bScore = basic.wins;
  const aScore = advanced.wins;
  const basicLeads = bScore > aScore || (bScore === aScore && (basic.avgMae ?? 99) < (advanced.avgMae ?? 99));
  const tie = bScore === aScore && basic.avgMae === advanced.avgMae;

  return (
    <section className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
        <Side standing={basic} leading={!tie && basicLeads} />
        <div className="flex items-center justify-center px-2">
          <span className="checkers h-10 w-8 rounded-sm sm:h-full" aria-hidden />
        </div>
        <Side standing={advanced} leading={!tie && !basicLeads} />
      </div>
      <p className="text-xs text-muted-foreground">
        &ldquo;Race won&rdquo; = lower mean absolute error that weekend. Tiebreak on
        season average MAE. Feature importances are aggregated into the end-of-Chase report.
      </p>
    </section>
  );
}
