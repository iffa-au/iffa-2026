import { events } from "../../data/events-data";
import { pageCopy } from "../../data/talent-lab-edition";
import { partitionEvents } from "../../lib/filters";
import { EventCard } from "../components/event-card";
import { PageHeader } from "../components/page-header";
import { PageSection, TINTED } from "../components/page-section";

const copy = pageCopy.events;

/** Both lists come from one partition on `state` — neither is kept by hand. */
const { upcoming, past } = partitionEvents(events);

function BandHeading({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "gold" | "plain";
}) {
  return (
    <h2
      className={`font-mono text-[11px] uppercase tracking-[0.24em] ${
        tone === "gold" ? "text-yellow-400" : "text-white/60"
      }`}
    >
      {children}
    </h2>
  );
}

export function EventsPage() {
  return (
    <div className="bg-black text-white">
      <PageHeader
        crumbs={[
          { label: "Talent Lab", href: "/talent-lab" },
          { label: "Events & Masterclasses" },
        ]}
        title={copy.title}
        intro={copy.intro}
      />

      <PageSection bordered={false}>
        <BandHeading tone="gold">{copy.upcomingHeading}</BandHeading>

        {upcoming.length > 0 ? (
          <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {upcoming.map((event) => (
              <EventCard key={event.slug} event={event} />
            ))}
          </div>
        ) : (
          <p className="mt-6 max-w-prose text-sm font-light leading-relaxed text-white/60">
            {copy.noUpcoming}
          </p>
        )}
      </PageSection>

      <PageSection className={TINTED}>
        <BandHeading tone="plain">{copy.pastHeading}</BandHeading>

        <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {past.map((event) => (
            <EventCard key={event.slug} event={event} />
          ))}
        </div>
      </PageSection>
    </div>
  );
}
