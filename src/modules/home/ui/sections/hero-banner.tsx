import Image from "next/image";

import { heroBanner } from "@/modules/home/data/hero-banner";

const SERIF = "var(--font-playfair), 'Playfair Display', Georgia, serif";

/**
 * Full-bleed homepage hero, and the page's only <h1>.
 *
 * The site header is `fixed` and transparent on `/` precisely so this shows
 * through it, so the section pulls itself up behind the header with
 * `-mt-[var(--header-h)]` and pads its own text back down by that same measured
 * variable. Never hardcode the header height — `header.tsx` measures itself and
 * overwrites `--header-h` on <html>.
 *
 * Deliberately a server component: this is the LCP element and must paint
 * without waiting for JS.
 */
const HeroBanner = () => {
  return (
    <section
      aria-labelledby="home-hero-title"
      className="relative isolate -mt-[var(--header-h)] w-full overflow-hidden bg-black h-[min(75svh,640px)] md:h-auto md:aspect-video lg:aspect-[8/3] lg:max-h-[85svh]"
    >
      {/* `bg-black` above is the loading state — no `placeholder`/`blurDataURL`.
          Next 16 deprecates `priority`; `loading`/`fetchPriority` is the
          documented replacement. No `quality` prop: the configured `qualities`
          is the default [75], and widening it is a next.config.ts change. */}
      <Image
        src={heroBanner.imageSrc}
        alt={heroBanner.imageAlt}
        fill
        sizes="100vw"
        loading="eager"
        fetchPriority="high"
        className="object-cover object-[50%_60%]"
      />

      {/*
        Keeps the nav legible, and from `md` reaches far enough down to sit
        behind the headline too. Measured on the supplied artwork: the sunset
        cloud and tower lights in the upper right left 30% of the area behind
        the <h1> below 3:1 against the gold at 1024px (48% in its right fifth).
        Extending the scrim and adding the mid stop takes that to under 2%.
        Phones crop that bright band out entirely and already measured 0%, so
        the base scrim stays short rather than dimming a sky that reads fine.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[calc(var(--header-h)+4rem)] bg-linear-to-b from-black/60 to-transparent md:h-[calc(var(--header-h)+10rem)] md:from-black/65 md:via-black/40 md:via-55% lg:h-[calc(var(--header-h)+18rem)] lg:from-black/70 lg:via-black/45 lg:via-60%"
      />
      {/* Blends into the trailer section below, which is also bg-black. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-linear-to-t from-black to-transparent"
      />

      <div className="relative z-10 mx-auto px-5 text-center pt-[calc(var(--header-h)+1.5rem)] md:pt-[calc(var(--header-h)+2.25rem)] lg:pt-[calc(var(--header-h)+2.5rem)] motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-700">
        {/* The gold is a clipped background gradient, so legibility has to come
            from a `filter` drop-shadow — a `text-shadow` paints over the
            gradient and muddies it. */}
        <h1
          id="home-hero-title"
          style={{ fontFamily: SERIF }}
          className="bg-linear-to-b from-[#f6e6b4] via-[#e6ba35] to-[#a8792a] bg-clip-text text-transparent text-balance font-medium leading-[1.05] tracking-[0.02em] drop-shadow-[0_2px_16px_rgba(0,0,0,0.55)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
        >
          {heroBanner.title}
        </h1>

        <p className="mt-3 text-white tracking-[0.2em] drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)] text-xs sm:text-sm md:mt-4 md:text-base lg:text-lg">
          <span>{heroBanner.date}</span>
          {/* Below `sm` the two phrases stack and the rule is dropped. Each
              stays in its own span so screen readers hear them apart. */}
          <span aria-hidden="true" className="mx-2 hidden sm:inline md:mx-3">
            |
          </span>
          <span className="block sm:inline">{heroBanner.location}</span>
        </p>
      </div>
    </section>
  );
};

export { HeroBanner };
export default HeroBanner;
