"use client";

import { useEffect, useState } from "react";

import type { Festival, FestivalPhase } from "../../lib/types";

/**
 * Time remaining until the lights go down.
 *
 * Rendered empty on the server and filled in after mount, on purpose: the
 * remaining time depends on the viewer's clock, and any value the server put in
 * the HTML would be wrong by the time it arrived and would mismatch on
 * hydration. The placeholder keeps the same box, so nothing shifts when the
 * real numbers land.
 *
 * `phase` is decided once on the server from Melbourne's date and passed in, so
 * the wording never disagrees with the rest of the page.
 */

type Remaining = { days: number; hours: number; minutes: number };

/** Opening night, taken as 7pm Melbourne on the first day of the festival. */
const openingMoment = (startDate: string): number =>
  // The +11:00 offset is Melbourne in October, when the festival runs. A
  // fixed offset rather than a timezone library: this drives a countdown
  // rounded to whole minutes, where an hour of DST error at the far edge of
  // the year is not visible, and the alternative is shipping tzdata.
  new Date(`${startDate}T19:00:00+11:00`).getTime();

const toRemaining = (ms: number): Remaining => {
  const minutes = Math.max(0, Math.floor(ms / 60000));
  return {
    days: Math.floor(minutes / 1440),
    hours: Math.floor((minutes % 1440) / 60),
    minutes: minutes % 60,
  };
};

const pad = (value: number) => String(value).padStart(2, "0");

function Unit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-start">
      <span className="font-fest-display text-[clamp(2.5rem,6vw,3.75rem)] font-extrabold leading-[0.85] tabular-nums text-fest-beam">
        {value}
      </span>
      <span className="mt-2 font-fest-text text-sm italic text-fest-lamp/75">
        {label}
      </span>
    </div>
  );
}

export function OpeningCountdown({
  festival,
  phase,
}: {
  festival: Festival;
  phase: FestivalPhase;
}) {
  const [remaining, setRemaining] = useState<Remaining | null>(null);

  useEffect(() => {
    if (phase !== "upcoming") return;

    const target = openingMoment(festival.startDate);
    if (!Number.isFinite(target)) return;

    const tick = () => setRemaining(toRemaining(target - Date.now()));
    tick();
    // Once a minute is the finest granularity anything here shows; a
    // per-second interval would repaint 60x as often to change nothing.
    const timer = window.setInterval(tick, 30_000);
    return () => window.clearInterval(timer);
  }, [festival.startDate, phase]);

  // Nothing is rendered once the festival is over. A published festival is
  // presented as the festival — telling a visitor on the front page that it has
  // closed frames the whole page as an archive, which is what /festivals/<slug>
  // is for.
  if (phase === "past") return null;

  if (phase === "running") {
    return (
      <p className="hero-line max-w-[24ch] border-l border-fest-lamp/50 pl-6 font-fest-text text-base leading-relaxed text-fest-beam/80">
        <span className="font-fest-display text-xl font-bold uppercase tracking-[0.1em] text-fest-lamp">
          On now
        </span>
        <br />
        Doors are open. Tonight&rsquo;s screenings are in the programme below.
      </p>
    );
  }

  return (
    <div className="hero-line border-l border-fest-beam/15 pl-6">
      <p className="mb-4 font-fest-text text-sm italic text-fest-beam/50">
        Until the lights go down
      </p>
      <div
        className="flex items-start gap-7"
        // The whole group is one reading; a screen reader announcing three
        // separate numbers as they tick would be noise, not information.
        role="timer"
        aria-live="off"
      >
        <Unit value={remaining ? String(remaining.days) : "—"} label="days" />
        <Unit value={remaining ? pad(remaining.hours) : "—"} label="hours" />
        <Unit value={remaining ? pad(remaining.minutes) : "—"} label="minutes" />
      </div>
    </div>
  );
}
