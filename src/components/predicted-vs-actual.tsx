"use client";

import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { CarNo } from "@/components/car-no";
import { errorBucket } from "@/lib/format";
import type { DriverRaceRow } from "@/lib/types";

type SortKey = "actual" | "driver" | "basic" | "advanced" | "basic_error" | "advanced_error" | "laps_led";

const BUCKET_CLASS: Record<string, string> = {
  great: "text-emerald-400",
  ok: "text-foreground",
  off: "text-amber-400",
  bad: "text-rose-400",
  none: "text-muted-foreground",
};

function ErrCell({ err }: { err: number | null }) {
  const bucket = errorBucket(err);
  return (
    <span className={cn("tabular", BUCKET_CLASS[bucket])}>
      {err === null ? "—" : `±${err.toFixed(1)}`}
    </span>
  );
}

export function PredictedVsActual({ rows }: { rows: DriverRaceRow[] }) {
  const [sort, setSort] = useState<SortKey>("actual");
  const [dir, setDir] = useState<1 | -1>(1);
  const [chaseOnly, setChaseOnly] = useState(false);

  const sorted = useMemo(() => {
    const base = chaseOnly ? rows.filter((r) => r.is_chase_driver) : rows;
    const val = (r: DriverRaceRow): number | string => {
      switch (sort) {
        case "driver":
          return r.driver;
        default:
          return (r[sort] as number | null) ?? 999;
      }
    };
    return [...base].sort((a, b) => {
      const av = val(a);
      const bv = val(b);
      if (typeof av === "string" && typeof bv === "string") return av.localeCompare(bv) * dir;
      return ((av as number) - (bv as number)) * dir;
    });
  }, [rows, sort, dir, chaseOnly]);

  const clickSort = (key: SortKey) => {
    if (key === sort) {
      setDir((d) => (d === 1 ? -1 : 1));
    } else {
      setSort(key);
      setDir(key === "driver" ? 1 : 1);
    }
  };

  const Icon = ({ col }: { col: SortKey }) =>
    col !== sort ? (
      <ArrowUpDown className="size-3 opacity-40" />
    ) : dir === 1 ? (
      <ArrowUp className="size-3" />
    ) : (
      <ArrowDown className="size-3" />
    );

  const Th = ({
    col,
    children,
    className,
  }: {
    col: SortKey;
    children: React.ReactNode;
    className?: string;
  }) => (
    <TableHead className={className}>
      <button
        onClick={() => clickSort(col)}
        className="inline-flex items-center gap-1 text-xs font-medium hover:text-foreground"
      >
        {children}
        <Icon col={col} />
      </button>
    </TableHead>
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <label className="inline-flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={chaseOnly}
            onChange={(e) => setChaseOnly(e.target.checked)}
            className="size-3.5 accent-[var(--speed)]"
          />
          Chase drivers only
        </label>
        <span className="ml-auto flex items-center gap-3">
          <span className="inline-flex items-center gap-1"><span className="size-2 rounded-full bg-emerald-400" />≤3</span>
          <span className="inline-flex items-center gap-1"><span className="size-2 rounded-full bg-amber-400" />7–12</span>
          <span className="inline-flex items-center gap-1"><span className="size-2 rounded-full bg-rose-400" />&gt;12</span>
        </span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border/70">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <Th col="actual" className="w-14">Fin</Th>
              <Th col="driver">Driver</Th>
              <Th col="basic" className="text-right">Basic</Th>
              <Th col="basic_error" className="text-right">Δ</Th>
              <Th col="advanced" className="text-right">Adv</Th>
              <Th col="advanced_error" className="text-right">Δ</Th>
              <Th col="laps_led" className="text-right">Led</Th>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((r) => {
              const better =
                r.basic_error != null && r.advanced_error != null
                  ? r.basic_error < r.advanced_error
                    ? "basic"
                    : r.advanced_error < r.basic_error
                      ? "advanced"
                      : null
                  : null;
              return (
                <TableRow key={r.driver} className="text-sm">
                  <TableCell className="tabular font-medium">
                    {r.actual ?? "—"}
                    {r.status && r.status !== "Running" && (
                      <span className="ml-1 rounded bg-rose-500/15 px-1 text-[10px] uppercase text-rose-400">
                        {r.status}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center gap-2">
                      {r.is_chase_driver && (
                        <span
                          title="Chase driver"
                          className="size-1.5 rounded-full bg-speed"
                          aria-hidden
                        />
                      )}
                      <span className="truncate">{r.driver}</span>
                      <CarNo n={r.car_number} />
                    </span>
                  </TableCell>
                  <TableCell
                    className={cn(
                      "tabular text-right",
                      better === "basic" && "font-semibold text-basic",
                    )}
                  >
                    {r.basic?.toFixed(1) ?? "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <ErrCell err={r.basic_error} />
                  </TableCell>
                  <TableCell
                    className={cn(
                      "tabular text-right",
                      better === "advanced" && "font-semibold text-advanced",
                    )}
                  >
                    {r.advanced?.toFixed(1) ?? "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <ErrCell err={r.advanced_error} />
                  </TableCell>
                  <TableCell className="tabular text-right text-muted-foreground">
                    {r.laps_led ?? 0}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
