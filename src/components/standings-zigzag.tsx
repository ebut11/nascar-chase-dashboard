"use client";

import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { MANUFACTURER, type Manufacturer } from "@/lib/manufacturers";
import { DRIVER_PHOTO } from "@/lib/driver-photos";
import { DRIVER_LINE_COLOR } from "@/lib/driver-line-colors";
import { ROSTER } from "@/lib/roster";
import type { StandingsLine, StandingsSeries } from "@/lib/data";

const PHOTO_BY_NAME = new Map(
  ROSTER.map((d) => [d.name, DRIVER_PHOTO[d.slug] as string | undefined]),
);
const DECAL_COLOR_BY_NAME = new Map(
  ROSTER.map((d) => [d.name, DRIVER_LINE_COLOR[d.slug] as string | undefined]),
);

const LINE_COLOR: Record<Manufacturer, string> = {
  Toyota: "#e2564a",
  Ford: "#4b9fe1",
  Chevrolet: "#e0b23c",
};
const NEUTRAL_LINE = "#8a8a8a";

const W = 1040;
const H = 580;
const M = { top: 20, right: 84, bottom: 46, left: 48 };
const PW = W - M.left - M.right;
const PH = H - M.top - M.bottom;
const IW = 34;
const IH = 24;
const GAP = IH + 3;
const PLAY_MS = 2600;

type Pt = { x: number; behind: number; rank: number };

function lastName(name: string) {
  const p = name.split(" ");
  return p.length > 1 ? p.slice(1).join(" ") : name;
}

/** driver position at continuous checkpoint index `hx` */
function at(points: Pt[], hx: number): Pt {
  if (hx <= points[0].x) return points[0];
  const last = points[points.length - 1];
  if (hx >= last.x) return last;
  for (let j = 0; j < points.length - 1; j++) {
    const a = points[j];
    const b = points[j + 1];
    if (hx >= a.x && hx <= b.x) {
      const f = (hx - a.x) / (b.x - a.x);
      return {
        x: hx,
        behind: a.behind + (b.behind - a.behind) * f,
        rank: f < 0.5 ? a.rank : b.rank,
      };
    }
  }
  return last;
}

