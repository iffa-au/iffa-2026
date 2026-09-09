/**
 * Projected film grain.
 *
 * A single tiled noise texture drifting on a stepped animation, which is what
 * makes it read as grain rather than as a moving pattern: the jump between
 * frames is the point. Kept to a handful of positions so the loop is a few
 * hundred bytes of CSS and no JavaScript at all.
 *
 * Sits above the artwork and below the copy, at an opacity low enough to be
 * felt rather than seen. `motion-reduce` stops the drift but keeps the texture.
 */
export function FilmGrain() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[5] opacity-[0.16] mix-blend-overlay motion-reduce:animate-none [animation:festGrain_0.8s_steps(1)_infinite] [background-image:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22140%22 height=%22140%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/></filter><rect width=%22140%22 height=%22140%22 filter=%22url(%23n)%22 opacity=%220.55%22/></svg>')] [background-size:140px_140px]"
    >
      <style>{`
        @keyframes festGrain {
          0%   { background-position: 0 0; }
          25%  { background-position: -37px 19px; }
          50%  { background-position: 23px -41px; }
          75%  { background-position: -19px -23px; }
          100% { background-position: 41px 31px; }
        }
      `}</style>
    </div>
  );
}
