"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export interface WeekRow {
  week: number;
  track: string;
  points: number; // points scored that race
  cumPoints: number; // running season total after that race
  place: number; // standings position after that race
}

const W = 760;
const H = 300;
const M = { top: 16, right: 20, bottom: 40, left: 42 };
const PW = W - M.left - M.right;
const PH = H - M.top - M.bottom;

export function SeasonPointsChart({
  rows,
  color,
  highlightWeek,
}: {
  rows: WeekRow[];
  color: string;
  /** race # to call out on the chart (e.g. the Chase opener at Darlington) */
  highlightWeek?: number;
}) {
  const [mode, setMode] = useState<"place" | "points">("place");
  const [hi, setHi] = useState<number | null>(null);

  if (!rows || rows.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border/70 bg-card p-8 text-center text-sm text-muted-foreground">
        Race-by-race season history hasn&apos;t been loaded for this driver yet.
      </div>
    );
  }

  const nWeeks = Math.max(...rows.map((r) => r.week));
  const x = (wk: number) => M.left + ((wk - 1) / Math.max(1, nWeeks - 1)) * PW;

  const placeMax = Math.max(...rows.map((r) => r.place), 5);
  const ptsMax = Math.max(...rows.map((r) => r.cumPoints), 1);

  // place: 1 at top (best), placeMax at bottom. points: 0 at bottom, ptsMax at top.
  const y = (r: WeekRow) =>
    mode === "place"
      ? M.top + ((r.place - 1) / (placeMax - 1)) * PH
      : M.top + PH - (r.cumPoints / ptsMax) * PH;

  const line = rows
    .slice()
    .sort((a, b) => a.week - b.week)
    .map((r, i) => `${i === 0 ? "M" : "L"}${x(r.week)},${y(r)}`)
    .join(" ");

  const yTicks =
    mode === "place"
      ? [1, 5, 10, 15, 20, 25, 30, 35].filter((v) => v <= placeMax)
      : [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(f * ptsMax));

  const yOf = (v: number) =>
    mode === "place"
      ? M.top + ((v - 1) / (placeMax - 1)) * PH
      : M.top + PH - (v / ptsMax) * PH;

  const xTicks: number[] = [];
  for (let w = 1; w <= nWeeks; w += nWeeks > 14 ? 3 : 2) xTicks.push(w);
  if (xTicks[xTicks.length - 1] !== nWeeks) xTicks.push(nWeeks);

  const hlRow =
    highlightWeek != null
      ? rows.find((r) => r.week === highlightWeek) ?? null
      : null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          {mode === "place"
            ? "Points-standings position after each race — lower is better."
            : "Cumulative season points, race by race."}
        </p>
        <div className="inline-flex rounded-lg border border-border/70 p-0.5 text-xs">
          {(["place", "points"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              aria-pressed={mode === m}
              className={cn(
                "rounded-md px-2.5 py-1 font-medium transition-colors",
                mode === m
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {m === "place" ? "Position" : "Points"}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border/70 bg-card p-3">
        <svg viewBox={`0 0 ${W} ${H}`} className="min-w-[560px] w-full" role="img" aria-label="Season points history">
          {yTicks.map((v) => (
            <g key={v}>
              <line
                x1={M.left}
                x2={M.left + PW}
                y1={yOf(v)}
                y2={yOf(v)}
                stroke="var(--track-line)"
                strokeWidth={1}
              />
              <text
                x={M.left - 7}
                y={yOf(v) + 3}
                textAnchor="end"
                className="fill-muted-foreground"
                fontSize={10}
              >
                {mode === "place" ? `P${v}` : v}
              </text>
            </g>
          ))}

          {xTicks.map((w) => (
            <text
              key={w}
              x={x(w)}
              y={H - M.bottom + 16}
              textAnchor="middle"
              className="fill-muted-foreground"
              fontSize={10}
            >
              {w}
            </text>
          ))}
          <text
            x={M.left + PW / 2}
            y={H - 6}
            textAnchor="middle"
            className="fill-muted-foreground"
            fontSize={10}
          >
            Race #
          </text>

          {hlRow && (
            <g>
              <line
                x1={x(hlRow.week)}
                x2={x(hlRow.week)}
                y1={M.top}
                y2={M.top + PH}
                stroke="var(--speed, #e11d48)"
                strokeWidth={1.5}
                strokeDasharray="4 3"
                opacity={0.7}
              />
              <text
                x={x(hlRow.week)}
                y={M.top - 4}
                textAnchor="middle"
                fontSize={10}
                fontWeight={700}
                className="fill-speed"
              >
                Chase opener · Darlington
              </text>
            </g>
          )}

          <path d={line} fill="none" stroke={color} strokeWidth={2.25} strokeLinejoin="round" />

          {hlRow && (
            <circle
              cx={x(hlRow.week)}
              cy={y(hlRow)}
              r={7}
              fill="var(--speed, #e11d48)"
              stroke="var(--card)"
              strokeWidth={2}
            />
          )}

          {rows.map((r) => {
            const on = hi === r.week;
            return (
              <g key={r.week}>
                <circle
                  cx={x(r.week)}
                  cy={y(r)}
                  r={on ? 5 : 2.75}
                  fill="var(--card)"
                  stroke={color}
                  strokeWidth={2}
                  onMouseEnter={() => setHi(r.week)}
                  onMouseLeave={() => setHi(null)}
                  style={{ cursor: "pointer" }}
                />
                {on && (
                  <g transform={`translate(${Math.min(x(r.week) + 8, M.left + PW - 150)}, ${Math.max(y(r) - 8, M.top + 14)})`}>
                    <rect width={150} height={44} rx={4} fill="var(--popover)" stroke="var(--border)" />
                    <text x={7} y={15} fontSize={11} className="fill-foreground" fontWeight={600}>
                      Race {r.week} · {r.track}
                    </text>
                    <text x={7} y={30} fontSize={10} className="fill-muted-foreground">
                      P{r.place} · {r.cumPoints} pts total
                    </text>
                    <text x={7} y={40} fontSize={10} className="fill-muted-foreground">
                      +{r.points} this race
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
