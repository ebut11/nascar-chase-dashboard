"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Assignment 4: a separately deployed scikit-learn Pipeline (custom
// FormIndexEngineer transformer -> StandardScaler -> NearestNeighbors),
// served by FastAPI on Modal. This page just calls that live API.
const API_URL = "https://ebut11--nascar-driver-anomaly-api-fastapi-app.modal.run";

type FieldKey =
  | "asp"
  | "arp"
  | "afp"
  | "succ_pct"
  | "pgae_per_100"
  | "gr_lr"
  | "ss"
  | "cpoms";

const FIELDS: { key: FieldKey; label: string; step: string; hint: string }[] = [
  { key: "asp", label: "Avg. Starting Position", step: "0.01", hint: "1–45" },
  { key: "arp", label: "Avg. Running Position", step: "0.01", hint: "1–45" },
  { key: "afp", label: "Avg. Finish Position", step: "0.01", hint: "1–45" },
  { key: "succ_pct", label: "Success Rate %", step: "0.1", hint: "0–100" },
  { key: "pgae_per_100", label: "Positions Gained / 100 laps", step: "0.01", hint: "-50–50" },
  { key: "gr_lr", label: "Net Rating (GR-LR)", step: "0.01", hint: "-10–10" },
  { key: "ss", label: "Speed Score", step: "0.01", hint: "-50–50" },
  { key: "cpoms", label: "% of Max Speed (cPOMS)", step: "0.001", hint: "0.5–1.5" },
];

const DEFAULTS: Record<FieldKey, string> = {
  asp: "10",
  arp: "9",
  afp: "8",
  succ_pct: "90",
  pgae_per_100: "2.5",
  gr_lr: "0.3",
  ss: "4.1",
  cpoms: "0.98",
};

type NearestDriver = { driver: string; distance: number };
type AnomalyResponse = {
  driver: string;
  anomaly_score: number;
  nearest_drivers: NearestDriver[];
  engineered: Record<string, number>;
};

export default function DriverCheckPage() {
  const [name, setName] = useState("Custom Driver");
  const [values, setValues] = useState<Record<FieldKey, string>>(DEFAULTS);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnomalyResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const body = {
      driver: name,
      ...Object.fromEntries(FIELDS.map((f) => [f.key, Number(values[f.key])])),
    };

    try {
      const res = await fetch(`${API_URL}/anomaly-score`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.status === 422) {
        const detail = await res.json();
        setError(
          "One or more values are out of the pipeline's accepted range: " +
            JSON.stringify(detail.detail),
        );
        return;
      }
      if (res.status === 503) {
        setError("The pipeline API is temporarily unavailable (artifact not loaded). Try again shortly.");
        return;
      }
      if (!res.ok) {
        setError(`API error (${res.status})`);
        return;
      }

      setResult(await res.json());
    } catch {
      setError("Couldn't reach the pipeline API. It may be cold-starting — try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-8">
      <header className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          <span className="h-px w-6 bg-speed" />
          Live scikit-learn pipeline on Modal
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Driver Anomaly Check</h1>
        <p className="text-sm text-muted-foreground">
          Enter a stat line and a fitted pipeline (a custom{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">FormIndexEngineer</code>{" "}
          transformer → <code className="rounded bg-muted px-1 py-0.5 text-xs">StandardScaler</code>{" "}
          → <code className="rounded bg-muted px-1 py-0.5 text-xs">NearestNeighbors</code>) scores how
          unusual that stat line is against every full-time driver&apos;s full 2026
          season (all 28 races so far, every track), and shows the most comparable
          real drivers. Runs live against the deployed FastAPI / Modal endpoint —
          nothing here is precomputed.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Stat line</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Driver name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={80}
                required
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {FIELDS.map((f) => (
                <div key={f.key} className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    {f.label} <span className="text-muted-foreground/60">({f.hint})</span>
                  </label>
                  <input
                    type="number"
                    step={f.step}
                    required
                    value={values[f.key]}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, [f.key]: e.target.value }))
                    }
                    className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  />
                </div>
              ))}
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? "Scoring…" : "Score this driver"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-destructive/40">
          <CardContent className="text-sm text-destructive">{error}</CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Result for {result.driver}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Anomaly score
              </div>
              <div className="text-2xl font-bold tabular">
                {result.anomaly_score.toFixed(3)}
              </div>
              <p className="text-xs text-muted-foreground">
                Mean scaled distance to the 5 nearest drivers in the fitted field.
                Higher = more unusual stat line.
              </p>
            </div>

            <div>
              <div className="mb-1.5 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Nearest comparable drivers
              </div>
              <ul className="divide-y divide-border/70 rounded-lg border border-border/70">
                {result.nearest_drivers.map((d, i) => (
                  <li
                    key={d.driver}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 text-sm",
                      i === 0 && "font-medium",
                    )}
                  >
                    <span>{d.driver}</span>
                    <span className="tabular text-muted-foreground">
                      distance {d.distance.toFixed(3)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
