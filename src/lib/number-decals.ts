/**
 * Optional car-number decal images, keyed by car number (string).
 *
 * Drop PNGs into `public/numbers/` (e.g. `public/numbers/48.png`) and add an
 * entry here — the season standings chart will render the image at the end of
 * that driver's line instead of the drawn number plate. Anything not listed
 * falls back to the manufacturer-coloured plate, so this can be filled in a
 * few at a time.
 */
export const NUMBER_DECAL: Record<string, string> = {
  // "48": "/numbers/48.png",
};
