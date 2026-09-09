"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { MANUFACTURER, type Manufacturer } from "@/lib/manufacturers";
import { DRIVER_PHOTO } from "@/lib/driver-photos";
import { DRIVER_LINE_COLOR } from "@/lib/driver-line-colors";
import { ROSTER } from "@/lib/roster";
import type { SeasonStandLine, SeasonStandSeries } from "@/lib/season-standings";

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

// big canvas — has to hold 35 driver chips stacked down the right edge
const W = 1220;
const H = 880;
const M = { top: 24, right: 108, bottom: 56, left: 54 };
const PW = W - M.left - M.right;
const PH = H - M.top - M.bottom;
const IW = 32;
const IH = 20;
const GAP = IH + 1.5;
const PLAY_MS = 4200;

type Mode = "behind" | "pos";
type Pt = { x: number; cum: number; behind: number; rank: number; pos: number };

function lastName(name: string) {
  const p = name.split(" ");
  return p.length > 1 ? p.slice(1).join(" ") : name;
}

/** driver state at continuous checkpoint index `hx` */
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
        cum: a.cum + (b.cum - a.cum) * f,
        behind: a.behind + (b.behind - a.behind) * f,
        rank: f < 0.5 ? a.rank : b.rank,
        pos: f < 0.5 ? a.pos : b.pos,
      };
    }
  }
  return last;
}

