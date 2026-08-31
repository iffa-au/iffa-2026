import Link from "next/link";
import { notFound } from "next/navigation";

import { events } from "../../data/events-data";
import { pageCopy, talentLabEdition } from "../../data/talent-lab-edition";
import { eventBySlug } from "../../lib/filters";
import type { LabelledFact } from "../../lib/types";
import { FactGrid } from "../components/fact-grid";
import { PageHeader } from "../components/page-header";
import { PlaceholderPanel } from "../components/placeholder-panel";
import { SidePanel, SideRail } from "../components/side-panel";
import { SpeakerCard } from "../components/speaker-card";

const copy = pageCopy.eventDetail;

/** Every slug this route serves. Used by `generateStaticParams`. */
export const eventSlugs = events.map((event) => event.slug);

export function EventDetailPage({ slug }: { slug: string }) {
  const event = eventBySlug(events, slug);

  if (!event) {
    notFound();
  }

  const isPast = event.state === "past";

  const details: LabelledFact[] = [
    { label: "Date & time", value: event.when },
    { label: "Format", value: event.format },
    { label: "Location", value: event.mode },
    { label: copy.costLabel, value: copy.costValue },
  ];

  return (
    <div className="bg-black text-white">
      <PageHeader
        tone="hero"
        crumbs={[
          { label: "Talent Lab", href: "/talent-lab" },
          { label: "Events", href: "/talent-lab/events" },
          { label: event.title },
        ]}
        eyebrow={event.format}
        title={event.title}
        intro={event.when}
        badges={
          <span className="rounded-sm border border-white/18 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-white/80">
            {isPast ? "Past session" : "Upcoming session"}
          </span>
        }
      />

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-14 md:px-8 md:py-20 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-10">
          <PlaceholderPanel
            aspect="aspect-[16/9]"
            caption="Speaker mid-session, seen from the back of the room"
          />

          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-white md:text-2xl">
              {copy.aboutHeading}
            </h2>

            <p className="max-w-prose text-sm font-light leading-relaxed text-white/70 md:text-[15.5px]">
              {event.description}
            </p>

            <p className="max-w-prose text-sm font-light leading-relaxed text-white/70 md:text-[15.5px]">
              {copy.aboutNote}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-white md:text-2xl">
              {copy.speakerHeading}
            </h2>

            <SpeakerCard
              name={event.speakerName}
              role={event.speakerRole}
              note={copy.speakerNote}
            />
          </div>
        </div>

        <SideRail>
          <SidePanel tone="gold" eyebrow={copy.detailsEyebrow}>
            <FactGrid facts={details} columns="stack" />

            {isPast ? (
              <p className="font-mono text-[9.5px] uppercase leading-relaxed tracking-[0.14em] text-white/45">
                This session has already run. Upcoming sessions are listed on the
                events page.
              </p>
            ) : (
              /**
               * §11.2 — inert. `registerHref` is `null` on every event because
               * no ticketing destination exists yet. A real `disabled`
               * `<button>` with `aria-disabled` and a stated reason, never a
               * link that goes nowhere. Populating `registerHref` in
               * `events-data.ts` turns it into a `<Link>` with no change here.
               */
              <>
                {event.registerHref === null ? (
                  <>
                    <button
                      type="button"
                      disabled
                      aria-disabled="true"
                      className="w-full cursor-not-allowed rounded-sm border border-white/12 px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35"
                    >
                      Register to attend
                    </button>

                    <p className="font-mono text-[9.5px] uppercase leading-relaxed tracking-[0.14em] text-white/40">
                      Registration opens soon — no booking destination is live
                      yet.
                    </p>
                  </>
                ) : (
                  <Link
                    href={event.registerHref}
                    className="inline-flex items-center justify-center rounded-sm border border-yellow-400 bg-yellow-400 px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.18em] text-black transition-colors hover:bg-yellow-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                  >
                    Register to attend
                  </Link>
                )}
              </>
            )}

            <Link
              href="/talent-lab/events"
              className="w-fit rounded-sm border-b border-white/25 pb-1 font-mono text-[10px] uppercase tracking-[0.16em] text-white transition-colors hover:border-yellow-400 hover:text-yellow-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
            >
              All events <span aria-hidden="true">→</span>
            </Link>
          </SidePanel>

          <SidePanel eyebrow={copy.accessEyebrow}>
            <p className="text-[13.5px] font-light leading-relaxed text-white/70">
              {copy.accessNote}{" "}
              <a
                href={`mailto:${talentLabEdition.contactEmail}`}
                className="rounded-sm text-yellow-400 underline underline-offset-4 transition-colors hover:text-yellow-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
              >
                {talentLabEdition.contactEmail}
              </a>
              .
            </p>
          </SidePanel>
        </SideRail>
      </section>
    </div>
  );
}
