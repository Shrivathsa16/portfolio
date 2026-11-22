import { forwardRef } from 'react';
import ShardOutline from './ShardOutline.jsx';

const VARIANT_CLASS = {
  moss: 'shard-moss',
  teal: 'shard-teal',
  ember: 'shard-ember',
};

// A single glass shard. Two nested transforms on purpose:
//  - the OUTER div plays the one-time fly-in entry animation (mounted/entryTransform)
//  - the INNER div (forwarded ref) carries the continuous pointer-parallax transform
// Keeping them on separate elements means HeroCard's rAF loop can overwrite the
// inner transform every frame without ever touching (or fighting) the entry transition.
const Shard = forwardRef(function Shard(
  {
    points,
    variant,
    hasPhoto,
    photoSrc,
    photoAlt,
    photoStyle,
    smoke,
    mounted,
    entryTransform,
    entryDelay,
    reducedMotion,
  },
  innerRef
) {
  const clipPath = `polygon(${points.map(([x, y]) => `${x}% ${y}%`).join(', ')})`;
  const settled = mounted || reducedMotion;

  return (
    <div
      className="absolute inset-0"
      style={{
        clipPath,
        WebkitClipPath: clipPath,
        transform: settled ? 'none' : entryTransform,
        opacity: settled ? 1 : 0,
        transition: reducedMotion
          ? 'none'
          : `transform 0.9s cubic-bezier(.16,.84,.33,1) ${entryDelay}s, opacity 0.7s ease ${entryDelay}s`,
      }}
    >
      <div ref={innerRef} className="absolute inset-0 will-change-transform">
        <div className={`absolute inset-0 ${VARIANT_CLASS[variant]}`} />
        {smoke && <div className="shard-smoke" aria-hidden="true" />}
        {hasPhoto && (
          <img
            src={photoSrc}
            alt={photoAlt}
            style={photoStyle}
            className="pointer-events-none absolute select-none"
            draggable={false}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        )}
        <div className="shard-highlight absolute inset-0" aria-hidden="true" />
        <ShardOutline points={points} />
      </div>
    </div>
  );
});

export default Shard;
