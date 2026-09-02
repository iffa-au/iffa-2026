type PlaceholderPanelProps = {
  /** Tailwind aspect class, e.g. "aspect-[4/3]". */
  aspect?: string;
  /** Describes the image that will eventually go here. Rendered as real text. */
  caption: string;
  className?: string;
};

/**
 * The Talent Lab's only imagery.
 *
 * No photography exists for this section, and inventing a CloudFront path to
 * fill the gap would ship a broken image to a real user. So the gap is stated
 * rather than faked: a striped-gradient panel carrying a mono label that says
 * what the picture will be.
 *
 * The gradient is decorative and `aria-hidden`; the caption is real text, so
 * the intent still reaches anyone not looking at the screen. There are no
 * `<img>` tags anywhere in this section by design.
 *
 * Built entirely from `<span>`s with display utilities rather than `<div>`s and
 * `<p>`s. `mentor-card` renders this inside a `<button>`, whose content model
 * only permits phrasing content — a block element there is invalid markup that
 * some browsers reparse, which is exactly how hydration mismatches start.
 */
export function PlaceholderPanel({
  aspect = "aspect-[4/3]",
  caption,
  className = "",
}: PlaceholderPanelProps) {
  return (
    <span
      className={`relative block overflow-hidden rounded-xl border border-white/10 bg-[#0e0d13] ${aspect} ${className}`}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 block bg-[repeating-linear-gradient(112deg,rgba(255,255,255,0.03)_0_2px,transparent_2px_11px),linear-gradient(200deg,#1c1924,#000)]"
      />
      <span className="absolute bottom-3 left-4 right-4 block font-mono text-[9px] uppercase leading-relaxed tracking-[0.14em] text-white/40">
        <span aria-hidden="true">[ image ] </span>
        {caption}
      </span>
    </span>
  );
}