export function StandingsZigZag({ series }: { series: StandingsSeries }) {
  const [hover, setHover] = useState<string | null>(null);
  const [pin, setPin] = useState<string | null>(null);
  const [t, setT] = useState(1); // playback progress 0..1
  const [playing, setPlaying] = useState(false);
  const raf = useRef<number | null>(null);
  const active = pin ?? hover;

  const { checkpoints, lines, maxBehind } = series;
  const cpCount = Math.max(checkpoints.length, 1);
  const hx = t * (cpCount - 1);

  useEffect(() => {
    if (!playing) return;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / PLAY_MS);
      setT(p);
      if (p < 1) raf.current = requestAnimationFrame(tick);
      else setPlaying(false);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [playing]);

  const x = (i: number) =>
    M.left + (cpCount === 1 ? PW / 2 : (i / (cpCount - 1)) * PW);
  const y = (behind: number) => M.top + (behind / (maxBehind * 1.08)) * PH;

  const yStep = maxBehind <= 40 ? 10 : maxBehind <= 120 ? 25 : 50;
  const yTicks: number[] = [0];
  for (let v = yStep; v <= maxBehind * 1.05; v += yStep) yTicks.push(v);

  const colorOf = (d: string) => {
    const decal = DECAL_COLOR_BY_NAME.get(d);
    if (decal) return decal;
    const m = MANUFACTURER[d];
    return m ? LINE_COLOR[m] : NEUTRAL_LINE;
  };

  // path drawn only up to the playhead
  const partialPath = (points: Pt[]) => {
    const solid = points.filter((p) => p.x <= hx + 1e-6);
    const tip = at(points, hx);
    const pts =
      solid.length === 0 || solid[solid.length - 1].x < hx - 1e-6
        ? [...solid, tip]
        : solid;
    return pts
      .map((p, i) => `${i === 0 ? "M" : "L"}${x(p.x)},${y(p.behind)}`)
      .join(" ");
  };

  if (checkpoints.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border/70 bg-card p-10 text-center text-sm text-muted-foreground">
        Standings history appears here once the first race is scored.
      </div>
    );
  }

  // decal positions at the current playhead, nudged apart
  const heads = lines
    .filter((l) => l.points.length > 0)
    .map((l) => {
      const h = at(l.points as Pt[], hx);
      return {
        driver: l.driver,
        n: l.car_number,
        color: colorOf(l.driver),
        xEnd: x(h.x),
        yTrue: y(h.behind),
        yLabel: y(h.behind),
        behind: Math.round(h.behind),
        rank: h.rank,
      };
    })
    .sort((a, b) => a.yTrue - b.yTrue);
  for (let i = 1; i < heads.length; i++) {
    if (heads[i].yLabel - heads[i - 1].yLabel < GAP)
      heads[i].yLabel = heads[i - 1].yLabel + GAP;
  }
  const overflow = heads.length
    ? heads[heads.length - 1].yLabel - (M.top + PH)
    : 0;
  if (overflow > 0) {
    for (let i = heads.length - 1; i >= 0; i--) {
      heads[i].yLabel -= overflow;
      if (i > 0 && heads[i].yLabel - heads[i - 1].yLabel < GAP)
        heads[i - 1].yLabel = heads[i].yLabel - GAP;
    }
  }

  const activeLine = lines.find((l) => l.driver === active) as
    | StandingsLine
    | undefined;
  const activeHead = activeLine
    ? at(activeLine.points as Pt[], hx)
    : null;
  const chipX = M.left + PW + 6;
  const headX = x(hx);
  const midPlay = t < 0.999;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => {
            setT(0);
            setPlaying(true);
          }}
          className="inline-flex items-center gap-1.5 rounded-lg bg-speed px-3 py-1.5 text-xs font-medium text-black transition-opacity hover:opacity-90"
        >
          <Play className="size-3.5" />
          {t === 0 || midPlay ? "Playing…" : "Replay from seeding"}
        </button>
        <input
          type="range"
          min={0}
          max={1000}
          value={Math.round(t * 1000)}
          onChange={(e) => {
            setPlaying(false);
            setT(Number(e.target.value) / 1000);
          }}
          className="h-1 flex-1 min-w-[140px] accent-[var(--speed)]"
          aria-label="Scrub the season"
        />
        <span className="tabular text-xs text-muted-foreground">
          {midPlay
            ? checkpoints[Math.round(hx)]?.label ?? ""
            : checkpoints.at(-1)?.label}
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border/70 bg-card p-3">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="min-w-[760px] w-full"
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

          {midPlay && (
            <line
              x1={headX}
              x2={headX}
              y1={M.top}
              y2={M.top + PH}
              stroke="var(--speed)"
              strokeOpacity={0.4}
              strokeWidth={1}
              strokeDasharray="3 3"
            />
          )}

          {lines.map((l) => {
            const on = l.driver === active;
            return (
              <g key={l.driver}>
                <path
                  d={partialPath(l.points as Pt[])}
                  fill="none"
                  stroke={colorOf(l.driver)}
                  strokeWidth={on ? 2.75 : 1.5}
                  strokeOpacity={on ? 1 : active ? 0.2 : 0.55}
                  strokeLinejoin="round"
                />
                <path
                  d={partialPath(l.points as Pt[])}
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

          {heads.map((e) => {
            const on = e.driver === active;
            const photo = PHOTO_BY_NAME.get(e.driver);
            const w = String(e.n ?? "").length * 6.5 + 9;
            return (
              <g
                key={e.driver}
                opacity={active && !on ? 0.25 : 1}
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
                <circle cx={e.xEnd} cy={e.yTrue} r={on ? 4 : 2.5} fill={e.color} />
                {photo ? (
                  <g>
                    <rect
                      x={chipX}
                      y={e.yLabel - IH / 2}
                      width={IW}
                      height={IH}
                      rx={3}
                      fill="var(--card)"
                    />
                    <image
                      href={photo}
                      x={chipX}
                      y={e.yLabel - IH / 2}
                      width={IW}
                      height={IH}
                      preserveAspectRatio="xMidYMid meet"
                    />
                    <rect
                      x={chipX}
                      y={e.yLabel - IH / 2}
                      width={IW}
                      height={IH}
                      rx={3}
                      fill="none"
                      stroke={on ? "var(--foreground)" : e.color}
                      strokeOpacity={on ? 1 : 0.6}
                      strokeWidth={on ? 1.75 : 1}
                    />
                  </g>
                ) : (
                  <>
                    <rect
                      x={chipX}
                      y={e.yLabel - 8}
                      width={w}
                      height={16}
                      rx={3}
                      fill={e.color}
                    />
                    <text
                      x={chipX + w / 2}
                      y={e.yLabel + 3.5}
                      textAnchor="middle"
                      fontSize={10}
                      fontWeight={700}
                      fill="#141414"
                    >
                      {e.n ?? "?"}
                    </text>
                  </>
                )}
              </g>
            );
          })}

          {activeLine && activeHead && (
            <text
              x={M.left + 4}
              y={M.top - 4}
              className="fill-foreground"
              fontSize={12}
              fontWeight={700}
            >
              {lastName(activeLine.driver)}{" "}
              <tspan className="fill-muted-foreground" fontWeight={400}>
                {Math.round(activeHead.behind) === 0
                  ? "Leader"
                  : `-${Math.round(activeHead.behind)}`}{" "}
                · P{activeHead.rank}
              </tspan>
            </text>
          )}
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
