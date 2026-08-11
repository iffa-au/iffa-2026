import type { ScreeningCountry } from "../lib/types";

/**
 * Screening schedule: country -> night -> films -> showtimes.
 *
 * CONTENT EDITOR NOTES
 * --------------------
 * - Night counts intentionally differ between countries. The night rail is
 *   derived from `country.nights`, so adding or removing a night here is all
 *   that is required — no UI change.
 * - `posterUrl` must be either a real CloudFront URL or "/fallbacks/no-poster.svg".
 *   Never invent a CloudFront path; a fabricated URL renders as a broken image.
 * - Only the two films below have real posters and real trailers. They are the
 *   only real film assets available to this project today. Everything else is a
 *   clearly-fictional placeholder awaiting real programming.
 */

const CF = "https://dhbdzeb2cbayq.cloudfront.net";
const NO_POSTER = "/fallbacks/no-poster.svg";

export const screeningCountries: ScreeningCountry[] = [
  {
    code: "oman",
    name: "Oman",
    nights: [
      {
        id: "oman-opening-night",
        label: "Opening Night",
        date: "2026-08-20",
        films: [
          {
            id: "oman-the-arab",
            title: "The Arab",
            posterUrl: `${CF}/iffa/images/THE-ARAB.jpg`,
            runtimeMinutes: 106,
            screeningDate: "2026-08-20",
            genre: "Drama",
            synopsis:
              "Haroun is an old bachelor who has been living in Oran for several years, quietly navigating the tensions of identity, belonging, and the passage of time.",
            trailerUrl: "https://youtu.be/kk3jGmIcFi0",
            showtimes: [
              {
                id: "oman-the-arab-1",
                time: "6:30 PM",
                venue: "Main Theatre",
                seatStatus: "available",
              },
              {
                id: "oman-the-arab-2",
                time: "8:45 PM",
                venue: "Cinema Two",
                seatStatus: "limited",
              },
              {
                id: "oman-the-arab-3",
                time: "10:15 PM",
                venue: "Docklands Screen",
                seatStatus: "sold-out",
              },
            ],
          },
          {
            id: "oman-high-rollers",
            title: "High Rollers",
            posterUrl: `${CF}/iffa/images/high-rollers.jpg`,
            runtimeMinutes: 102,
            screeningDate: "2026-08-20",
            genre: "Action / Thriller",
            synopsis:
              "In a world where every gamble could be your last, master thief Mason must outwit merciless foes and the law to save the woman he loves. A high-stakes heist thriller that pits greed, loyalty, and courage against impossible odds.",
            trailerUrl: "https://www.youtube.com/watch?v=NhaXDfYundI",
            showtimes: [
              {
                id: "oman-high-rollers-1",
                time: "7:00 PM",
                venue: "Federation Hall",
                seatStatus: "limited",
              },
              {
                id: "oman-high-rollers-2",
                time: "9:30 PM",
                venue: "Main Theatre",
                seatStatus: "available",
              },
            ],
          },
        ],
      },
      {
        id: "oman-night-2",
        label: "Night 2",
        date: "2026-08-21",
        films: [
          {
            id: "oman-sands-of-qurayyat",
            title: "Sands of Qurayyat",
            posterUrl: NO_POSTER,
            runtimeMinutes: 98,
            screeningDate: "2026-08-21",
            genre: "Drama",
            synopsis:
              "A retired fisherman returns to the village he left forty years ago and finds the coastline, and his family's memory of him, entirely rewritten.",
            showtimes: [
              {
                id: "oman-sands-1",
                time: "5:45 PM",
                venue: "Cinema Two",
                seatStatus: "available",
              },
              {
                id: "oman-sands-2",
                time: "8:00 PM",
                venue: "Riverside Pavilion",
                seatStatus: "limited",
              },
            ],
          },
          {
            id: "oman-just-one-more",
            title: "Just One More",
            posterUrl: NO_POSTER,
            runtimeMinutes: 91,
            screeningDate: "2026-08-21",
            genre: "Comedy",
            synopsis:
              "Two estranged brothers agree to one last late-night drive across the interior, and spend the entire journey failing to say the one thing that matters.",
            showtimes: [
              {
                id: "oman-just-one-more-1",
                time: "6:15 PM",
                venue: "Docklands Screen",
                seatStatus: "available",
              },
              {
                id: "oman-just-one-more-2",
                time: "9:00 PM",
                venue: "Main Theatre",
                seatStatus: "sold-out",
              },
              {
                id: "oman-just-one-more-3",
                time: "10:30 PM",
                venue: "Cinema Two",
                seatStatus: "available",
              },
            ],
          },
        ],
      },
      {
        id: "oman-night-3",
        label: "Night 3",
        date: "2026-08-22",
        films: [
          {
            id: "oman-frankincense-road",
            title: "The Frankincense Road",
            posterUrl: NO_POSTER,
            runtimeMinutes: 84,
            screeningDate: "2026-08-22",
            genre: "Documentary",
            synopsis:
              "A documentary crew follows the last three families still harvesting frankincense by hand, and the buyers who have never once visited the trees.",
            showtimes: [
              {
                id: "oman-frankincense-1",
                time: "4:30 PM",
                venue: "Federation Hall",
                seatStatus: "available",
              },
              {
                id: "oman-frankincense-2",
                time: "7:15 PM",
                venue: "Riverside Pavilion",
                seatStatus: "limited",
              },
            ],
          },
        ],
      },
      {
        id: "oman-night-4",
        label: "Night 4",
        date: "2026-08-23",
        films: [
          {
            id: "oman-harbour-lights",
            title: "Harbour Lights",
            posterUrl: NO_POSTER,
            runtimeMinutes: 112,
            screeningDate: "2026-08-23",
            genre: "Drama",
            synopsis:
              "A night-shift port controller starts logging the ships that never arrive, and slowly convinces an entire town that something is being hidden from them.",
            showtimes: [
              {
                id: "oman-harbour-1",
                time: "6:00 PM",
                venue: "Main Theatre",
                seatStatus: "limited",
              },
              {
                id: "oman-harbour-2",
                time: "8:30 PM",
                venue: "Cinema Two",
                seatStatus: "available",
              },
            ],
          },
        ],
      },
      {
        id: "oman-closing-night",
        label: "Closing Night",
        date: "2026-08-24",
        films: [
          {
            id: "oman-where-the-wadi-turns",
            title: "Where the Wadi Turns",
            posterUrl: NO_POSTER,
            runtimeMinutes: 105,
            screeningDate: "2026-08-24",
            genre: "Drama",
            synopsis:
              "After a flash flood redraws the valley, a schoolteacher must decide whether to rebuild in the same place or lead her students somewhere new.",
            showtimes: [
              {
                id: "oman-wadi-1",
                time: "7:30 PM",
                venue: "Main Theatre",
                seatStatus: "sold-out",
              },
              {
                id: "oman-wadi-2",
                time: "9:45 PM",
                venue: "Federation Hall",
                seatStatus: "limited",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    code: "india",
    name: "India",
    nights: [
      {
        id: "india-opening-night",
        label: "Opening Night",
        date: "2026-08-21",
        films: [
          {
            id: "india-monsoon-ledger",
            title: "Monsoon Ledger",
            posterUrl: NO_POSTER,
            runtimeMinutes: 134,
            screeningDate: "2026-08-21",
            genre: "Drama",
            synopsis:
              "A small-town accountant keeps two sets of books: one for the mill that employs her village, and one for herself. The rains arrive early and both come due.",
            showtimes: [
              {
                id: "india-monsoon-1",
                time: "6:00 PM",
                venue: "Main Theatre",
                seatStatus: "available",
              },
              {
                id: "india-monsoon-2",
                time: "9:00 PM",
                venue: "Docklands Screen",
                seatStatus: "limited",
              },
            ],
          },
          {
            id: "india-tin-roof-radio",
            title: "Tin Roof Radio",
            posterUrl: NO_POSTER,
            runtimeMinutes: 108,
            screeningDate: "2026-08-21",
            genre: "Comedy / Drama",
            synopsis:
              "An unlicensed community radio station broadcast from a rooftop becomes the only place a neighbourhood will admit what it actually thinks.",
            showtimes: [
              {
                id: "india-tin-roof-1",
                time: "5:30 PM",
                venue: "Cinema Two",
                seatStatus: "available",
              },
              {
                id: "india-tin-roof-2",
                time: "8:15 PM",
                venue: "Riverside Pavilion",
                seatStatus: "available",
              },
              {
                id: "india-tin-roof-3",
                time: "10:45 PM",
                venue: "Federation Hall",
                seatStatus: "sold-out",
              },
            ],
          },
        ],
      },
      {
        id: "india-night-2",
        label: "Night 2",
        date: "2026-08-22",
        films: [
          {
            id: "india-chandni-crossing",
            title: "Chandni Crossing",
            posterUrl: NO_POSTER,
            runtimeMinutes: 119,
            screeningDate: "2026-08-22",
            genre: "Thriller",
            synopsis:
              "A traffic constable at the city's busiest junction recognises the same car passing every night at 3am, and starts keeping a record nobody asked for.",
            showtimes: [
              {
                id: "india-chandni-1",
                time: "7:00 PM",
                venue: "Main Theatre",
                seatStatus: "limited",
              },
              {
                id: "india-chandni-2",
                time: "9:30 PM",
                venue: "Cinema Two",
                seatStatus: "available",
              },
            ],
          },
        ],
      },
      {
        id: "india-night-3",
        label: "Night 3",
        date: "2026-08-24",
        films: [
          {
            id: "india-kite-makers-daughter",
            title: "The Kite Maker's Daughter",
            posterUrl: NO_POSTER,
            runtimeMinutes: 96,
            screeningDate: "2026-08-24",
            genre: "Family Drama",
            synopsis:
              "The last kite maker on the street wants to close the workshop. His daughter has already entered it in a competition he does not know about.",
            showtimes: [
              {
                id: "india-kite-1",
                time: "4:00 PM",
                venue: "Riverside Pavilion",
                seatStatus: "available",
              },
              {
                id: "india-kite-2",
                time: "6:45 PM",
                venue: "Docklands Screen",
                seatStatus: "limited",
              },
            ],
          },
        ],
      },
      {
        id: "india-closing-night",
        label: "Closing Night",
        date: "2026-08-25",
        films: [
          {
            id: "india-nine-hours-to-nagpur",
            title: "Nine Hours to Nagpur",
            posterUrl: NO_POSTER,
            runtimeMinutes: 127,
            screeningDate: "2026-08-25",
            genre: "Road Drama",
            synopsis:
              "Four strangers share a long-distance sleeper carriage and discover, somewhere past midnight, that they are all travelling to the same funeral.",
            showtimes: [
              {
                id: "india-nagpur-1",
                time: "7:15 PM",
                venue: "Main Theatre",
                seatStatus: "limited",
              },
              {
                id: "india-nagpur-2",
                time: "10:00 PM",
                venue: "Federation Hall",
                seatStatus: "sold-out",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    code: "malaysia",
    name: "Malaysia",
    nights: [
      {
        id: "malaysia-opening-night",
        label: "Opening Night",
        date: "2026-08-22",
        films: [
          {
            id: "malaysia-rainforest-hours",
            title: "Rainforest Hours",
            posterUrl: NO_POSTER,
            runtimeMinutes: 88,
            screeningDate: "2026-08-22",
            genre: "Documentary",
            synopsis:
              "Shot across a single wet season, a portrait of the rangers, loggers and researchers who share one forest and agree on almost nothing.",
            showtimes: [
              {
                id: "malaysia-rainforest-1",
                time: "5:00 PM",
                venue: "Docklands Screen",
                seatStatus: "available",
              },
              {
                id: "malaysia-rainforest-2",
                time: "7:45 PM",
                venue: "Cinema Two",
                seatStatus: "available",
              },
            ],
          },
        ],
      },
      {
        id: "malaysia-night-2",
        label: "Night 2",
        date: "2026-08-23",
        films: [
          {
            id: "malaysia-kampung-static",
            title: "Kampung Static",
            posterUrl: NO_POSTER,
            runtimeMinutes: 101,
            screeningDate: "2026-08-23",
            genre: "Drama",
            synopsis:
              "When the village finally gets reliable internet, a family that has spent a decade apart has to work out what they still have to say to each other.",
            showtimes: [
              {
                id: "malaysia-kampung-1",
                time: "6:30 PM",
                venue: "Main Theatre",
                seatStatus: "limited",
              },
              {
                id: "malaysia-kampung-2",
                time: "9:15 PM",
                venue: "Riverside Pavilion",
                seatStatus: "available",
              },
            ],
          },
          {
            id: "malaysia-night-market-tapes",
            title: "The Night Market Tapes",
            posterUrl: NO_POSTER,
            runtimeMinutes: 79,
            screeningDate: "2026-08-23",
            genre: "Music Documentary",
            synopsis:
              "A cassette seller's forty-year archive of night-market performances turns out to be the only surviving recording of an entire local music scene.",
            showtimes: [
              {
                id: "malaysia-tapes-1",
                time: "8:00 PM",
                venue: "Federation Hall",
                seatStatus: "available",
              },
              {
                id: "malaysia-tapes-2",
                time: "10:30 PM",
                venue: "Docklands Screen",
                seatStatus: "sold-out",
              },
            ],
          },
        ],
      },
      {
        id: "malaysia-closing-night",
        label: "Closing Night",
        date: "2026-08-25",
        films: [
          {
            id: "malaysia-straits-of-return",
            title: "Straits of Return",
            posterUrl: NO_POSTER,
            runtimeMinutes: 116,
            screeningDate: "2026-08-25",
            genre: "Drama",
            synopsis:
              "A shipping clerk inherits a half-finished house on the other side of the water and a set of instructions she is not sure she wants to follow.",
            showtimes: [
              {
                id: "malaysia-straits-1",
                time: "7:00 PM",
                venue: "Main Theatre",
                seatStatus: "available",
              },
              {
                id: "malaysia-straits-2",
                time: "9:45 PM",
                venue: "Cinema Two",
                seatStatus: "limited",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    code: "spain",
    name: "Spain",
    nights: [
      {
        id: "spain-opening-night",
        label: "Opening Night",
        date: "2026-08-23",
        films: [
          {
            id: "spain-salt-and-cinder",
            title: "Salt and Cinder",
            posterUrl: NO_POSTER,
            runtimeMinutes: 110,
            screeningDate: "2026-08-23",
            genre: "Drama",
            synopsis:
              "Two sisters running a failing salt flat disagree about whether to sell. The summer, and the buyer, refuse to wait for them to decide.",
            showtimes: [
              {
                id: "spain-salt-1",
                time: "6:45 PM",
                venue: "Federation Hall",
                seatStatus: "available",
              },
              {
                id: "spain-salt-2",
                time: "9:00 PM",
                venue: "Main Theatre",
                seatStatus: "limited",
              },
            ],
          },
        ],
      },
      {
        id: "spain-night-2",
        label: "Night 2",
        date: "2026-08-25",
        films: [
          {
            id: "spain-last-tram-to-gracia",
            title: "The Last Tram to Gracia",
            posterUrl: NO_POSTER,
            runtimeMinutes: 97,
            screeningDate: "2026-08-25",
            genre: "Drama",
            synopsis:
              "On the final night of a decommissioned tram line, the driver takes a route that is no longer on any timetable.",
            showtimes: [
              {
                id: "spain-tram-1",
                time: "5:15 PM",
                venue: "Cinema Two",
                seatStatus: "available",
              },
              {
                id: "spain-tram-2",
                time: "8:30 PM",
                venue: "Riverside Pavilion",
                seatStatus: "sold-out",
              },
            ],
          },
        ],
      },
      {
        id: "spain-closing-night",
        label: "Closing Night",
        date: "2026-08-26",
        films: [
          {
            id: "spain-verano-interrumpido",
            title: "Verano Interrumpido",
            posterUrl: NO_POSTER,
            runtimeMinutes: 103,
            screeningDate: "2026-08-26",
            genre: "Drama",
            synopsis:
              "A family holiday is cut short by a phone call nobody will repeat out loud, and the drive home takes the rest of the film.",
            showtimes: [
              {
                id: "spain-verano-1",
                time: "7:30 PM",
                venue: "Main Theatre",
                seatStatus: "limited",
              },
              {
                id: "spain-verano-2",
                time: "10:00 PM",
                venue: "Docklands Screen",
                seatStatus: "available",
              },
            ],
          },
        ],
      },
    ],
  },
];
