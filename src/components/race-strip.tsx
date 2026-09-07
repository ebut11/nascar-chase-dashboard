import Link from "next/link";
import { cn } from "@/lib/utils";
import { fmtDate } from "@/lib/format";
import type { Race } from "@/lib/types";

export function RaceStrip({
  races,
  activeRound,
}: {
  races: Race[];
  activeRound?: number;
}) {
  return (
    <nav aria-label="Chase schedule" className="overflow-x-auto">
      <ol className="flex min-w-max gap-2 pb-1">
        {races.map((r) => {
          const active = r.chase_round === activeRound;
          const done = r.status === "completed";
          return (
            <li key={r.chase_round}>
              <Link
                href={`/races/${r.chase_round}`}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex w-36 flex-col gap-0.5 rounded-lg border px-3 py-2 transition-colors",
                  active
                    ? "border-speed/60 bg-speed/10"
                    : "border-border/70 bg-card hover:border-border",
                )}
              >
                <span className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Race {r.chase_round}</span>
                  <span
                    className={cn(
                      "rounded-sm px-1 text-[10px] uppercase tracking-wide",
                      done ? "bg-muted text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {done ? "Final" : "Upcoming"}
                  </span>
                </span>
                <span className="truncate text-sm font-medium">
                  {r.track
                    .replace(" Raceway", "")
                    .replace(" Motor Speedway", "")
                    .replace(" Superspeedway", "")
                    .replace(" Speedway", "")}
                </span>
                <span className="truncate text-[11px] text-muted-foreground">
                  {done && r.winner ? `W: ${r.winner}` : fmtDate(r.race_date)}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
