import type { Festival, FestivalPageSettings, FestivalPhase } from "../../lib/types";
import { groupScreeningsByDay } from "../../lib/festival-utils";
import { festivalFontClass } from "../../lib/festival-fonts";
import { ArchiveBand } from "../components/archive-band";
import { AwardPanel } from "../components/award-panel";
import { ClosingBand } from "../components/closing-band";
import { ProgrammeSection } from "../components/programme-section";
import { ProgrammeWaiting } from "../components/programme-waiting";
import { ProjectionHero } from "../components/projection-hero";
import { FestivalStatement } from "../components/festival-statement";

/**
 * The Festival page.
 *
 * IFFA runs one festival a year, so this is the whole section: there is no
 * index of festivals to browse and no separate detail page to click through to.
 * The order is the shape of an evening out — what it is, what it looks like,
 * what is on when, what it is for, and how to come.
 *
 *   hero        the room, and the year
 *   statement   what this festival is
 *   programme   every film, one section per night    <- the page inverts here
 *   award       what is being judged
 *   closing     venues and the invitation
 *   archive     previous editions
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
  const days = festival ? groupScreeningsByDay(festival) : [];

  // One note for every phase. The programme does not announce that a festival
  // has finished — see the matching note in opening-countdown.tsx.
  const programmeNote = settings.planBody;

  return (
    <div className={`${festivalFontClass} relative bg-fest-room`}>
      <ProjectionHero festival={festival} settings={settings} phase={phase} />

      <FestivalStatement festival={festival} settings={settings} />

      {days.length > 0 ? (
        <ProgrammeSection
          days={days}
          heading={settings.scheduleHeading}
          intro={settings.scheduleIntro}
          note={programmeNote}
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
