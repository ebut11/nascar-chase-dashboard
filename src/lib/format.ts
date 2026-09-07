export function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] ?? s[v] ?? s[0]);
}

export function fmt(n: number | null | undefined, digits = 1): string {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  return n.toFixed(digits);
}

export function fmtDate(iso: string | null): string {
  if (!iso) return "Date TBD";
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/** classify an absolute prediction error into a severity bucket for coloring */
export function errorBucket(err: number | null): "great" | "ok" | "off" | "bad" | "none" {
  if (err === null) return "none";
  if (err <= 3) return "great";
  if (err <= 6) return "ok";
  if (err <= 12) return "off";
  return "bad";
}

export const MODEL_LABEL: Record<"basic" | "advanced", string> = {
  basic: "Basic",
  advanced: "Advanced",
};

export const MODEL_BLURB: Record<"basic" | "advanced", string> = {
  basic: "Box-score stats: avg. start, win %, top-10 %, finish %, success rate",
  advanced: "Engineered metrics: speed score, pass-gain, cPOMS, avg. running pos., pos. vs. expected",
};
