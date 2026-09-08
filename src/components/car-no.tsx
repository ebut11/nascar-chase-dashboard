import { cn } from "@/lib/utils";
import { MANUFACTURER, MFR_PLATE } from "@/lib/manufacturers";

const NEUTRAL = { bg: "#2a2a2a", fg: "#ffffff", ring: "rgba(255,255,255,0.25)" };

/**
 * A driver's car number as a door-panel decal: bold leaned racing numerals on a
 * manufacturer-coloured plate (Toyota red, Ford blue, Chevrolet gold). Formatted
 * identically everywhere a driver is listed.
 */
export function CarNo({
  n,
  driver,
  className,
}: {
  n: number | null | undefined;
  driver?: string | null;
  className?: string;
}) {
  if (n === null || n === undefined) return null;
  const mfr = driver ? MANUFACTURER[driver] : undefined;
  const c = mfr ? MFR_PLATE[mfr] : NEUTRAL;

  return (
    <span
      title={mfr ? `#${n} · ${mfr}` : `#${n}`}
      className={cn(
        "inline-flex h-[18px] shrink-0 items-center justify-center rounded-[3px] px-[5px] align-middle shadow-sm",
        className,
      )}
      style={{ backgroundColor: c.bg, boxShadow: `inset 0 0 0 1px ${c.ring}` }}
    >
      <span
        className="text-[13px] leading-none tracking-tight"
        style={{
          color: c.fg,
          transform: "skewX(-10deg)",
          fontFamily: "var(--font-racing), system-ui, sans-serif",
        }}
      >
        {n}
      </span>
    </span>
  );
}
