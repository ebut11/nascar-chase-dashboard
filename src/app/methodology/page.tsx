import type { Metadata } from "next";
import { ModelChip } from "@/components/model-chip";

export const metadata: Metadata = {
  title: "Methodology — The Model Duel",
  description:
    "How the basic and advanced Random Forest models are built, blended, cross-validated, and scored across the 2026 NASCAR Chase.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="space-y-2 text-sm text-muted-foreground">{children}</div>
    </section>
  );
}

export default function MethodologyPage() {
  return (
    <div className="max-w-2xl space-y-8">
      <header className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          <span className="h-px w-6 bg-speed" />
          How this works
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Methodology</h1>
        <p className="text-sm text-muted-foreground">
          The same pipeline runs for every Chase race. The only thing that changes
          race to race is the input data — never the model spec or the scoring
          rules, so the end-of-season comparison stays honest.
        </p>
      </header>

      <Section title="The two models">
        <p>
          Both are <code className="font-mono text-xs">RandomForestRegressor</code> (scikit-learn),{" "}
          <code className="font-mono text-xs">n_estimators=100</code>, regularized to{" "}
          <code className="font-mono text-xs">max_depth=5</code>,{" "}
          <code className="font-mono text-xs">min_samples_leaf=3</code>. Target is average
          finish position.
        </p>
        <ul className="ml-4 list-disc space-y-1">
          <li>
            <ModelChip model="basic" /> — box-score inputs: average start, win %, top-10 %,
            finish %, success rate.
          </li>
          <li>
            <ModelChip model="advanced" /> — engineered loop-data inputs: speed score,
            pass-gain above expected, cumulative production over multiple starts (cPOMS),
            weighted average running position (wARP), average position vs. expected.
          </li>
        </ul>
      </Section>

      <Section title="Training set">
        <p>
          Each model trains on the <strong>full intermediate-track field</strong> for the
          2026 season — every car with data, not just the current entry list. Restricting
          to entrants happens only when building the per-driver profile that gets fed in
          for the projection, so no training rows are wasted and non-entrants never leak
          into the output.
        </p>
      </Section>

      <Section title="Blending history with current form">
        <p>
          A driver&apos;s input profile is a weighted blend of their track-specific history
          and their track-type season form. Darlington ran{" "}
          <strong>60% season form / 40% track history</strong> — small track-history samples
          are noisy and current-year pace is the better signal, but Darlington is enough of
          a specialist track that history still gets real weight. Drivers with no track
          history get a form-only projection, flagged separately.
        </p>
      </Section>

      <Section title="Cross-validation">
        <p>
          In-sample error on a Random Forest looks near-perfect and means nothing on a
          ~40-row dataset. The trustworthy pre-race number is <strong>5-fold cross-validated
          MAE</strong>. Expect it to be optimistic versus race day: a single 38-car race
          carries attrition, cautions, and upset winners that no pre-race model prices in.
        </p>
      </Section>

      <Section title="Scoring">
        <p>Once the results are in, each model is graded on the full field:</p>
        <ul className="ml-4 list-disc space-y-1">
          <li><strong>MAE / RMSE</strong> — average and outlier-weighted miss, in positions.</li>
          <li><strong>R²</strong> — variance in actual finish explained by the projection.</li>
          <li><strong>Top-5 / top-10 hit rate</strong> — how many predicted top finishers actually finished there.</li>
        </ul>
        <p>
          The model with the lower MAE &ldquo;wins&rdquo; that race. Feature importances are
          stored per race and aggregated into the end-of-Chase writeup.
        </p>
      </Section>

      <Section title="Data pipeline">
        <p>
          Models are run locally in Python race week; projections and, after the race,
          finishing order plus loop data are loaded into Supabase (Postgres). This site
          reads that schema directly — races, drivers, predictions, results, model_scores,
          and feature_importances — with row-level security set to public read-only.
        </p>
      </Section>
    </div>
  );
}
