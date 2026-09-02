import type { FestivalMonth, Screening } from "../lib/types";

/**
 * NO LONGER READ BY THE SITE.
 *
 * The Festivals page is driven by cms-hub — see `lib/festival-api.ts`. This
 * file is kept only as the source of truth for
 * `cms-hub/backend/scripts/seed-festivals.ts`, which imports an inlined copy of
 * this data to populate the database once. Editing it changes nothing on the
 * website; edit the festivals in the CMS instead.
 *
 * The original header follows.
 *
 * The festival schedule: month -> festival -> screenings.
 *
 * CONTENT EDITOR NOTES
 * --------------------
 * - Two festivals per month is the house pattern, not a rule the UI enforces.
 *   A month renders however many festivals it holds.
 * - A month with `status: "coming-soon"` MUST have an empty `festivals` array.
 *   The locked panel exists so unannounced programming stays unannounced.
 * - `posterUrl` must be either a real CloudFront URL or `null`. Never invent a
 *   CloudFront path; `null` draws a typographic poster, a fabricated URL draws
 *   a broken image.
 * - Every displayed date, count and range is derived in `festival-utils.ts`.
 *   Add a screening here and the counts, day groups and ranges follow.
 * - Only "The Arab" and "High Rollers" reference real film artwork and real
 *   trailers. Everything else is a clearly-fictional placeholder awaiting real
 *   programming.
 */

const CF = "https://dhbdzeb2cbayq.cloudfront.net";

const crossings: Screening[] = [
  {
    id: "the-arab",
    title: "The Arab",
    posterUrl: `${CF}/iffa/images/THE-ARAB.jpg`,
    country: "Oman",
    year: 2026,
    genre: "Drama",
    runtimeMinutes: 106,
    synopsis:
      "Haroun is an old bachelor who has been living in Oran for several years, quietly navigating the tensions of identity, belonging, and the passage of time.",
    trailerUrl: "https://youtu.be/kk3jGmIcFi0",
    date: "2026-08-07",
    time: "7:30 PM",
    venue: "Main Theatre",
    seatStatus: "limited",
  },
  {
    id: "monsoon-ledger",
    title: "Monsoon Ledger",
    posterUrl: null,
    country: "India",
    year: 2026,
    genre: "Drama",
    runtimeMinutes: 134,
    synopsis:
      "A small-town accountant keeps two sets of books: one for the mill that employs her village, and one for herself. The rains arrive early and both come due.",
    date: "2026-08-07",
    time: "8:00 PM",
    venue: "Cinema Two",
    seatStatus: "available",
  },
  {
    id: "rainforest-hours",
    title: "Rainforest Hours",
    posterUrl: null,
    country: "Malaysia",
    year: 2025,
    genre: "Documentary",
    runtimeMinutes: 88,
    synopsis:
      "Shot across a single wet season, a portrait of the rangers, loggers and researchers who share one forest and agree on almost nothing.",
    date: "2026-08-08",
    time: "4:30 PM",
    venue: "Docklands Screen",
    seatStatus: "available",
  },
  {
    id: "salt-and-cinder",
    title: "Salt and Cinder",
    posterUrl: null,
    country: "Spain",
    year: 2026,
    genre: "Drama",
    runtimeMinutes: 110,
    synopsis:
      "Two sisters running a failing salt flat disagree about whether to sell. The summer, and the buyer, refuse to wait for them to decide.",
    date: "2026-08-08",
    time: "7:00 PM",
    venue: "Main Theatre",
    seatStatus: "sold-out",
  },
  {
    id: "sands-of-qurayyat",
    title: "Sands of Qurayyat",
    posterUrl: null,
    country: "Oman",
    year: 2025,
    genre: "Drama",
    runtimeMinutes: 98,
    synopsis:
      "A retired fisherman returns to the village he left forty years ago and finds the coastline, and his family's memory of him, entirely rewritten.",
    date: "2026-08-09",
    time: "6:00 PM",
    venue: "Federation Hall",
    seatStatus: "available",
  },
];

