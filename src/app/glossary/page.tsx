import type { Metadata } from "next";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Stat Glossary — The Model Duel",
  description:
    "Plain-language definitions for every NASCAR box-score and loop-data stat used in the basic and advanced models, sourced from Lap Raptor.",
};

type Tag = "basic" | "advanced";

interface Term {
  abbr: string;
  name: string;
  def: string;
  tag?: Tag;
}

interface Group {
  title: string;
  blurb?: string;
  terms: Term[];
}

const GROUPS: Group[] = [
  {
    title: "Finishing & rate stats",
    terms: [
      { abbr: "W%", name: "Winning percentage", def: "Share of a driver's races that ended in a win." },
      { abbr: "T3%", name: "Top-3 percentage", def: "Share of races finished in the top 3." },
      { abbr: "T5%", name: "Top-5 percentage", def: "Share of races finished in the top 5." },
      { abbr: "T10%", name: "Top-10 percentage", def: "Share of races finished in the top 10.", tag: "basic" },
      { abbr: "Fin%", name: "Finish rate", def: "Share of races the driver was still running at the end.", tag: "basic" },
      {
        abbr: "f-stats",
        name: "Finish-based variants",
        def: "A leading \"f\" (fW%, fT5%, fAFP, …) means the same stat computed on finishing position rather than running position — \"the stat, but in finishes.\"",
      },
    ],
  },
  {
    title: "Position averages",
    terms: [
      { abbr: "ASP", name: "Average starting position", def: "Mean qualifying/starting spot.", tag: "basic" },
      { abbr: "ARP", name: "Average running position", def: "Mean green-flag running position across all laps." },
      {
        abbr: "wARP",
        name: "Weighted average running position",
        tag: "advanced",
        def: "Green-flag running position with each lap weighted by how well that lap predicts the eventual finish across Lap Raptor's whole dataset. Later laps count more, so it better reflects strategy and smart driving (early on, a driver may trade track position for speed or to dodge incidents).",
      },
      { abbr: "AFP", name: "Average finish position", def: "Mean finishing spot. The models' prediction target." },
      { abbr: "GF Laps", name: "Green-flag laps", def: "Laps run under green (caution laps excluded)." },
    ],
  },
  {
    title: "Performance vs. expectation",
    terms: [
      {
        abbr: "PFAE",
        name: "Positions Finished Above Expected",
        def: "Finish versus the average finish for that starting spot. Start 12th, finish 6th, and the typical finish from 12th is 13th → +7 PFAE.",
      },
      { abbr: "Avg. PFAE", name: "Average PFAE", def: "A driver's mean PFAE across races.", tag: "advanced" },
      {
        abbr: "PFAEz",
        name: "PFAE z-score",
        def: "Average PFAE divided by the historical finish standard deviation for comparable starting positions.",
      },
      {
        abbr: "Succ%",
        name: "Success rate",
        def: "Share of races finished better than the expected finish for the start (see PFAE). Expected finish is used instead of raw start so strong qualifiers aren't punished — from pole, beating your start is impossible.",
        tag: "basic",
      },
      {
        abbr: "wSucc%",
        name: "Weighted success rate",
        def: "Average weighted percentile of each finish among comparable starting positions.",
      },
      {
        abbr: "PGAE",
        name: "Positions Gained Above Expected",
        def: "For each green-flag lap, compare where the driver ends up next lap against the average next-lap position for their current spot, and sum the gaps. Running 12th where 12th averages 11.95th next lap: gaining a spot scores +0.95, holding scores −0.05. PGAE/100 is the average per 100 green-flag laps.",
        tag: "advanced",
      },
      {
        abbr: "PFARP",
        name: "Positions Finished Above Running Position",
        def: "Like PFAE, but versus the average finish for your running position at that exact point in the race. Running 12th on lap 100 where the average finish is 13th, then finishing 6th → +7 PFARP.",
      },
      {
        abbr: "wPFARP",
        name: "Weighted PFARP",
        def: "PFARP with laps weighted by how predictive that point in the race is of the final finish (see wARP).",
      },
    ],
  },
  {
    title: "Speed",
    terms: [
      {
        abbr: "SS",
        name: "Speed Score",
        def: "1000 × the ratio of the driver's 95th-percentile lap to the race's 95th-percentile lap. A clean read on top-end speed.",
        tag: "advanced",
      },
      {
        abbr: "cPOMS",
        name: "Continuously graded POMS",
        def: "Grades each lap's speed against the fastest version of that same lap number across all drivers, rather than against the single fastest lap of the race. Builds on Lap Raptor's POMS / rPOMS family.",
        tag: "advanced",
      },
      {
        abbr: "LSP",
        name: "Lap Speed Percentile",
        def: "Average percentile rank of each eligible lap among laps with the same lap number. 0 = slowest, 1 = fastest.",
      },
      {
        abbr: "RSP",
        name: "Restart Speed Percentile",
        def: "Percentile rank of a driver's average restart speed within a race. Multi-race numbers average those per-race percentiles. 0 = slowest, 1 = fastest.",
      },
    ],
  },
  {
    title: "Passing quality",
    terms: [
      {
        abbr: "GR",
        name: "Gain Rating",
        def: "Weighted count of positions gained. Each gaining lap scores (positions gained) × (weight of the starting position), where weight ≈ 1/N for position N — so passing from the front is worth far more than from the back, where cars are slower and there's more room.",
      },
      {
        abbr: "LR",
        name: "Loss Rating",
        def: "Same idea for positions lost, but weighted by distance from the back of the field, so losing spots near the front is penalized harder. Higher is worse.",
      },
      { abbr: "GR−LR", name: "Net Rating", def: "Gain Rating minus Loss Rating." },
    ],
  },
];

function TagBadge({ tag }: { tag: Tag }) {
  return (
    <span
      className={cn(
        "shrink-0 rounded-full border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide",
        tag === "basic" ? "border-basic/40 text-basic" : "border-advanced/40 text-advanced",
      )}
    >
      {tag} input
    </span>
  );
}

export default function GlossaryPage() {
  return (
    <div className="max-w-3xl space-y-8">
      <header className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          <span className="h-px w-6 bg-speed" />
          Reference
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Stat glossary</h1>
        <p className="text-sm text-muted-foreground">
          Plain-language definitions for the box-score and loop-data stats the two
          models run on. Metrics tagged{" "}
          <span className="text-basic">basic input</span> or{" "}
          <span className="text-advanced">advanced input</span> are what that model
          actually feeds its Random Forest. Definitions adapted from{" "}
          <a
            href="https://www.lapraptor.com"
            className="underline underline-offset-2 hover:text-foreground"
            target="_blank"
            rel="noreferrer"
          >
            LapRaptor.com
          </a>
          .
        </p>
      </header>

      {GROUPS.map((g) => (
        <section key={g.title} className="space-y-3">
          <h2 className="text-lg font-semibold">{g.title}</h2>
          <dl className="divide-y divide-border/70 overflow-hidden rounded-lg border border-border/70">
            {g.terms.map((t) => (
              <div key={t.abbr} className="grid gap-1 p-4 sm:grid-cols-[8rem_1fr] sm:gap-4">
                <dt className="flex items-start gap-2">
                  <span className="font-mono text-sm font-semibold">{t.abbr}</span>
                  {t.tag && <TagBadge tag={t.tag} />}
                </dt>
                <dd className="text-sm text-muted-foreground">
                  <span className="text-foreground">{t.name}.</span> {t.def}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}
