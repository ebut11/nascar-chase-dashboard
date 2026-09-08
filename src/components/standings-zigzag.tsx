"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { MANUFACTURER, type Manufacturer } from "@/lib/manufacturers";
import type { StandingsSeries } from "@/lib/data";

const LINE_COLOR: Record<Manufacturer, string> = {
  Toyota: "#e2564a",
  Ford: "#4b9fe1",
  Chevrolet: "#e0b23c",
};
const NEUTRAL_LINE = "#8a8a8a";

const W = 820;
const H = 420;
const M = { top: 18, right: 104, bottom: 44, left: 46 };
const PW = W - M.left - M.right;
const PH = H - M.top - M.bottom;

function lastName(name: string) {
  const p = name.split(" ");
  return p.length > 1 ? p.slice(1).join(" ") : name;
}

export function StandingsZigZag({ series }: { series: StandingsSeries }) {
  const [hover, setHover] = useState<string | null>(null);
  const [pin, setPin] = useState<string | null>(null);
  const active = pin ?? hover;

  const { checkpoints, lines, maxBehind } = series;
  const cpCount = Math.max(checkpoints.length, 1);

  const x = (i: number) =>
    M.left + (cpCount === 1 ? PW / 2 : (i / (cpCount - 1)) * PW);
  const y = (behind: number) => M.top + (behind / (maxBehind * 1.08)) * PH;

  const yTicks = useMemo(() => {
    const step = maxBehind <= 40 ? 10 : maxBehind <= 120 ? 25 : 50;
    const t: number[] = [0];
    for (let v = step; v <= maxBehind * 1.05; v += step) t.push(v);
    return t;
  }, [maxBehind]);

  const path = (pts: { x: number; behind: number }[]) =>
    pts.map((p, i) => `${i === 0 ? "M" : "L"}${x(p.x)},${y(p.behind)}`).join(" ");

  const colorOf = (driver: string) => {
    const m = MANUFACTURER[driver];
    return m ? LINE_COLOR[m] : NEUTRAL_LINE;
  };

  if (checkpoints.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border/70 bg-card p-10 text-center text-sm text-muted-foreground">
        Standings history appears here once the first race is scored.
      </div>
    );
  }

  const activeLine = lines.find((l) => l.driver === active);

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-xl border border-border/70 bg-card p-3">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="min-w-[640px] w-full"
          role="img"
          aria-label="Chase points behind the leader, by race"
        >
          {/* y gridlines + labels */}
          {yTicks.map((v) => (
            <g key={v}>
              <line
                x1={M.left}
                x2={M.left + PW}
                y1={y(v)}
                y2={y(v)}
                stroke="var(--track-line)"
                strokeWidth={1}
              />
              <text
                x={M.left - 8}
                y={y(v) + 3}
                textAnchor="end"
                className="fill-muted-foreground"
                fontSize={10}
              >
                {v === 0 ? "Leader" : `-${v}`}
              </text>
            </g>
          ))}

          {/* x labels */}
          {checkpoints.map((c, i) => (
            <g key={i}>
              <text
                x={x(i)}
                y={H - M.bottom + 16}
                textAnchor="middle"
                className="fill-foreground"
                fontSize={10}
                fontWeight={600}
              >
                {c.label}
              </text>
              <text
                x={x(i)}
                y={H - M.bottom + 30}
                textAnchor="middle"
                className="fill-muted-foreground"
                fontSize={9}
              >
                {c.sub}
              </text>
            </g>
          ))}

          {/* inactive lines */}
          {lines.map((l) =>
            l.driver === active ? null : (
              <g key={l.driver}>
                <path
                  d={path(l.points)}
                  fill="none"
                  stroke={colorOf(l.driver)}
                  strokeWidth={1.5}
                  strokeOpacity={active ? 0.18 : 0.5}
                  strokeLinejoin="round"
                />
                {/* fat invisible hit target */}
                <path
                  d={path(l.points)}
                  fill="none"
                  stroke="transparent"
                  strokeWidth={12}
                  onMouseEnter={() => setHover(l.driver)}
                  onMouseLeave={() => setHover(null)}
                  onClick={() => setPin((p) => (p === l.driver ? null : l.driver))}
                  style={{ cursor: "pointer" }}
                />
              </g>
            ),
          )}

          {/* active line on top */}
          {activeLine && (
            <g>
              <path
                d={path(activeLine.points)}
                fill="none"
                stroke={colorOf(activeLine.driver)}
                strokeWidth={2.75}
                strokeLinejoin="round"
              />
              {activeLine.points.map((p, i) => (
                <circle
                  key={i}
                  cx={x(p.x)}
                  cy={y(p.behind)}
                  r={3.5}
                  fill="var(--background)"
                  stroke={colorOf(activeLine.driver)}
                  strokeWidth={2}
                />
              ))}
              {(() => {
                const last = activeLine.points.at(-1)!;
                return (
                  <text
                    x={x(last.x) + 8}
                    y={y(last.behind) + 3}
                    className="fill-foreground"
                    fontSize={11}
                    fontWeight={600}
                  >
                    {lastName(activeLine.driver)}{" "}
                    <tspan className="fill-muted-foreground" fontWeight={400}>
                      {last.behind === 0 ? "Leader" : `-${last.behind}`} · P{last.rank}
                    </tspan>
                  </text>
                );
              })()}
            </g>
          )}
        </svg>
      </div>

      {/* legend / current order */}
      <div>
        <p className="mb-2 text-xs text-muted-foreground">
          {pin ? (
            <>
              Pinned <span className="text-foreground">{pin}</span> — click again to
              release.
            </>
          ) : (
            "Hover a line to trace one driver; click to pin. Colour = manufacturer."
          )}
        </p>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-3">
          {lines.map((l, i) => {
            const now = l.points.at(-1);
            return (
              <li key={l.driver}>
                <button
                  onMouseEnter={() => setHover(l.driver)}
                  onMouseLeave={() => setHover(null)}
                  onClick={() => setPin((p) => (p === l.driver ? null : l.driver))}
                  className={cn(
                    "flex w-full items-center gap-2 rounded px-1.5 py-1 text-left text-xs transition-colors",
                    active === l.driver ? "bg-muted" : "hover:bg-muted/50",
                  )}
                >
                  <span className="tabular w-4 text-right text-muted-foreground">
                    {i + 1}
                  </span>
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ background: colorOf(l.driver) }}
                  />
                  <span className="flex-1 truncate">{l.driver}</span>
                  <span className="tabular text-muted-foreground">
                    {now ? (now.behind === 0 ? "Leader" : `-${now.behind}`) : "—"}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
