// Edit these point lists to change how the hero card is cut into shards.
// Each shape is a list of [x, y] vertices, given as percentages of the
// card's own width/height (0-100). The same list drives both the CSS
// clip-path on the shard and the SVG outline drawn on top of it, so
// changing a shape here updates both at once — no need to touch Shard.jsx
// or HeroCard.jsx.
//
// The desktop and mobile sets below already have ~2.5% gaps baked into
// the coordinates themselves (e.g. S1's right edge sits 2.5 units left
// of S2's matching edge) — that's what produces the "broken glass" seams.
// If you redraw a shape, keep that same offset between neighboring edges
// to preserve the gap.

export const DESKTOP_BREAKPOINT = 860;

export const DESKTOP_SHAPES = {
  s1: [
    [0, 0],
    [29, 0],
    [52, 66],
    [44, 100],
    [0, 100],
  ],
  s2: [
    [31.5, 0],
    [59, 0],
    [76, 56],
    [54.5, 68.5],
  ],
  s3: [
    [61.5, 0],
    [100, 0],
    [100, 100],
    [80, 100],
    [78.5, 58],
  ],
  s4: [
    [54.5, 71],
    [76, 59],
    [77.5, 100],
    [46.5, 100],
  ],
};

export const MOBILE_SHAPES = {
  s1: [
    [0, 0],
    [100, 0],
    [100, 38],
    [0, 52],
  ],
  s2: [
    [0, 54.5],
    [34, 49.7],
    [26, 100],
    [0, 100],
  ],
  s3: [
    [36.5, 49.4],
    [68, 45],
    [60, 100],
    [28.5, 100],
  ],
  s4: [
    [70.5, 44.6],
    [100, 40.5],
    [100, 100],
    [62.5, 100],
  ],
};
