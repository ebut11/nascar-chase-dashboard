"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { CarNo } from "@/components/car-no";
import type { StandingRow } from "@/lib/types";

type Phase = "before" | "after";

function useTweenedNumber(target: number, ms = 550) {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);
  const startRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const from = fromRef.current;
    if (from === target) return;
    startRef.current = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - startRef.current) / ms);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(from + (target - from) * eased));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = target;
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      fromRef.current = target;
    };
  }, [target, ms]);

  return value;
}

function Row({
  row,
  other,
  maxBehind,
  phase,
}: {
  row: StandingRow;
  other: StandingRow | undefined;
  maxBehind: number;
  phase: Phase;
}) {
  const behind = phase === "before" ? row.behind_before : row.behind_after;
  const rank = phase === "before" ? row.rank_before : row.rank_after;
  const shown = useTweenedNumber(behind);

  // rank movement from the *other* phase into this one
  const otherRank = other ? (phase === "before" ? other.rank_after : other.rank_before) : rank;
  const rankDelta = phase === "after" ? (otherRank ?? rank) - rank : 0; // + = gained places

  const strength = maxBehind > 0 ? 1 - behind / maxBehind : 1;

  return (
    <li className="grid grid-cols-[1.75rem_1fr_auto] items-center gap-3 px-3 py-2">
      <span className="tabular text-right text-xs text-muted-foreground">{rank}</span>
      <span className="min-w-0">
        <span className="flex items-center gap-2">
          <span className="truncate text-sm">{row.driver}</span>
          <CarNo n={row.car_number} />
          {phase === "after" && rankDelta !== 0 && (
            <span
              className={cn(
                "inline-flex items-center text-[11px] tabular",
                rankDelta > 0 ? "text-emerald-400" : "text-rose-400",
              )}
            >
              {rankDelta > 0 ? (
                <ChevronUp className="size-3" />
              ) : (
                <ChevronDown className="size-3" />
              )}
              {Math.abs(rankDelta)}
            </span>
          )}
          {phase === "after" && rankDelta === 0 && (
            <Minus className="size-3 text-muted-foreground/50" />
          )}
        </span>
        <span className="mt-1 block h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <span
            className="block h-full rounded-full bg-speed/80 transition-[width] duration-500 ease-out"
            style={{ width: `${Math.max(4, strength * 100)}%` }}
          />
        </span>
      </span>
      <span
        className={cn(
          "tabular w-16 text-right text-sm font-semibold",
          behind === 0 ? "text-speed" : "text-foreground",
        )}
      >
        {behind === 0 ? "Leader" : `−${shown}`}
      </span>
    </li>
  );
}

export function StandingsSwing({
  raceName,
  rows,
  compact = false,
}: {
  raceName: string;
  rows: StandingRow[];
  compact?: boolean;
}) {
  const [phase, setPhase] = useState<Phase>("before");

  const sorted = [...rows].sort((a, b) =>
    phase === "before" ? a.rank_before - b.rank_before : a.rank_after - b.rank_after,
  );
  const byDriver = new Map(rows.map((r) => [r.driver, r]));
  const maxBehind = Math.max(
    ...rows.map((r) => (phase === "before" ? r.behind_before : r.behind_after)),
    1,
  );
  const shown = compact ? sorted.slice(0, 10) : sorted;

  return (
    <div className="rounded-xl border border-border/70 bg-card">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 p-3">
        <div>
          <h3 className="text-sm font-semibold">Chase points behind the leader</h3>
          <p className="text-xs text-muted-foreground">
            Watch the gap swing across {raceName}. Toggle to replay it.
          </p>
        </div>
        <div className="inline-flex rounded-lg border border-border/70 p-0.5 text-xs">
          {(["before", "after"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPhase(p)}
              aria-pressed={phase === p}
              className={cn(
                "rounded-md px-2.5 py-1 font-medium transition-colors",
                phase === p
                  ? "bg-speed text-black"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {p === "before" ? "Entering" : "After"}
            </button>
          ))}
        </div>
      </div>
      <ol className="divide-y divide-border/60">
        {shown.map((r) => (
          <Row
            key={r.driver}
            row={r}
            other={byDriver.get(r.driver)}
            maxBehind={maxBehind}
            phase={phase}
          />
        ))}
      </ol>
      {compact && sorted.length > shown.length && (
        <div className="border-t border-border/70 p-2 text-center text-[11px] text-muted-foreground">
          +{sorted.length - shown.length} more on the race page
        </div>
      )}
    </div>
  );
}
