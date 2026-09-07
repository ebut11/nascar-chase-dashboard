import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ModelChip } from "@/components/model-chip";
import type { FeatureImportance } from "@/lib/types";

function ImportanceList({
  model,
  rows,
}: {
  model: "basic" | "advanced";
  rows: FeatureImportance[];
}) {
  const max = Math.max(...rows.map((r) => r.importance), 0.0001);
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm font-medium">
          <span className="text-muted-foreground">Gini importance</span>
          <ModelChip model={model} />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {rows.map((r) => (
          <div key={r.feature} className="grid grid-cols-[5.5rem_1fr_3rem] items-center gap-3">
            <span className="truncate text-right font-mono text-xs text-muted-foreground">
              {r.feature}
            </span>
            <span className="relative block h-4 rounded-sm bg-muted/60">
              <span
                className="absolute inset-y-0 left-0 rounded-sm"
                style={{
                  width: `${(r.importance / max) * 100}%`,
                  background: model === "basic" ? "var(--basic)" : "var(--advanced)",
                }}
              />
            </span>
            <span className="tabular text-right text-xs text-muted-foreground">
              {(r.importance * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function ImportancePanel({
  basic,
  advanced,
}: {
  basic: FeatureImportance[];
  advanced: FeatureImportance[];
}) {
  return (
    <div className="space-y-4">
      <p className="max-w-2xl text-sm text-muted-foreground">
        How much each input feature drove its model&apos;s Random-Forest projection
        for this race. Both models are regularized (<code className="font-mono text-xs">max_depth=5</code>,{" "}
        <code className="font-mono text-xs">min_samples_leaf=3</code>) and trained on the full
        intermediate-track field.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <ImportanceList model="basic" rows={basic} />
        <ImportanceList model="advanced" rows={advanced} />
      </div>
    </div>
  );
}
