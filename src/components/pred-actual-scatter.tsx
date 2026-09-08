"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { DriverRaceRow } from "@/lib/types";

const W = 760;
const H = 440;
const M = { top: 16, right: 16, bottom: 40, left: 44 };
const PW = W - M.left - M.right;
const PH = H - M.top - M.bottom;

const BASIC = "#3987e5";
const ADVANCED = "#d95926";

type Model = "basic" | "advanced" | "both";

export function PredActualScatter({ rows }: { rows: DriverRaceRow[] }) {
  const [show, setShow] = useState<Model>("both");
  const [hover, setHover] = useState<{ driver: string; model: "basic" | "advanced" } | null>(null);

  const pts = rows.filter((r) => r.actual != null && (r.basic != null || r.advanced != null));
  if (pts.length === 0) return null;

  const maxV =
    Math.ceil(
      Math.max(
        ...pts.flatMap((r) => [r.actual ?? 0, r.basic ?? 0, r.advanced ?? 0]),
      ) / 5,
    ) * 5 || 40;

  // 1 (best) at the top-left origin corner
  const x = (v: number) => M.left + ((v - 1) / (maxV - 1)) * PW;
  const y = (v: number) => M.top + ((v - 1) / (maxV - 1)) * PH;

  const ticks: number[] = [1];
  for (let v = 5; v <= maxV; v += 5) ticks.push(v);

  const ALL_SERIES: {
    model: "basic" | "advanced";
    color: string;
    get: (r: DriverRaceRow) => number | null;
  }[] = [
    { model: "basic", color: BASIC, get: (r) => r.basic },
    { model: "advanced", color: ADVANCED, get: (r) => r.advanced },
  ];
  const series = ALL_SERIES.filter((s) => show === "both" || show === s.model);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="max-w-md text-sm text-muted-foreground">
          Each dot is one driver: projected finish across, actual finish down. On
          the diagonal = perfect call. Below-left of it = the driver ran better
          than projected.
        </p>
        <div className="inline-flex rounded-lg border border-border/70 p-0.5 text-xs">
          {(["both", "basic", "advanced"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setShow(m)}
              aria-pressed={show === m}
              className={cn(
                "rounded-md px-2.5 py-1 font-medium capitalize transition-colors",
                show === m ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border/70 bg-card p-3">
        <svg viewBox={`0 0 ${W} ${H}`} className="min-w-[560px] w-full" role="img" aria-label="Predicted versus actual finish">
          {ticks.map((t) => (
            <g key={t}>
              <line x1={x(t)} x2={x(t)} y1={M.top} y2={M.top + PH} stroke="var(--track-line)" strokeWidth={1} />
              <line x1={M.left} x2={M.left + PW} y1={y(t)} y2={y(t)} stroke="var(--track-line)" strokeWidth={1} />
              <text x={x(t)} y={H - M.bottom + 16} textAnchor="middle" className="fill-muted-foreground" fontSize={10}>{t}</text>
              <text x={M.left - 8} y={y(t) + 3} textAnchor="end" className="fill-muted-foreground" fontSize={10}>{t}</text>
            </g>
          ))}
          <text x={M.left + PW / 2} y={H - 6} textAnchor="middle" className="fill-muted-foreground" fontSize={10}>
            Projected finish
          </text>
          <text x={12} y={M.top + PH / 2} textAnchor="middle" fontSize={10} className="fill-muted-foreground" transform={`rotate(-90 12 ${M.top + PH / 2})`}>
            Actual finish
          </text>

          {/* perfect-prediction diagonal */}
          <line x1={x(1)} y1={y(1)} x2={x(maxV)} y2={y(maxV)} stroke="var(--foreground)" strokeOpacity={0.25} strokeDasharray="4 4" strokeWidth={1} />

          {series.map((s) =>
            pts.map((r) => {
              const pv = s.get(r);
              if (pv == null || r.actual == null) return null;
              const on = hover?.driver === r.driver && hover.model === s.model;
              return (
                <circle
                  key={`${s.model}-${r.driver}`}
                  cx={x(pv)}
                  cy={y(r.actual)}
                  r={on ? 6 : 4}
                  fill={s.color}
                  fillOpacity={hover && !on ? 0.35 : 0.85}
                  stroke="var(--card)"
                  strokeWidth={1}
                  onMouseEnter={() => setHover({ driver: r.driver, model: s.model })}
                  onMouseLeave={() => setHover(null)}
                  style={{ cursor: "pointer" }}
                />
              );
            }),
          )}

          {hover &&
            (() => {
              const r = pts.find((p) => p.driver === hover.driver)!;
              const pv = hover.model === "basic" ? r.basic! : r.advanced!;
              const tx = x(pv);
              const ty = y(r.actual!);
              const left = tx > M.left + PW - 130;
              return (
                <g transform={`translate(${left ? tx - 132 : tx + 10}, ${ty - 10})`}>
                  <rect width={124} height={40} rx={4} fill="var(--popover)" stroke="var(--border)" />
                  <text x={8} y={16} fontSize={11} className="fill-foreground" fontWeight={600}>
                    {r.driver}
                  </text>
                  <text x={8} y={31} fontSize={10} className="fill-muted-foreground">
                    {hover.model} P{pv.toFixed(1)} → finished {r.actual}
                  </text>
                </g>
              );
            })()}
        </svg>
      </div>

      {show === "both" && (
        <div className="flex gap-4 text-xs">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-full" style={{ background: BASIC }} /> Basic
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-full" style={{ background: ADVANCED }} /> Advanced
          </span>
        </div>
      )}
    </div>
  );
}