export function SeasonStandingsChart({ series }: { series: SeasonStandSeries }) {
  const [hover, setHover] = useState<string | null>(null);
  const [pin, setPin] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("behind");
  const [t, setT] = useState(1); // playback progress 0..1
  const [playing, setPlaying] = useState(false);
  const raf = useRef<number | null>(null);
  const active = pin ?? hover;

  const { checkpoints, lines, maxBehind } = series;
  const cpCount = Math.max(checkpoints.length, 1);
  const hx = t * (cpCount - 1);
  const nPos = lines.length;

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
  const y = (p: { behind: number; pos: number }) =>
    mode === "behind"
      ? M.top + (p.behind / (maxBehind * 1.06)) * PH
      : M.top + ((p.pos - 1) / Math.max(1, nPos - 1)) * PH;

  const yStep = maxBehind <= 120 ? 25 : maxBehind <= 300 ? 50 : 100;
  const behindTicks: number[] = [0];
  for (let v = yStep; v <= maxBehind * 1.03; v += yStep) behindTicks.push(v);
  const posTicks = [1, 5, 10, 15, 20, 25, 30, 35].filter((v) => v <= nPos);

  const colorOf = (d: string) => {
    const decal = DECAL_COLOR_BY_NAME.get(d);
    if (decal) return decal;
    const m = MANUFACTURER[d];
    return m ? LINE_COLOR[m] : NEUTRAL_LINE;
  };

  const partialPath = (points: Pt[]) => {
    const solid = points.filter((p) => p.x <= hx + 1e-6);
    const tip = at(points, hx);
    const pts =
      solid.length === 0 || solid[solid.length - 1].x < hx - 1e-6
        ? [...solid, tip]
        : solid;
    return pts
      .map((p, i) => `${i === 0 ? "M" : "L"}${x(p.x)},${y(p)}`)
      .join(" ");
  };

  // decal chips at the playhead, de-collided down the right edge
  const heads = useMemo(() => {
    const hs = lines
      .filter((l) => l.points.length > 0)
      .map((l) => {
        const h = at(l.points as Pt[], hx);
        return {
          driver: l.driver,
          n: l.car_number,
          color: colorOf(l.driver),
          xEnd: x(h.x),
          yTrue: y(h),
          yLabel: y(h),
          behind: Math.round(h.behind),
          rank: h.rank,
          pos: h.pos,
        };
      })
      .sort((a, b) => a.yTrue - b.yTrue);
    for (let i = 1; i < hs.length; i++) {
      if (hs[i].yLabel - hs[i - 1].yLabel < GAP)
        hs[i].yLabel = hs[i - 1].yLabel + GAP;
    }
    const overflow = hs.length ? hs[hs.length - 1].yLabel - (M.top + PH) : 0;
    if (overflow > 0) {
      for (let i = hs.length - 1; i >= 0; i--) {
        hs[i].yLabel -= overflow;
        if (i > 0 && hs[i].yLabel - hs[i - 1].yLabel < GAP)
          hs[i - 1].yLabel = hs[i].yLabel - GAP;
      }
    }
    return hs;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lines, hx, mode, maxBehind]);

  if (checkpoints.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border/70 bg-card p-10 text-center text-sm text-muted-foreground">
        Standings history appears here once the first race is scored.
      </div>
    );
  }

  const activeLine = lines.find((l) => l.driver === active) as
    | SeasonStandLine
    | undefined;
  const activeHead = activeLine ? at(activeLine.points as Pt[], hx) : null;
  const chipX = M.left + PW + 6;
  const headX = x(hx);
  const midPlay = t < 0.999;
  const nowCp = midPlay ? checkpoints[Math.round(hx)] : checkpoints.at(-1);
  const xTickEvery = cpCount > 20 ? 3 : 2;

  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      {/* control rail — stays put while the tall chart scrolls */}
      <div className="lg:w-52 lg:shrink-0">
        <div className="space-y-3 lg:sticky lg:top-4">
          <button
            onClick={() => {
              setT(0);
              setPlaying(true);
            }}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-speed px-3 py-2 text-xs font-medium text-black transition-opacity hover:opacity-90"
          >
            <Play className="size-3.5" />
            {midPlay ? "Playing…" : t === 0 ? "Play season" : "Replay season"}
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
            className="h-1 w-full accent-[var(--speed)]"
            aria-label="Scrub the season"
          />

          <div className="rounded-lg border border-border/70 bg-card px-3 py-2">
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
              {midPlay ? "Through" : "Final · after"}
            </div>
            <div className="tabular text-sm font-semibold">
              {nowCp?.label} · {nowCp?.sub}
            </div>
          </div>

          <div className="inline-flex w-full rounded-lg border border-border/70 p-0.5 text-xs">
            {(["behind", "pos"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                aria-pressed={mode === m}
                className={cn(
                  "flex-1 rounded-md px-2 py-1 font-medium transition-colors",
                  mode === m
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {m === "behind" ? "Behind leader" : "Position"}
              </button>
            ))}
          </div>

          <p className="text-[11px] leading-snug text-muted-foreground">
            {pin ? (
              <>
                Pinned <span className="text-foreground">{pin}</span> — click again
                to release.
              </>
            ) : (
              "Every full-time driver, all 27 points races. Hover a line or number to trace one; click to pin. Colour = number decal."
            )}
          </p>
        </div>
      </div>

      {/* chart */}
      <div className="min-w-0 flex-1 overflow-x-auto rounded-xl border border-border/70 bg-card p-3">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full min-w-[900px]"
          role="img"
          aria-label="Season points standings for every full-time driver, race by race"
        >
          {(mode === "behind" ? behindTicks : posTicks).map((v) => {
            const yy =
              mode === "behind"
                ? M.top + (v / (maxBehind * 1.06)) * PH
                : M.top + ((v - 1) / Math.max(1, nPos - 1)) * PH;
            return (
              <g key={v}>
                <line
                  x1={M.left}
                  x2={M.left + PW}
                  y1={yy}
                  y2={yy}
                  stroke="var(--track-line)"
                  strokeWidth={1}
                />
                <text
                  x={M.left - 8}
                  y={yy + 3}
                  textAnchor="end"
                  className="fill-muted-foreground"
                  fontSize={10}
                >
                  {mode === "behind"
                    ? v === 0
                      ? "Leader"
                      : `-${v}`
                    : `P${v}`}
                </text>
              </g>
            );
          })}

          {checkpoints.map((c, i) => {
            const show = i % xTickEvery === 0 || i === cpCount - 1;
            return (
              <g key={i}>
                {show && (
                  <line
                    x1={x(i)}
                    x2={x(i)}
                    y1={M.top}
                    y2={M.top + PH}
                    stroke="var(--track-line)"
                    strokeOpacity={0.35}
                    strokeWidth={1}
                  />
                )}
                <text
                  x={x(i)}
                  y={H - M.bottom + 15}
                  textAnchor="middle"
                  className="fill-foreground"
                  fontSize={9}
                  fontWeight={600}
                >
                  {c.label}
                </text>
                {show && (
                  <text
                    x={x(i)}
                    y={H - M.bottom + 28}
                    textAnchor="middle"
                    className="fill-muted-foreground"
                    fontSize={8.5}
                  >
                    {c.sub}
                  </text>
                )}
              </g>
            );
          })}

          {midPlay && (
            <line
              x1={headX}
              x2={headX}
              y1={M.top}
              y2={M.top + PH}
              stroke="var(--speed)"
              strokeOpacity={0.45}
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
                  strokeWidth={on ? 2.75 : 1.4}
                  strokeOpacity={on ? 1 : active ? 0.16 : 0.5}
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
                opacity={active && !on ? 0.22 : 1}
                onMouseEnter={() => setHover(e.driver)}
                onMouseLeave={() => setHover(null)}
                onClick={() => setPin((p) => (p === e.driver ? null : e.driver))}
                style={{ cursor: "pointer" }}
              >
                <path
                  d={`M${e.xEnd},${e.yTrue} L${chipX - 3},${e.yLabel}`}
                  stroke={e.color}
                  strokeOpacity={0.5}
                  strokeWidth={1}
                  fill="none"
                />
                <circle cx={e.xEnd} cy={e.yTrue} r={on ? 4 : 2.4} fill={e.color} />
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
              y={M.top - 6}
              className="fill-foreground"
              fontSize={12}
              fontWeight={700}
            >
              {lastName(activeLine.driver)}{" "}
              <tspan className="fill-muted-foreground" fontWeight={400}>
                P{activeHead.rank} ·{" "}
                {Math.round(activeHead.behind) === 0
                  ? "leader"
                  : `-${Math.round(activeHead.behind)}`}{" "}
                · {Math.round(activeHead.cum)} pts
              </tspan>
            </text>
          )}
        </svg>
      </div>
    </div>
  );
}
