import type { Metadata } from "next";
import Link from "next/link";
import { DriverAvatar } from "@/components/driver-avatar";
import { ROSTER } from "@/lib/roster";

export const metadata: Metadata = {
  title: "Drivers — The Model Duel",
  description: "Every 2026 Cup Series full-time driver. Pick one for their season so far.",
};

export default function DriversPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          <span className="h-px w-6 bg-speed" />
          Field
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Drivers</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          All {ROSTER.length} full-time Cup entries for 2026. Pick a driver for
          their season stats and how their points have moved through the year.
          The <span className="text-speed">gold ring</span> marks a Chase driver.
        </p>
      </header>

      <ul className="grid grid-cols-3 gap-x-4 gap-y-6 sm:grid-cols-4 md:grid-cols-6">
        {ROSTER.map((d) => (
          <li key={d.slug}>
            <Link
              href={`/drivers/${d.slug}`}
              className="group flex flex-col items-center gap-2 text-center"
            >
              <span
                className={
                  "rounded-full p-[3px] transition-transform group-hover:scale-105 " +
                  (d.chase ? "bg-speed/70" : "bg-transparent")
                }
              >
                <DriverAvatar
                  name={d.name}
                  slug={d.slug}
                  manufacturer={d.manufacturer}
                  size={64}
                  className="ring-2 ring-background"
                />
              </span>
              <span className="text-xs font-medium leading-tight group-hover:text-speed">
                {d.name}
              </span>
              <span className="tabular -mt-1 text-[11px] text-muted-foreground">
                #{d.number} · {d.team.split(" ")[0]}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
