export type Manufacturer = "Toyota" | "Ford" | "Chevrolet";

/**
 * 2026 Cup Series manufacturer alignment for the Darlington field. Stable across
 * the season, so kept here rather than in a DB column. The 16 Chase drivers are
 * confirmed from NASCAR's official playoff standings; the rest from team charts.
 */
export const MANUFACTURER: Record<string, Manufacturer> = {
  // Toyota
  "Denny Hamlin": "Toyota",
  "Christopher Bell": "Toyota",
  "Tyler Reddick": "Toyota",
  "Chase Briscoe": "Toyota",
  "Ty Gibbs": "Toyota",
  "Bubba Wallace": "Toyota",
  "Erik Jones": "Toyota",
  "Corey Heim": "Toyota",
  "John Hunter Nemechek": "Toyota",
  "Riley Herbst": "Toyota",
  "Chad Finchum": "Toyota",
  "Ross Chastain": "Toyota", // Trackhouse -> Toyota for 2026
  "Connor Zilisch": "Toyota",
  "Shane Van Gisbergen": "Toyota",
  // Ford
  "Ryan Blaney": "Ford",
  "Joey Logano": "Ford",
  "Chris Buescher": "Ford",
  "Austin Cindric": "Ford",
  "Ryan Preece": "Ford",
  "Josh Berry": "Ford",
  "Todd Gilliland": "Ford",
  "Brad Keselowski": "Ford",
  "Zane Smith": "Ford",
  "Noah Gragson": "Ford",
  "Cody Ware": "Ford",
  // Chevrolet
  "Kyle Larson": "Chevrolet",
  "Chase Elliott": "Chevrolet",
  "Carson Hocevar": "Chevrolet",
  "Daniel Suarez": "Chevrolet",
  "William Byron": "Chevrolet",
  "Alex Bowman": "Chevrolet",
  "Michael McDowell": "Chevrolet",
  "AJ Allmendinger": "Chevrolet",
  "Austin Hill": "Chevrolet",
  "Austin Dillon": "Chevrolet",
  "Ty Dillon": "Chevrolet",
  "Cole Custer": "Chevrolet",
  "Ricky Stenhouse Jr.": "Chevrolet",
};

export const MFR_PLATE: Record<Manufacturer, { bg: string; fg: string; ring: string }> = {
  // door-panel style: manufacturer colour behind a bold number
  Toyota: { bg: "#e21836", fg: "#ffffff", ring: "rgba(255,255,255,0.35)" },
  Ford: { bg: "#1666b4", fg: "#ffffff", ring: "rgba(255,255,255,0.35)" },
  Chevrolet: { bg: "#e4a400", fg: "#141414", ring: "rgba(0,0,0,0.35)" },
};
