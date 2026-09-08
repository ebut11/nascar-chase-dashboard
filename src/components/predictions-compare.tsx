import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ModelChip } from "@/components/model-chip";
import { CarNo } from "@/components/car-no";
import { cn } from "@/lib/utils";
import type { Prediction } from "@/lib/types";

type CarNumbers = Record<string, number | null>;

function Leaderboard({
  model,
  rows,
  highlight,
  carNumbers,
}: {
  model: "basic" | "advanced";
  rows: Prediction[];
  highlight: Set<string>;
  carNumbers: CarNumbers;
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm font-medium">
          <span className="text-muted-foreground">Projected order</span>
          <ModelChip model={model} />
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <ol className="divide-y divide-border/70">
          {rows.map((p, i) => (
            <li
              key={p.driver}
              className={cn(
                "flex items-center gap-3 px-4 py-1.5 text-sm",
                highlight.has(p.driver) && "bg-speed/10",
              )}
            >
              <span className="tabular w-6 text-right text-xs text-muted-foreground">
                {i + 1}
              </span>
              <span className="flex flex-1 items-center gap-2 truncate">
                <span className="truncate">{p.driver}</span>
                <CarNo n={carNumbers[p.driver]} driver={p.driver} />
              </span>
              {p.data_source?.startsWith("Track-Type") && (
                <span
                  title="No track history — season-form-only projection"
                  className="rounded bg-muted px-1 text-[10px] uppercase tracking-wide text-muted-foreground"
                >
                  form only
                </span>
              )}
              <span className="tabular w-10 text-right text-muted-foreground">
                {p.projected_finish.toFixed(1)}
              </span>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}

export function PredictionsCompare({
  basic,
  advanced,
  carNumbers,
}: {
  basic: Prediction[];
  advanced: Prediction[];
  carNumbers: CarNumbers;
}) {
  const rankOf = (rows: Prediction[]) =>
    new Map(rows.map((p, i) => [p.driver, i + 1]));
  const bRank = rankOf(basic);
  const aRank = rankOf(advanced);

  const disagreements = [...bRank.keys()]
    .map((d) => ({
      driver: d,
      basic: bRank.get(d)!,
      advanced: aRank.get(d) ?? null,
      gap: aRank.has(d) ? Math.abs(bRank.get(d)! - aRank.get(d)!) : 0,
    }))
    .filter((d) => d.advanced !== null)
    .sort((x, y) => y.gap - x.gap)
    .slice(0, 4);

  const highlight = new Set(disagreements.map((d) => d.driver));

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border/70 bg-card p-4">
        <h3 className="text-sm font-medium">Where the models disagree most</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Largest gaps between the two projected running orders — the drivers this
          race is really testing.
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {disagreements.map((d) => (
            <li
              key={d.driver}
              className="rounded-md border border-speed/30 bg-speed/10 px-2.5 py-1 text-xs"
            >
              <span className="font-medium">{d.driver}</span>{" "}
              <CarNo n={carNumbers[d.driver]} driver={d.driver} />{" "}
              <span className="tabular text-muted-foreground">
                B&nbsp;P{d.basic} · A&nbsp;P{d.advanced} · Δ{d.gap}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Leaderboard model="basic" rows={basic} highlight={highlight} carNumbers={carNumbers} />
        <Leaderboard model="advanced" rows={advanced} highlight={highlight} carNumbers={carNumbers} />
      </div>
    </div>
  );
}