const nightFrequencies: Screening[] = [
  {
    id: "tin-roof-radio",
    title: "Tin Roof Radio",
    posterUrl: null,
    country: "India",
    year: 2026,
    genre: "Comedy / Drama",
    runtimeMinutes: 108,
    synopsis:
      "An unlicensed community radio station broadcast from a rooftop becomes the only place a neighbourhood will admit what it actually thinks.",
    date: "2026-08-21",
    time: "6:15 PM",
    venue: "Cinema Two",
    seatStatus: "available",
  },
  {
    id: "high-rollers",
    title: "High Rollers",
    posterUrl: `${CF}/iffa/images/high-rollers.jpg`,
    country: "Oman",
    year: 2026,
    genre: "Action / Thriller",
    runtimeMinutes: 102,
    synopsis:
      "In a world where every gamble could be your last, master thief Mason must outwit merciless foes and the law to save the woman he loves. A high-stakes heist thriller that pits greed, loyalty, and courage against impossible odds.",
    trailerUrl: "https://www.youtube.com/watch?v=NhaXDfYundI",
    date: "2026-08-21",
    time: "8:00 PM",
    venue: "Main Theatre",
    seatStatus: "limited",
  },
  {
    id: "night-market-tapes",
    title: "The Night Market Tapes",
    posterUrl: null,
    country: "Malaysia",
    year: 2025,
    genre: "Music Documentary",
    runtimeMinutes: 79,
    synopsis:
      "A cassette seller's forty-year archive of night-market performances turns out to be the only surviving recording of an entire local music scene.",
    date: "2026-08-22",
    time: "7:00 PM",
    venue: "Riverside Pavilion",
    seatStatus: "available",
  },
  {
    id: "chandni-crossing",
    title: "Chandni Crossing",
    posterUrl: null,
    country: "India",
    year: 2026,
    genre: "Thriller",
    runtimeMinutes: 119,
    synopsis:
      "A traffic constable at the city's busiest junction recognises the same car passing every night at 3am, and starts keeping a record nobody asked for.",
    date: "2026-08-22",
    time: "9:30 PM",
    venue: "Main Theatre",
    seatStatus: "limited",
  },
  {
    id: "last-tram-to-gracia",
    title: "The Last Tram to Gracia",
    posterUrl: null,
    country: "Spain",
    year: 2025,
    genre: "Drama",
    runtimeMinutes: 97,
    synopsis:
      "On the final night of a decommissioned tram line, the driver takes a route that is no longer on any timetable.",
    date: "2026-08-23",
    time: "5:45 PM",
    venue: "Docklands Screen",
    seatStatus: "sold-out",
  },
];

const inheritedGround: Screening[] = [
  {
    id: "kampung-static",
    title: "Kampung Static",
    posterUrl: null,
    country: "Malaysia",
    year: 2026,
    genre: "Drama",
    runtimeMinutes: 101,
    synopsis:
      "When the village finally gets reliable internet, a family that has spent a decade apart has to work out what they still have to say to each other.",
    date: "2026-09-04",
    time: "6:30 PM",
    venue: "Main Theatre",
    seatStatus: "available",
  },
  {
    id: "harbour-lights",
    title: "Harbour Lights",
    posterUrl: null,
    country: "Oman",
    year: 2026,
    genre: "Drama",
    runtimeMinutes: 112,
    synopsis:
      "A night-shift port controller starts logging the ships that never arrive, and slowly convinces an entire town that something is being hidden from them.",
    date: "2026-09-04",
    time: "9:00 PM",
    venue: "Cinema Two",
    seatStatus: "limited",
  },
  {
    id: "kite-makers-daughter",
    title: "The Kite Maker's Daughter",
    posterUrl: null,
    country: "India",
    year: 2025,
    genre: "Family Drama",
    runtimeMinutes: 96,
    synopsis:
      "The last kite maker on the street wants to close the workshop. His daughter has already entered it in a competition he does not know about.",
    date: "2026-09-05",
    time: "4:00 PM",
    venue: "Riverside Pavilion",
    seatStatus: "available",
  },
  {
    id: "verano-interrumpido",
    title: "Verano Interrumpido",
    posterUrl: null,
    country: "Spain",
    year: 2026,
    genre: "Drama",
    runtimeMinutes: 103,
    synopsis:
      "A family holiday is cut short by a phone call nobody will repeat out loud, and the drive home takes the rest of the film.",
    date: "2026-09-05",
    time: "7:30 PM",
    venue: "Main Theatre",
    seatStatus: "available",
  },
  {
    id: "just-one-more",
    title: "Just One More",
    posterUrl: null,
    country: "Oman",
    year: 2025,
    genre: "Comedy",
    runtimeMinutes: 91,
    synopsis:
      "Two estranged brothers agree to one last late-night drive across the interior, and spend the entire journey failing to say the one thing that matters.",
    date: "2026-09-06",
    time: "6:00 PM",
    venue: "Federation Hall",
    seatStatus: "limited",
  },
];

