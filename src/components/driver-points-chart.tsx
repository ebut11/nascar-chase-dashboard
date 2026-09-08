"use client";

import { useState } from "react";
import type { StandingsCheckpoint, StandingsLine } from "@/lib/data";

const W = 720;
const H = 260;
const M = { top: 16, right: 24, bottom: 40, left: 48 };
const PW = W - M.left - M.right;
const PH = H - M.top - M.bottom;

export function DriverPointsChart({
  checkpoints,
  line,
  color,
}: {
  checkpoints: StandingsCheckpoint[];
  line: StandingsLine | null;
  color: string;
}) {
  const [hi, setHi] = useState<number | null>(null);

  if (!line || line.points.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border/70 bg-card p-8 text-center text-sm text-muted-foreground">
        No points history yet — this fills in as races are scored.
      </div>
    );
  }

  const maxBehind = Math.max(...line.points.map((p) => p.behind), 1);
  const n = checkpoints.length;
  const x = (i: number) => M.left + (n <= 1 ? PW / 2 : (i / (n - 1)) * PW);
  const y = (b: number) => M.top + (b / (maxBehind * 1.1)) * PH;

  const step = maxBehind <= 40 ? 10 : maxBehind <= 120 ? 25 : 50;
  const ticks = [0];
  for (let v = step; v <= maxBehind * 1.05; v += step) ticks.push(v);

  const d = line.points
    .map((p, i) => `${i === 0 ? "M" : "L"}${x(p.x)},${y(p.behind)}`)
    .join(" ");

  return (
    <div className="overflow-x-auto rounded-xl border border-border/70 bg-card p-3">
      <svg viewBox={`0 0 ${W} ${H}`} className="min-w-[520px] w-full" role="img" aria-label={`${line.driver} points behind leader by race`}>
        {ticks.map((v) => (
          <g key={v}>
            <line x1={M.left} x2={M.left + PW} y1={y(v)} y2={y(v)} stroke="var(--track-line)" strokeWidth={1} />
            <text x={M.left - 8} y={y(v) + 3} textAnchor="end" className="fill-muted-foreground" fontSize={10}>
              {v === 0 ? "Leader" : `-${v}`}
            </text>
          </g>
        ))}
        {checkpoints.map((c, i) => (
          <g key={i}>
            <text x={x(i)} y={H - M.bottom + 16} textAnchor="middle" className="fill-foreground" fontSize={10} fontWeight={600}>
              {c.label}
            </text>
            <text x={x(i)} y={H - M.bottom + 29} textAnchor="middle" className="fill-muted-foreground" fontSize={9}>
              {c.sub}
            </text>
          </g>
        ))}

        <path d={d} fill="none" stroke={color} strokeWidth={2.5} strokeLinejoin="round" />
        {line.points.map((p, i) => (
          <g key={i}>
            <circle
              cx={x(p.x)}
              cy={y(p.behind)}
              r={hi === i ? 6 : 4}
              fill="var(--card)"
              stroke={color}
              strokeWidth={2}
              onMouseEnter={() => setHi(i)}
              onMouseLeave={() => setHi(null)}
              style={{ cursor: "pointer" }}
            />
            {hi === i && (
              <text x={x(p.x)} y={y(p.behind) - 12} textAnchor="middle" className="fill-foreground" fontSize={11} fontWeight={600}>
                {p.behind === 0 ? "Leader" : `-${p.behind}`} · P{p.rank}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}
