"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { MFR_PLATE, type Manufacturer } from "@/lib/manufacturers";

function initials(name: string) {
  const p = name.replace(/\./g, "").split(/\s+/).filter(Boolean);
  return ((p[0]?.[0] ?? "") + (p.at(-1)?.[0] ?? "")).toUpperCase();
}

/**
 * Circular driver image. Uses /drivers/<slug>.(png|jpg) when a file is present,
 * otherwise a manufacturer-tinted initials disc.
 */
export function DriverAvatar({
  name,
  photo,
  manufacturer,
  size = 64,
  className,
}: {
  name: string;
  photo?: string | null;
  manufacturer: Manufacturer;
  size?: number;
  className?: string;
}) {
  const [broken, setBroken] = useState(false);
  const c = MFR_PLATE[manufacturer];
  const showImg = Boolean(photo) && !broken;

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full",
        className,
      )}
      style={{ width: size, height: size, backgroundColor: c.bg }}
    >
      {showImg ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photo as string}
          alt={name}
          width={size}
          height={size}
          className="h-full w-full scale-110 object-contain"
          onError={() => setBroken(true)}
        />
      ) : (
        <span
          className="font-semibold"
          style={{ color: c.fg, fontSize: size * 0.36 }}
        >
          {initials(name)}
        </span>
      )}
    </span>
  );
}