const theLongWayHome: Screening[] = [
  {
    id: "nine-hours-to-nagpur",
    title: "Nine Hours to Nagpur",
    posterUrl: null,
    country: "India",
    year: 2026,
    genre: "Road Drama",
    runtimeMinutes: 127,
    synopsis:
      "Four strangers share a long-distance sleeper carriage and discover, somewhere past midnight, that they are all travelling to the same funeral.",
    date: "2026-09-18",
    time: "7:30 PM",
    venue: "Main Theatre",
    seatStatus: "available",
  },
  {
    id: "frankincense-road",
    title: "The Frankincense Road",
    posterUrl: null,
    country: "Oman",
    year: 2025,
    genre: "Documentary",
    runtimeMinutes: 84,
    synopsis:
      "A documentary crew follows the last three families still harvesting frankincense by hand, and the buyers who have never once visited the trees.",
    date: "2026-09-19",
    time: "4:15 PM",
    venue: "Docklands Screen",
    seatStatus: "available",
  },
  {
    id: "straits-of-return",
    title: "Straits of Return",
    posterUrl: null,
    country: "Malaysia",
    year: 2026,
    genre: "Drama",
    runtimeMinutes: 116,
    synopsis:
      "A shipping clerk inherits a half-finished house on the other side of the water and a set of instructions she is not sure she wants to follow.",
    date: "2026-09-19",
    time: "6:45 PM",
    venue: "Cinema Two",
    seatStatus: "limited",
  },
  {
    id: "where-the-wadi-turns",
    title: "Where the Wadi Turns",
    posterUrl: null,
    country: "Oman",
    year: 2026,
    genre: "Drama",
    runtimeMinutes: 105,
    synopsis:
      "After a flash flood redraws the valley, a schoolteacher must decide whether to rebuild in the same place or lead her students somewhere new.",
    date: "2026-09-20",
    time: "7:00 PM",
    venue: "Main Theatre",
    seatStatus: "sold-out",
  },
];

export const festivalMonths: FestivalMonth[] = [
  {
    id: "2026-08",
    month: 8,
    year: 2026,
    status: "announced",
    festivals: [
      {
        slug: "crossings",
        edition: "01",
        name: "Crossings",
        tagline: "Departures, returns, and the distance between",
        description:
          "The opening festival of the 2026 series gathers five films about leaving and arriving — a bachelor in Oran, an accountant keeping two sets of books, a forest four groups of people cannot agree on. Three nights across four countries.",
        heroImage: `${CF}/iffa/images/Australia/great-ocean-road.webp`,
        city: "Melbourne",
        startDate: "2026-08-07",
        endDate: "2026-08-09",
        screenings: crossings,
      },
      {
        slug: "night-frequencies",
        edition: "02",
        name: "Night Frequencies",
        tagline: "Sound, signal and the small hours",
        description:
          "Late-programme cinema built around what people say when they think nobody is listening: a rooftop radio station, a heist that runs on nerve, and forty years of night-market tapes nobody thought to archive.",
        heroImage: `${CF}/iffa/images/Australia/melbourne.webp`,
        city: "Melbourne",
        startDate: "2026-08-21",
        endDate: "2026-08-23",
        screenings: nightFrequencies,
      },
    ],
  },
  {
    id: "2026-09",
    month: 9,
    year: 2026,
    status: "announced",
    festivals: [
      {
        slug: "inherited-ground",
        edition: "01",
        name: "Inherited Ground",
        tagline: "Land, family, and everything handed down",
        description:
          "Five films about what a family passes on whether or not anyone wants it — a workshop, a port, a half-finished summer. Screening across three nights in the Melbourne CBD and Southbank.",
        heroImage: `${CF}/iffa/images/Australia/daintree-rainforest.webp`,
        city: "Melbourne",
        startDate: "2026-09-04",
        endDate: "2026-09-06",
        screenings: inheritedGround,
      },
      {
        slug: "the-long-way-home",
        edition: "02",
        name: "The Long Way Home",
        tagline: "Journeys that take longer than the road",
        description:
          "The September closing festival follows four journeys that refuse to end where they were meant to: a sleeper carriage past midnight, a frankincense route, a crossing, and a valley redrawn overnight.",
        heroImage: `${CF}/iffa/images/Australia/gold-coast.webp`,
        city: "Melbourne",
        startDate: "2026-09-18",
        endDate: "2026-09-20",
        screenings: theLongWayHome,
      },
    ],
  },
  {
    id: "2026-10",
    month: 10,
    year: 2026,
    status: "coming-soon",
    festivals: [],
    note: "More festivals and screening schedules will be announced soon. Programming is published roughly four weeks ahead of each festival weekend.",
  },
];
