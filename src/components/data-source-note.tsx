import { Database, HardDrive } from "lucide-react";

/** Tells the viewer whether the page is live off Supabase or the bundled snapshot. */
export function DataSourceNote({ source }: { source: "supabase" | "bundled" }) {
  if (source === "supabase") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
        <Database className="size-3.5 text-basic" />
        Live from Supabase
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
      <HardDrive className="size-3.5" />
      Bundled snapshot — set Supabase env vars for live data
    </span>
  );
}
