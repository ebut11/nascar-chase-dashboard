"use client";

import type { CumulativeMaePoint } from "@/lib/data";

const W = 720;
const H = 260;
const M = { top: 16, right: 88, bottom: 36, left: 40 };
const PW = W - M.left - M.right;
const PH = H - M.top - M.bottom;

const BASIC = "#3987e5";
const ADVANCED = "#d95926";

export function CumulativeMae({ points }: { points: CumulativeMaePoint[] }) {
  if (points.length === 0) return null;

  const vals = points.flatMap((p) => [p.basic, p.advanced].filter((v): v is number => v != null));
  const maxV = Math.max(...vals, 1) * 1.2;
  const n = points.length;

  const x = (i: number) => M.left + (n === 1 ? PW / 2 : (i / (n - 1)) * PW);
  const y = (v: number) => M.top + PH - (v / maxV) * PH;

  const line = (get: (p: CumulativeMaePoint) => number | null) => {
    const seg = points
      .map((p, i) => ({ i, v: get(p) }))
      .filter((d): d is { i: number; v: number } => d.v != null);
    return seg.map((d, k) => `${k === 0 ? "M" : "L"}${x(d.i)},${y(d.v)}`).join(" ");
  };

  const series = [
    { label: "Basic", color: BASIC, get: (p: CumulativeMaePoint) => p.basic },
    { label: "Advanced", color: ADVANCED, get: (p: CumulativeMaePoint) => p.advanced },
  ];

  return (
    <div className="overflow-x-auto rounded-xl border border-border/70 bg-card p-3">
      <svg viewBox={`0 0 ${W} ${H}`} className="min-w-[520px] w-full" role="img" aria-label="Cumulative mean absolute error by race">
        {[0, maxV / 2, maxV].map((v) => (
          <g key={v}>
            <line x1={M.left} x2={M.left + PW} y1={y(v)} y2={y(v)} stroke="var(--track-line)" strokeWidth={1} />
            <text x={M.left - 6} y={y(v) + 3} textAnchor="end" className="fill-muted-foreground" fontSize={10}>
              {v.toFixed(1)}
            </text>
          </g>
        ))}
        {points.map((p, i) => (
          <text key={i} x={x(i)} y={H - M.bottom + 16} textAnchor="middle" className="fill-muted-foreground" fontSize={10}>
            {p.label}
          </text>
        ))}

        {series.map((s) => {
          const last = [...points].map((p, i) => ({ i, v: s.get(p) })).reverse().find((d) => d.v != null);
          return (
            <g key={s.label}>
              <path d={line(s.get)} fill="none" stroke={s.color} strokeWidth={2} strokeLinejoin="round" />
              {points.map((p, i) => {
                const v = s.get(p);
                return v == null ? null : (
                  <circle key={i} cx={x(i)} cy={y(v)} r={n === 1 ? 4 : 3} fill={s.color} stroke="var(--card)" strokeWidth={1} />
                );
              })}
              {last && (
                <text x={x(last.i) + 8} y={y(last.v!) + 3} fontSize={11} fontWeight={600} fill={s.color}>
                  {s.label} {last.v!.toFixed(2)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
