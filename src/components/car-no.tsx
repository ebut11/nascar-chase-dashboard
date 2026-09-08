import { cn } from "@/lib/utils";

/** A driver's car number, formatted identically everywhere it appears. */
export function CarNo({
  n,
  className,
}: {
  n: number | null | undefined;
  className?: string;
}) {
  if (n === null || n === undefined) return null;
  return (
    <span className={cn("tabular font-mono text-xs text-muted-foreground", className)}>
      #{n}
    </span>
  );
}
