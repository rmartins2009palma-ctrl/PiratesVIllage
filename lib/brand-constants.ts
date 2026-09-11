// Brand values needed as plain strings by APIs that cannot read CSS variables.
//
// The signature pad draws onto a <canvas>, whose 2D context takes a literal
// colour — it never resolves var(--foreground). Keep these in step with the
// tokens in app/globals.css.

/** Mirrors --foreground. Ink used by the guardian signature canvas. */
export const BRAND_INK = "#3d2a1f"

/** Mirrors --primary. Browser UI / theme colour. */
export const BRAND_PRIMARY = "#60402f"
