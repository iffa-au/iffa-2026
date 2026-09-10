import type { Festival, FestivalPageSettings, FestivalPhase } from "../../lib/types";
import { orderScreenings } from "../../lib/festival-utils";
import { festivalFontClass } from "../../lib/festival-fonts";
import { ArchiveBand } from "../components/archive-band";
import { AwardPanel } from "../components/award-panel";
import { ClosingBand } from "../components/closing-band";
import { ProgrammeSection } from "../components/programme-section";
import { ProgrammeWaiting } from "../components/programme-waiting";
import { ProjectionHero } from "../components/projection-hero";

/**
 * The Festival page.
 *
 * IFFA runs one festival a year, so this is the whole section: there is no
 * index of festivals to browse and no separate detail page to click through to.
 * The order is the shape of an evening out — what it looks like, what is on
 * when, what it is for, and how to come.
 *
 *   hero        the room, and the year
 *   programme   every session, one section each      <- the page inverts here
 *   award       what is being judged
 *   closing     the invitation
 *   archive     previous editions
 *
 * A statement section used to sit between the hero and the programme: this
 * year's description with counted-up facts beside it, then a standing "what
 * IFFA is" essay, a banner and three stats. The hero already names the year,
 * the dates and the city, and the programme below it is the real answer to
 * what the festival is, so the section was three screens of restatement that
 * pushed the schedule under the fold. It is gone along with the `about`
 * settings it read — schema, CMS inputs and stored field.
 *
 * A venue band used to close the page, above the invitation. It is gone —
 * every venue it listed is already on the screening that happens there. See
 * the note in `closing-band.tsx`. The booking line that sat under the
 * programme heading went with it — it was the same `planBody` setting — and
 * the slot it printed in has since been removed from `ProgrammeSection`.
 *
 * A horizontal reel of posters used to sit above the programme. It carried
 * exactly the films the programme carries, so every visitor scrolled past the
 * same schedule twice; it was cut rather than kept as decoration. Each film's
 * detail now lives on its own page instead of inside a card.
 *
 * Everything is a pure function of its props, including when `festival` is null
 * because nothing is published or the API was unreachable — the surrounding
 * sections still render, so the page is never a blank screen.
 */
export function FestivalPage({
  festival,
  archive,
  settings,
  phase,
}: {
  festival: Festival | null;
  archive: Festival[];
  settings: FestivalPageSettings;
  phase: FestivalPhase;
}) {
  const screenings = festival ? orderScreenings(festival) : [];

  return (
    <div className={`${festivalFontClass} relative bg-fest-room`}>
      <ProjectionHero festival={festival} settings={settings} phase={phase} />

      {screenings.length > 0 ? (
        <ProgrammeSection
          screenings={screenings}
          heading={settings.scheduleHeading}
          intro={settings.scheduleIntro}
        />
      ) : (
        <ProgrammeWaiting festival={festival} />
      )}

      <AwardPanel settings={settings} />

      <ClosingBand festival={festival} settings={settings} />

      <ArchiveBand festivals={archive} />
    </div>
  );
}
