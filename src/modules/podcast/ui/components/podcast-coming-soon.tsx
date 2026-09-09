import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SERIF } from "./podcast-chrome";

/**
 * The page as it looks between episodes.
 *
 * Deliberately built as the *featured hero's own composition* — a wide framed
 * panel with the gold glow behind it, then centred type beneath — rather than
 * as a centred error card. The frame is the same object `PodcastPlayer` draws
 * for a published episode, so the shape itself says "an episode belongs here"
 * and the state reads as a page waiting rather than a page broken. Nothing
 * about it needs to apologise.
 *
 * The illustration is served from `public/` and drawn with a plain <img>
 * instead of being inlined:
 *
 *   - CSS animation inside an SVG still runs when the SVG is the source of an
 *     <img>; only scripts and external resources are blocked, and this file
 *     uses neither. The host keeps breathing, the rings keep pulsing.
 *   - It stays out of the client bundle, and is cached as its own asset.
 *   - Its <style> block cannot leak into the page's cascade, which inlining
 *     14KB of `.pcast` rules and `@keyframes` into the document would risk.
 *
 * `alt=""` because the copy underneath already says what the picture says;
 * announcing both would read the same sentence to a screen reader twice.
 */
export function PodcastComingSoon() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative mx-auto max-w-4xl px-6 py-12 sm:py-20 lg:py-24">
        <div data-enter className="relative">
          {/* The same glow the featured player sits in — it is what keeps a
              framed panel from reading as a hole cut in a black page. */}
          <div
            className="pointer-events-none absolute -inset-6 rounded-[2rem] opacity-70 blur-2xl"
            aria-hidden="true"
            style={{
              background:
                "radial-gradient(60% 60% at 50% 50%, rgba(234,179,8,0.16) 0%, transparent 100%)",
            }}
          />

          {/* 16:9 from `sm` up, which is the player's frame and the whole point
              of the rhyme. Below that it opens out to roughly the artwork's own
              7:5, because a 16:9 box on a 390px screen is 190px tall and fits
              the illustration to that height — leaving the host too small to
              read as the subject of the page.

              Padding stays small: the SVG carries its own generous margins, and
              stacking frame padding on top of them shrinks the figure twice.

              Either way the ratio is reserved before the asset loads, so
              nothing on the page moves when it arrives. */}
          <div className="relative aspect-7/5 w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent sm:aspect-video">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/podcast-coming-soon.svg"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-contain p-2 sm:p-4 lg:p-6"
            />
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-2xl text-center lg:mt-12">
          <span
            data-enter
            className="text-[11px] font-bold uppercase tracking-[0.35em] text-yellow-500"
          >
            Between episodes
          </span>

          <h2
            data-enter
            className="mt-5 text-balance text-3xl leading-[1.1] font-bold text-white sm:text-4xl"
            style={{ fontFamily: SERIF }}
          >
            Something worth listening to is coming.
          </h2>

          <p
            data-enter
            className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/60 sm:text-base"
          >
            We are recording the next conversation. New episodes land here
            first — stories, ideas and perspectives from across cinema and the
            creative world.
          </p>

          {/* A real destination rather than a decorative button: there is no
              subscribe mechanism on the site yet, and a control that does
              nothing is worse than no control at all. */}
          <Link
            data-enter
            href="/latest-news"
            className="group mt-9 inline-flex items-center gap-2 rounded-md border border-white/20 px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:border-yellow-500 hover:text-yellow-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            Read the latest news
            <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
          </Link>
        </div>
      </div>
    </section>
  );
}
