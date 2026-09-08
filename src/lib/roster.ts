import type { Manufacturer } from "./manufacturers";

export interface RosterDriver {
  slug: string;
  name: string;
  number: string;
  team: string;
  manufacturer: Manufacturer;
  chase: boolean; // 2026 Chase field
}

const R = (
  number: string,
  name: string,
  team: string,
  manufacturer: Manufacturer,
  chase = false,
): RosterDriver => ({
  slug: name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, ""),
  name,
  number,
  team,
  manufacturer,
  chase,
});

/** 2026 Cup Series full-time chartered entries (36). */
export const ROSTER: RosterDriver[] = [
  // Chevrolet
  R("41", "Cole Custer", "Haas Factory Team", "Chevrolet"),
  R("5", "Kyle Larson", "Hendrick Motorsports", "Chevrolet", true),
  R("9", "Chase Elliott", "Hendrick Motorsports", "Chevrolet", true),
  R("24", "William Byron", "Hendrick Motorsports", "Chevrolet", true),
  R("48", "Alex Bowman", "Hendrick Motorsports", "Chevrolet"),
  R("47", "Ricky Stenhouse Jr.", "Hyak Motorsports", "Chevrolet"),
  R("3", "Austin Dillon", "Richard Childress Racing", "Chevrolet"),
  R("8", "Kyle Busch", "Richard Childress Racing", "Chevrolet"),
  R("16", "AJ Allmendinger", "Kaulig Racing", "Chevrolet"),
  R("10", "Ty Dillon", "Kaulig Racing", "Chevrolet"),
  R("51", "Cody Ware", "Rick Ware Racing", "Chevrolet"),
  R("7", "Daniel Suarez", "Spire Motorsports", "Chevrolet", true),
  R("71", "Michael McDowell", "Spire Motorsports", "Chevrolet"),
  R("77", "Carson Hocevar", "Spire Motorsports", "Chevrolet", true),
  // Ford
  R("4", "Noah Gragson", "Front Row Motorsports", "Ford"),
  R("34", "Todd Gilliland", "Front Row Motorsports", "Ford"),
  R("38", "Zane Smith", "Front Row Motorsports", "Ford"),
  R("6", "Brad Keselowski", "RFK Racing", "Ford"),
  R("17", "Chris Buescher", "RFK Racing", "Ford", true),
  R("60", "Ryan Preece", "RFK Racing", "Ford", true),
  R("2", "Austin Cindric", "Team Penske", "Ford", true),
  R("12", "Ryan Blaney", "Team Penske", "Ford", true),
  R("22", "Joey Logano", "Team Penske", "Ford", true),
  R("21", "Josh Berry", "Wood Brothers Racing", "Ford"),
  // Toyota
  R("23", "Bubba Wallace", "23XI Racing", "Toyota", true),
  R("35", "Riley Herbst", "23XI Racing", "Toyota"),
  R("45", "Tyler Reddick", "23XI Racing", "Toyota", true),
  R("11", "Denny Hamlin", "Joe Gibbs Racing", "Toyota", true),
  R("19", "Chase Briscoe", "Joe Gibbs Racing", "Toyota", true),
  R("20", "Christopher Bell", "Joe Gibbs Racing", "Toyota", true),
  R("54", "Ty Gibbs", "Joe Gibbs Racing", "Toyota", true),
  R("42", "John Hunter Nemechek", "Legacy Motor Club", "Toyota"),
  R("43", "Erik Jones", "Legacy Motor Club", "Toyota"),
  R("1", "Ross Chastain", "Trackhouse Racing", "Toyota"),
  R("88", "Connor Zilisch", "Trackhouse Racing", "Toyota"),
  R("97", "Shane Van Gisbergen", "Trackhouse Racing", "Toyota"),
];

export const rosterBySlug = new Map(ROSTER.map((d) => [d.slug, d]));
