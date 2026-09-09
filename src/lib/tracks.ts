/**
 * Stylised layout silhouettes for the 10 Chase tracks. A track's shape is
 * geometry, not a photograph — these are hand-drawn approximations that keep
 * each track's signature trait (Darlington's egg, Martinsville's paperclip,
 * Talladega's tri-oval, Phoenix's dogleg, Bristol's bullring, Charlotte's
 * quad-oval). Normalised to a 200 x 120 viewBox.
 */
export interface TrackShapeDef {
  slug: string;
  name: string; // matches races.track
  trait: string;
  path: string;
}

export const TRACKS: Record<string, TrackShapeDef> = {
  darlington: {
    slug: "darlington",
    name: "Darlington Raceway",
    trait: "The egg — turns 1–2 wide, 3–4 pinched",
    path: "M55,12 L150,10 C178,10 192,26 192,52 C192,86 172,110 130,110 L55,108 C22,108 8,88 8,58 C8,26 24,12 55,12 Z",
  },
  gateway: {
    slug: "gateway",
    name: "World Wide Technology Raceway",
    trait: "Odd near-oval, one end far tighter",
    path: "M45,12 L150,12 C182,12 192,30 188,58 C184,92 170,108 120,108 L45,108 C16,108 10,86 12,54 C14,26 20,12 45,12 Z",
  },
  bristol: {
    slug: "bristol",
    name: "Bristol Motor Speedway",
    trait: "High-banked concrete bullring",
    path: "M62,8 L118,8 C158,8 174,30 174,60 C174,92 156,112 118,112 L62,112 C24,112 8,92 8,60 C8,28 24,8 62,8 Z",
  },
  kansas: {
    slug: "kansas",
    name: "Kansas Speedway",
    trait: "D-shaped tri-oval",
    path: "M40,14 L160,14 C186,14 192,26 192,58 C192,92 186,104 160,104 C130,104 118,116 100,116 C82,116 70,104 40,104 C14,104 8,92 8,58 C8,26 14,14 40,14 Z",
  },
  "las-vegas": {
    slug: "las-vegas",
    name: "Las Vegas Motor Speedway",
    trait: "D-shaped, progressive banking",
    path: "M44,14 L156,14 C184,14 192,28 192,58 C192,90 184,104 156,104 C128,104 116,114 100,114 C84,114 72,104 44,104 C16,104 8,90 8,58 C8,28 16,14 44,14 Z",
  },
  charlotte: {
    slug: "charlotte",
    name: "Charlotte Motor Speedway",
    trait: "Quad-oval frontstretch",
    path: "M40,14 L160,14 C186,14 192,28 192,58 C192,92 186,104 160,104 C145,104 140,112 122,112 C110,112 106,116 100,116 C94,116 90,112 78,112 C60,112 55,104 40,104 C14,104 8,92 8,58 C8,28 14,14 40,14 Z",
  },
  phoenix: {
    slug: "phoenix",
    name: "Phoenix Raceway",
    trait: "Flat, with the backstretch dogleg",
    path: "M36,20 L96,20 C108,20 112,10 128,10 C150,10 156,22 178,22 C192,22 194,34 194,58 C194,90 188,102 164,102 L36,102 C14,102 8,90 8,58 C8,30 14,20 36,20 Z",
  },
  talladega: {
    slug: "talladega",
    name: "Talladega Superspeedway",
    trait: "2.66 miles of tri-oval, 33° banking",
    path: "M30,16 L170,16 C190,16 196,26 196,54 C196,86 190,100 170,100 C132,100 118,114 100,114 C82,114 68,100 30,100 C10,100 4,86 4,54 C4,26 10,16 30,16 Z",
  },
  martinsville: {
    slug: "martinsville",
    name: "Martinsville Speedway",
    trait: "The paperclip — long straights, flat hairpins",
    path: "M55,16 L145,16 C178,16 186,34 186,60 C186,86 178,104 145,104 L55,104 C22,104 14,86 14,60 C14,34 22,16 55,16 Z",
  },
  homestead: {
    slug: "homestead",
    name: "Homestead-Miami Speedway",
    trait: "Continuously variable banking",
    path: "M45,14 L155,14 C184,14 192,28 192,60 C192,92 184,106 155,106 L45,106 C16,106 8,92 8,60 C8,28 16,14 45,14 Z",
  },
};

/** Chase running order — used to sequence the site background slideshow. */
export const CHASE_TRACK_ORDER = [
  "darlington",
  "gateway",
  "bristol",
  "kansas",
  "las-vegas",
  "charlotte",
  "phoenix",
  "talladega",
  "martinsville",
  "homestead",
];

/** Map a races.track value to a track slug. */
export function trackSlug(name: string | null | undefined): string | null {
  if (!name) return null;
  const n = name.toLowerCase();
  if (n.includes("darlington")) return "darlington";
  if (n.includes("world wide") || n.includes("gateway")) return "gateway";
  if (n.includes("bristol")) return "bristol";
  if (n.includes("kansas")) return "kansas";
  if (n.includes("las vegas") || n.includes("vegas")) return "las-vegas";
  if (n.includes("charlotte")) return "charlotte";
  if (n.includes("phoenix")) return "phoenix";
  if (n.includes("talladega")) return "talladega";
  if (n.includes("martinsville")) return "martinsville";
  if (n.includes("homestead") || n.includes("miami")) return "homestead";
  return null;
}
