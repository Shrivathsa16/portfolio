// Draws the bright glass-edge line on top of a shard, tracing the exact
// same [x, y] points used for the shard's clip-path (see shardShapes.js).
export default function ShardOutline({ points }) {
  const pointsAttr = points.map(([x, y]) => `${x},${y}`).join(' ');

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <polygon
        points={pointsAttr}
        fill="none"
        stroke="rgba(255,255,255,0.6)"
        strokeWidth="1.4"
        vectorEffect="non-scaling-stroke"
        style={{ filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.4))' }}
      />
    </svg>
  );
}
