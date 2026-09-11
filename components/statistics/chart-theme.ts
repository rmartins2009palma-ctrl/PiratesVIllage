// Chart colours, kept apart from the UI tokens because a data mark has a
// stricter job than a surface: it must clear 3:1 against the card it sits on.
//
// The brand beige #c5ad86 reads 2.11:1 on white, so it is used for washes and
// fills only — never for a line, a bar or any mark that carries a value.
// EMPHASIS is that beige darkened until it passes (3.89:1) while staying
// recognisably the same warm accent.

export const CHART = {
  /** Primary data mark. 9.24:1 on a white card. */
  series: "#60402f",
  /** Emphasis for a single highlighted mark. 3.89:1. */
  emphasis: "#9c7c4a",
  /** Area wash under the line — a tint, never a value-carrying mark. */
  wash: "#60402f",
  washOpacity: 0.1,
  /** Hairline grid, one step off the surface. Solid, never dashed. */
  grid: "#e5dcd0",
  axisText: "#6b5b4e",
  surface: "#ffffff",
} as const

export const AXIS_TICK = {
  fill: CHART.axisText,
  fontSize: 12,
} as const
