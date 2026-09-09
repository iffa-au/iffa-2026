import Image from "next/image";
import Link from "next/link";

import type { Festival, FestivalPageSettings } from "../../lib/types";
import {
  countFestivalDays,
  festivalCountries,
  formatFestivalDates,
  groupScreeningsByDay,
} from "../../lib/festival-utils";
import { festivalFontClass } from "../../lib/festival-fonts";
import { FestivalBreadcrumb } from "../components/festival-breadcrumb";
import { ProgrammeSection } from "../components/programme-section";

/**
 * A festival that has already run.
 *
 * Deliberately not the main page in miniature: no beam, no countdown, no reel.
 * A past festival is a record, so it is set as one — the artwork, what it was,
 * and the programme exactly as it ran. The one piece of the live page it does
 * reuse is the printed programme, because "what screened, when" is the same
 * question whether the festival is next month or three years ago.
 *
 * This route exists so links shared while a festival was current keep working
 * after it stops being the festival the site is about.
 */
export function FestivalArchivePage({
  festival,
  settings,
}: {
  festival: Festival;
  settings: FestivalPageSettings;
}) {
  const days = groupScreeningsByDay(festival);
  const countries = festivalCountries(festival);
  const nights = countFestivalDays(festival);

  const facts = [
    { label: "Dates", value: formatFestivalDates(festival) },
    {
      label: festival.screenings.length === 1 ? "Film" : "Films",
      value: String(festival.screenings.length),
    },
    { label: nights === 1 ? "Night" : "Nights", value: String(nights) },
    { label: "City", value: festival.city || settings.city },
  ];

  return (
    <div className={`${festivalFontClass} relative bg-fest-room`}>
      <section className="mx-auto max-w-[1400px] px-5 pt-10 md:px-10 md:pt-14">
        <FestivalBreadcrumb
          crumbs={[
            { label: "Home", href: "/" },
            { label: "Festival", href: "/festivals" },
            { label: `${festival.year}` },
          ]}
        />

        <p className="font-fest-text text-base italic text-fest-lamp/80">
          Previous edition
        </p>

        <h1 className="mt-4 flex flex-wrap items-baseline gap-x-6 gap-y-1">
          <span className="font-fest-display text-[clamp(4rem,14vw,11rem)] font-extrabold leading-[0.8] tracking-[-0.02em] text-fest-beam">
            {festival.year}
          </span>
          <span className="font-fest-text text-[clamp(1.25rem,3vw,2.25rem)] italic leading-tight text-fest-beam/80">
            {festival.name}
          </span>
        </h1>

        {festival.heroImage && (
          <div className="relative mt-10 aspect-[16/9] overflow-hidden border border-fest-beam/10 lg:aspect-[21/9]">
            <Image
              src={festival.heroImage}
              alt=""
              aria-hidden
              fill
              priority
              sizes="(max-width: 1400px) 100vw, 1400px"
              className="object-cover opacity-85"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(to_top,var(--color-fest-room),transparent_55%)]"
            />
          </div>
        )}

        <div className="mt-12 grid gap-10 border-t border-fest-beam/12 pt-10 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:gap-16">
          <div>
            {festival.tagline && (
              <p className="font-fest-text text-xl italic leading-snug text-fest-lamp/85 md:text-2xl">
                {festival.tagline}
              </p>
            )}
            {festival.description && (
              <p className="mt-6 max-w-[62ch] font-fest-text text-[1.0625rem] leading-[1.72] text-fest-beam/70 md:text-lg">
                {festival.description}
              </p>
            )}
          </div>

          <dl className="grid grid-cols-2 gap-x-8 gap-y-7 self-start">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt className="font-fest-text text-sm italic text-fest-lamp/75">
                  {fact.label}
                </dt>
                <dd className="mt-2 font-fest-text text-base text-fest-beam/85">
                  {fact.value}
                </dd>
              </div>
            ))}
            {countries.length > 0 && (
              <div className="col-span-2">
                <dt className="font-fest-text text-sm italic text-fest-lamp/75">
                  {countries.length === 1 ? "Country" : "Countries"}
                </dt>
                <dd className="mt-2 font-fest-text text-base text-fest-beam/85">
                  {countries.join(", ")}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </section>

      <div className="mt-16 md:mt-24">
        {days.length > 0 ? (
          <ProgrammeSection
            days={days}
            heading="The programme, as it ran"
            intro={`Every film that screened at ${festival.name}, night by night.`}
            note="This festival has closed. Times and venues are how it ran."
          />
        ) : (
          <section className="bg-fest-stock py-20 text-fest-ink md:py-24">
            <div className="mx-auto max-w-[1400px] px-5 md:px-10">
              <h2 className="font-fest-display text-[clamp(2rem,5vw,3.5rem)] font-extrabold uppercase leading-[0.9]">
                No programme on record
              </h2>
              <p className="mt-6 max-w-[52ch] font-fest-text text-lg leading-[1.65] text-fest-ink/70">
                This edition ran before the site kept its schedule, so the films
                that screened are not listed here.
              </p>
            </div>
          </section>
        )}
      </div>

      <section className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
        <Link
          href="/festivals"
          className="inline-flex items-center border border-fest-beam/25 px-9 py-4 font-fest-display text-sm font-bold uppercase tracking-[0.16em] text-fest-beam transition-colors duration-300 hover:border-fest-lamp hover:text-fest-lamp focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fest-lamp"
        >
          This year&rsquo;s festival
        </Link>
      </section>
    </div>
  );
}
