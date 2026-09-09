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

const W = 860;
const H = 440;
const M = { top: 18, right: 60, bottom: 44, left: 46 };
const PW = W - M.left - M.right;
const PH = H - M.top - M.bottom;
const GAP = 15; // min vertical spacing between end-of-line number chips

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

  const colorOf = (driver: string) => {
    const m = MANUFACTURER[driver];
    return m ? LINE_COLOR[m] : NEUTRAL_LINE;
  };

  const path = (pts: { x: number; behind: number }[]) =>
    pts.map((p, i) => `${i === 0 ? "M" : "L"}${x(p.x)},${y(p.behind)}`).join(" ");

  // end-of-line number chips, nudged apart so none overlap
  const endLabels = useMemo(() => {
    const items = lines
      .filter((l) => l.points.length > 0)
      .map((l) => {
        const p = l.points.at(-1)!;
        return {
          driver: l.driver,
          n: l.car_number,
          color: colorOf(l.driver),
          xEnd: x(p.x),
          yTrue: y(p.behind),
          yLabel: y(p.behind),
        };
      })
      .sort((a, b) => a.yTrue - b.yTrue);
    for (let i = 1; i < items.length; i++) {
      if (items[i].yLabel - items[i - 1].yLabel < GAP) {
        items[i].yLabel = items[i - 1].yLabel + GAP;
      }
    }
    const overflow = items.length
      ? items[items.length - 1].yLabel - (M.top + PH)
      : 0;
    if (overflow > 0) {
      for (let i = items.length - 1; i >= 0; i--) {
        items[i].yLabel -= overflow;
        if (i > 0 && items[i].yLabel - items[i - 1].yLabel < GAP) {
          items[i - 1].yLabel = items[i].yLabel - GAP;
        }
      }
    }
    return items;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lines, maxBehind, cpCount]);

  if (checkpoints.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border/70 bg-card p-10 text-center text-sm text-muted-foreground">
        Standings history appears here once the first race is scored.
      </div>
    );
  }

  const activeLine = lines.find((l) => l.driver === active);
  const chipX = M.left + PW + 6;

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-xl border border-border/70 bg-card p-3">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="min-w-[680px] w-full"
          role="img"
          aria-label="Chase points behind the leader, by race"
        >
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

          {/* lines */}
          {lines.map((l) => {
            const on = l.driver === active;
            return (
              <g key={l.driver}>
                <path
                  d={path(l.points)}
                  fill="none"
                  stroke={colorOf(l.driver)}
                  strokeWidth={on ? 2.75 : 1.5}
                  strokeOpacity={on ? 1 : active ? 0.2 : 0.55}
                  strokeLinejoin="round"
                />
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
            );
          })}

          {/* end-of-line number chips + connectors */}
          {endLabels.map((e) => {
            const on = e.driver === active;
            const w = String(e.n ?? "").length * 6.5 + 9;
            return (
              <g
                key={e.driver}
                opacity={active && !on ? 0.28 : 1}
                onMouseEnter={() => setHover(e.driver)}
                onMouseLeave={() => setHover(null)}
                onClick={() => setPin((p) => (p === e.driver ? null : e.driver))}
                style={{ cursor: "pointer" }}
              >
                <path
                  d={`M${e.xEnd},${e.yTrue} L${chipX - 3},${e.yLabel}`}
                  stroke={e.color}
                  strokeOpacity={0.55}
                  strokeWidth={1}
                  fill="none"
                />
                <circle cx={e.xEnd} cy={e.yTrue} r={on ? 3.5 : 2.5} fill={e.color} />
                <rect
                  x={chipX}
                  y={e.yLabel - 7}
                  width={w}
                  height={14}
                  rx={3}
                  fill={e.color}
                  stroke={on ? "var(--foreground)" : "none"}
                  strokeWidth={on ? 1.5 : 0}
                />
                <text
                  x={chipX + w / 2}
                  y={e.yLabel + 3}
                  textAnchor="middle"
                  fontSize={10}
                  fontWeight={700}
                  fill="#141414"
                >
                  {e.n ?? "?"}
                </text>
              </g>
            );
          })}

          {/* active driver name + points, anchored above the plot */}
          {activeLine &&
            (() => {
              const last = activeLine.points.at(-1)!;
              return (
                <text
                  x={M.left + 4}
                  y={M.top + 2}
                  className="fill-foreground"
                  fontSize={12}
                  fontWeight={700}
                >
                  {lastName(activeLine.driver)}{" "}
                  <tspan className="fill-muted-foreground" fontWeight={400}>
                    {last.behind === 0 ? "Leader" : `-${last.behind}`} · P{last.rank}
                  </tspan>
                </text>
              );
            })()}
        </svg>
      </div>

      <div>
        <p className="mb-2 text-xs text-muted-foreground">
          {pin ? (
            <>
              Pinned <span className="text-foreground">{pin}</span> — click again to
              release.
            </>
          ) : (
            "Hover a line or number to trace one driver; click to pin. Colour = manufacturer."
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
