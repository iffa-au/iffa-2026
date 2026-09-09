import type { ReactNode } from "react";
import Link from "next/link";

/**
 * The Festival section's button.
 *
 * Every call to action on these pages used to carry its own copy of the same
 * forty-character class string — the hero had two, the closing band two more,
 * the film page another, and the paper sections had none at all because
 * nothing in that palette had been written down. They had already drifted:
 * padding and tracking matched, the focus ring did not.
 *
 * Two things are worth noting about the treatment itself.
 *
 * The first is the sweep. The whole page is built on a projector throwing
 * light, and a button that only swaps its background on hover is the one place
 * that premise was dropped. Instead a narrow bar of light crosses the face,
 * the way the beam crosses anything else here. It runs on hover and on focus,
 * so a keyboard gets the same answer as a mouse.
 *
 * The second is `ink` and `inkSolid`. The programme inverts to cream paper,
 * and the amber-on-dark buttons are illegible there — amber on cream is the
 * one pairing in this palette that fails contrast outright. Those two variants
 * are what a button on paper looks like, and their absence is why the paper
 * sections had been quietly built without one.
 */

type Variant = "primary" | "secondary" | "ink" | "inkSolid";
type Size = "md" | "lg";

const BASE =
  "group relative inline-flex items-center justify-center gap-3 overflow-hidden font-fest-display font-bold uppercase tracking-[0.16em] transition-[background-color,border-color,color] duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 disabled:pointer-events-none disabled:opacity-45";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-fest-lamp text-fest-ink hover:bg-fest-beam focus-visible:outline-fest-lamp",
  secondary:
    "border border-fest-beam/25 text-fest-beam hover:border-fest-lamp hover:text-fest-lamp focus-visible:outline-fest-lamp",
  ink: "border border-fest-ink/30 text-fest-ink hover:border-fest-ink hover:bg-fest-ink/[0.06] focus-visible:outline-fest-ink",
  inkSolid:
    "bg-fest-ink text-fest-stock hover:bg-fest-curtain focus-visible:outline-fest-ink",
};

/**
 * The sweep is tinted per variant rather than always white: a white bar over
 * cream paper is invisible, and over the oxblood hover state it reads as a
 * smear. Each one is the lightest thing that still shows on its own ground.
 */
const SWEEPS: Record<Variant, string> = {
  primary: "via-white/55",
  secondary: "via-fest-lamp/25",
  ink: "via-fest-ink/12",
  inkSolid: "via-fest-stock/30",
};

const SIZES: Record<Size, string> = {
  md: "px-7 py-3 text-sm",
  lg: "px-9 py-4 text-sm",
};

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  /** Appends a chevron that advances on hover. Off for anything not forward-moving. */
  withArrow?: boolean;
  className?: string;
};

type Props = CommonProps &
  (
    | { href: string; onClick?: never; type?: never; disabled?: never }
    | {
        href?: never;
        onClick: () => void;
        type?: "button" | "submit";
        disabled?: boolean;
      }
  );

/** External hrefs get a real anchor, with the rel a new tab requires. */
const isExternal = (href: string): boolean =>
  /^(https?:)?\/\//.test(href) || href.startsWith("mailto:") || href.startsWith("tel:");

function Inner({
  children,
  variant,
  withArrow,
}: {
  children: ReactNode;
  variant: Variant;
  withArrow: boolean;
}) {
  return (
    <>
      {/* The beam. Skewed and translated rather than a background-position
          animation so it composites on the GPU, and hidden outright under
          reduced motion — this is decoration, and it is the only thing here
          that moves. */}
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent to-transparent ${SWEEPS[variant]} transition-transform duration-700 ease-out group-hover:translate-x-[300%] group-focus-visible:translate-x-[300%] motion-reduce:hidden`}
      />

      <span className="relative">{children}</span>

      {withArrow && (
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="square"
          className="relative h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
        >
          <path d="M4 12h15M13 6l6 6-6 6" />
        </svg>
      )}
    </>
  );
}

export function FestivalButton({
  children,
  variant = "primary",
  size = "lg",
  withArrow = false,
  className = "",
  ...rest
}: Props) {
  const classes = `${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`;

  if (rest.href !== undefined) {
    const { href } = rest;

    if (isExternal(href)) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
        >
          <Inner variant={variant} withArrow={withArrow}>
            {children}
          </Inner>
        </a>
      );
    }

    return (
      <Link href={href} className={classes}>
        <Inner variant={variant} withArrow={withArrow}>
          {children}
        </Inner>
      </Link>
    );
  }

  return (
    <button
      type={rest.type ?? "button"}
      onClick={rest.onClick}
      disabled={rest.disabled}
      className={classes}
    >
      <Inner variant={variant} withArrow={withArrow}>
        {children}
      </Inner>
    </button>
  );
}
