import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar03Icon, Location01Icon } from "@hugeicons/core-free-icons";

import { festivalEdition } from "../../data/festival-edition";
import {
  learnTopics,
  masterclassIntro,
  masterclassSessions,
  masterclassSpeakers,
} from "../../data/masterclass-data";
import { FestivalBreadcrumb } from "../components/festival-breadcrumb";
import { LearnTopicCard } from "../components/learn-topic-card";
import { MasterclassSessionCard } from "../components/masterclass-session-card";
import { SpeakerCard } from "../components/speaker-card";

const SectionHeading = ({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) => (
  <header className="max-w-3xl">
    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-yellow-400">
      {eyebrow}
    </p>
    <h2 className="mt-3 text-2xl font-bold text-white md:text-3xl">{title}</h2>
    {description && (
      <p className="mt-3 max-w-prose text-sm leading-relaxed text-white/70 md:text-base">
        {description}
      </p>
    )}
  </header>
);

export function MasterclassPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-5 pt-12 md:px-8 md:pt-16">
        <FestivalBreadcrumb
          crumbs={[
            { label: "Home", href: "/" },
            { label: "Festivals", href: "/festivals" },
            { label: "Programs", href: "/festivals/programs" },
            { label: "Masterclass" },
          ]}
        />

        {/* Banner hero */}
        <section className="relative isolate flex min-h-[320px] flex-col justify-end overflow-hidden rounded-2xl border border-white/10 p-8 md:min-h-[420px] md:p-12">
          <Image
            src={festivalEdition.bannerImage}
            alt=""
            aria-hidden
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="-z-10 object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/80 to-black/30"
          />

          <h1 className="text-4xl font-bold uppercase tracking-tight text-white md:text-6xl">
            {masterclassIntro.heading}
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/80 md:text-base">
            {masterclassIntro.description}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/75">
            <span className="inline-flex items-center gap-2">
              <HugeiconsIcon icon={Calendar03Icon} size={16} color="#e6ba35" aria-hidden />
              {masterclassIntro.dateRange}
            </span>
            <span className="inline-flex items-center gap-2">
              <HugeiconsIcon icon={Location01Icon} size={16} color="#e6ba35" aria-hidden />
              {masterclassIntro.location}
            </span>
          </div>

          {/* Deliberately inert: registration has no destination yet. */}
          <div className="mt-8">
            <button
              type="button"
              disabled
              aria-disabled="true"
              aria-describedby="masterclass-register-note"
              className="w-full cursor-not-allowed rounded-md border border-yellow-400/60 bg-black/40 px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.22em] text-yellow-400/80 opacity-80 sm:w-auto"
            >
              Register Now
            </button>
            <p
              id="masterclass-register-note"
              className="mt-2.5 text-[11px] leading-relaxed text-white/55"
            >
              Registration opens soon.
            </p>
          </div>
        </section>
      </div>

      {/* Upcoming masterclasses */}
      <section className="mx-auto max-w-7xl px-5 pt-16 md:px-8 md:pt-24">
        <SectionHeading
          eyebrow="Programme"
          title="Upcoming Masterclasses"
          description="Four sessions across the festival week. Each runs once, with places capped so there is room to ask questions."
        />

        <div className="mt-8 grid gap-6 lg:grid-cols-2 md:mt-10">
          {masterclassSessions.map((session) => (
            <MasterclassSessionCard key={session.id} session={session} />
          ))}
        </div>
      </section>

      {/* Featured speakers */}
      <section className="mx-auto max-w-7xl px-5 pt-16 md:px-8 md:pt-24">
        <SectionHeading
          eyebrow="Who is teaching"
          title="Featured Speakers"
          description="Practitioners currently working in the industry, not full-time lecturers."
        />

        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 md:mt-10">
          {masterclassSpeakers.map((speaker) => (
            <SpeakerCard key={speaker.id} speaker={speaker} />
          ))}
        </div>
      </section>

      {/* What you'll learn */}
      <section className="mx-auto max-w-7xl px-5 pt-16 md:px-8 md:pt-24">
        <SectionHeading
          eyebrow="Outcomes"
          title="What You'll Learn"
          description="The four areas the programme covers, from the floor through to the meeting room."
        />

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 md:mt-10">
          {learnTopics.map((topic) => (
            <LearnTopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="mx-auto max-w-7xl px-5 pt-16 pb-20 md:px-8 md:pt-24 md:pb-28">
        <div className="rounded-2xl border border-yellow-300/30 bg-gradient-to-br from-[#5a4a1a] via-[#2a2514] to-[#0e0d0a] p-8 md:p-12">
          <h2 className="text-2xl font-bold text-white md:text-3xl">
            Masterclasses run alongside the screening programme
          </h2>
          <p className="mt-3 max-w-prose text-sm leading-relaxed text-white/80 md:text-base">
            Sessions are scheduled around the nightly screenings so you can attend both.
            Check the schedule before booking travel.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/festivals/screening"
              className="inline-flex items-center justify-center rounded-md border border-yellow-400/60 px-7 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-yellow-400 transition-colors duration-300 hover:bg-yellow-400 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
            >
              Screening Schedule
            </Link>
            <Link
              href="/festivals/programs"
              className="inline-flex items-center justify-center rounded-md border border-white/25 px-7 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition-colors duration-300 hover:border-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
            >
              All Programs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
