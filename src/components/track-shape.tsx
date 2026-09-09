import { TRACKS } from "@/lib/tracks";

/** Renders one track's stylised layout outline. Colour comes from `currentColor`. */
export function TrackShape({
  slug,
  className,
  strokeWidth = 2.5,
}: {
  slug: string | null;
  className?: string;
  strokeWidth?: number;
}) {
  const t = slug ? TRACKS[slug] : null;
  if (!t) return null;
  return (
    <svg
      viewBox="0 0 200 120"
      preserveAspectRatio="xMidYMid meet"
      className={className}
      aria-hidden
    >
      <path
        d={t.path}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </svg>
  );
}
