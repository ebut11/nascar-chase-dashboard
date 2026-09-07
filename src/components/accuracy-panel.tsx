import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ModelChip } from "@/components/model-chip";
import { cn } from "@/lib/utils";
import { fmt, ordinal } from "@/lib/format";
import type { DriverRaceRow, ModelScore } from "@/lib/types";

function Stat({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-lg border border-border/70 bg-card p-3">
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className={cn("tabular mt-1 text-xl font-semibold", accent && "text-speed")}>{value}</div>
      {sub && <div className="mt-0.5 text-xs text-muted-foreground">{sub}</div>}
    </div>
  );
}

function ScoreCard({ score }: { score: ModelScore }) {
  const model = score.model_type;
  const gap =
    score.mae != null && score.cv_mae != null ? score.mae - score.cv_mae : null;
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm font-medium">
          <span className="text-muted-foreground">Race accuracy</span>
          <ModelChip model={model} />
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        <Stat label="Race MAE" value={fmt(score.mae, 2)} sub="positions" accent />
        <Stat label="RMSE" value={fmt(score.rmse, 2)} />
        <Stat label="R²" value={fmt(score.r2, 3)} sub="vs. actual finish" />
        <Stat
          label="CV MAE"
          value={fmt(score.cv_mae, 2)}
          sub={gap != null ? `${gap >= 0 ? "+" : ""}${gap.toFixed(2)} on race day` : undefined}
        />
        <Stat label="Top-5 hit" value={`${score.top5_hits ?? 0}/5`} />
        <Stat label="Top-10 hit" value={`${score.top10_hits ?? 0}/10`} />
        <div className="col-span-2 rounded-lg border border-border/70 bg-card p-3 sm:col-span-3">
          <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
            Predicted winner
          </div>
          <div className="mt-1 text-sm">
            <span className="font-medium">{score.predicted_winner}</span>
            <span className="text-muted-foreground">
              {" "}
              — finished{" "}
              {score.predicted_winner_actual_finish != null
                ? ordinal(score.predicted_winner_actual_finish)
                : "—"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CallsList({
  title,
  rows,
  tone,
}: {
  title: string;
  rows: { driver: string; note: string }[];
  tone: "good" | "bad";
}) {
  return (
    <div className="rounded-lg border border-border/70 bg-card p-4">
      <h4 className={cn("text-sm font-medium", tone === "good" ? "text-emerald-400" : "text-rose-400")}>
        {title}
      </h4>
      <ul className="mt-2 space-y-1.5 text-sm">
        {rows.map((r) => (
          <li key={r.driver} className="flex items-baseline justify-between gap-3">
            <span className="truncate">{r.driver}</span>
            <span className="tabular shrink-0 text-xs text-muted-foreground">{r.note}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AccuracyPanel({
  basic,
  advanced,
  rows,
}: {
  basic: ModelScore;
  advanced: ModelScore;
  rows: DriverRaceRow[];
}) {
  const scored = rows.filter((r) => r.actual != null && r.basic != null && r.advanced != null);

  const byCombinedErr = [...scored].sort(
    (a, b) =>
      (a.basic_error! + a.advanced_error!) / 2 - (b.basic_error! + b.advanced_error!) / 2,
  );
  const bestCalls = byCombinedErr.slice(0, 4).map((r) => ({
    driver: r.driver,
    note: `P${r.actual} · B ${r.basic!.toFixed(1)} / A ${r.advanced!.toFixed(1)}`,
  }));
  const worstMisses = byCombinedErr
    .slice(-4)
    .reverse()
    .map((r) => ({
      driver: r.driver,
      note: `P${r.actual} · B ±${r.basic_error!.toFixed(0)} / A ±${r.advanced_error!.toFixed(0)}`,
    }));

  const winner =
    basic.mae != null && advanced.mae != null
      ? basic.mae < advanced.mae
        ? "basic"
        : advanced.mae < basic.mae
          ? "advanced"
          : null
      : null;

  return (
    <div className="space-y-4">
      {winner && (
        <div className="flex items-center gap-3 rounded-lg border border-speed/30 bg-speed/10 px-4 py-3 text-sm">
          <span className="checkers size-5 rounded-sm" aria-hidden />
          <span>
            This race goes to the <ModelChip model={winner} className="mx-1 align-middle" /> model —
            lower MAE ({fmt(winner === "basic" ? basic.mae : advanced.mae, 2)} vs{" "}
            {fmt(winner === "basic" ? advanced.mae : basic.mae, 2)}) and the tighter fit.
          </span>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <ScoreCard score={basic} />
        <ScoreCard score={advanced} />
      </div>

      <p className="max-w-2xl text-xs text-muted-foreground">
        Cross-validated MAE is the honest pre-race estimate (5-fold on the training
        field). The jump to race-day MAE is what one 38-car race with attrition and
        upset winners looks like — the season comparison only means something in
        aggregate.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <CallsList title="Both models nailed it" rows={bestCalls} tone="good" />
        <CallsList title="Both models whiffed" rows={worstMisses} tone="bad" />
      </div>
    </div>
  );
}
