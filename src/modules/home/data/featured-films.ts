export type FeaturedFilm = {
  id: number;
  badge: string;
  titlePart1: string;
  titlePart2: string;
  description: string;
  director: string;
  genre: string;
  runtime: string;
  country: string;
  posterUrl: string;
  trailerUrl: string;
};

const CF = "https://dhbdzeb2cbayq.cloudfront.net";

/**
 * The homepage's featured row.
 *
 * Transcribed by hand from the 2026 submissions in the CMS rather than fetched:
 * this section is editorial, and the API has no field for the parts the design
 * needs — the two-tone title split, the badge, or a genre short enough for the
 * metadata grid (GDN carries eight genre tags in the database).
 *
 * Every other field is the submission record verbatim. Poster paths keep their
 * spaces percent-encoded, because several films were uploaded to folders named
 * after the film rather than a slug.
 */
export const featuredFilms: FeaturedFilm[] = [
  {
    id: 1,
    badge: "Must Watch",
    titlePart1: "High",
    titlePart2: "Rollers",
    description:
      "In a world where every gamble could be your last, master thief Mason must outwit merciless foes and the law to save the woman he loves. A high-stakes heist thriller that pits greed, loyalty, and courage against impossible odds.",
    director: "Randall Emmett",
    genre: "Action / Thriller",
    runtime: "102 minutes",
    country: "United States",
    posterUrl: `${CF}/iffa/images/submissions-2026/high-rollers.jpg`,
    trailerUrl: "https://www.youtube.com/watch?v=NhaXDfYundI",
  },
  {
    id: 2,
    badge: "Official Selection",
    titlePart1: "Dhurandhar",
    titlePart2: "The Revenge",
    description:
      "Dhurandhar The Revenge introduces Jaskirat Singh Rangi, tracing the chain of events that compel him to become Hamza Ali Mazari, and follows his rise as he operates deep inside Pakistan.",
    director: "Aditya Dhar",
    genre: "Action",
    runtime: "98 minutes",
    country: "India",
    posterUrl: `${CF}/iffa/images/submissions-2026/Dhurandhar%20The%20Revenge/banners/Dhurandhar%20The%20Revenge.webp`,
    trailerUrl: "https://www.youtube.com/watch?v=NHk7scrb_9I",
  },
  {
    id: 3,
    badge: "Official Selection",
    titlePart1: "Down the Arm of",
    titlePart2: "God",
    description:
      "Inspired by true events, Down the Arm of God follows a young pastor through a harsh winter in a small Texas town where his mission to help the homeless is faced with resistance by his congregation, exposing deep-seated prejudices and systemic failures.",
    director: "Peter Brunner",
    genre: "Drama",
    runtime: "106 minutes",
    country: "France",
    posterUrl: `${CF}/iffa/images/submissions-2026/down-the-arm-of-god-f94c3835/banners/DOWN%20THE%20ARM%20OF%20GOD%20PORTRAIT.webp`,
    trailerUrl: "https://www.youtube.com/watch?v=qxqICU7O2cQ",
  },
  {
    id: 4,
    badge: "Official Selection",
    // A three-letter title has nothing to split, so the whole thing takes the
    // accent colour. `SlideContent` drops the joining space when a part is empty.
    titlePart1: "",
    titlePart2: "GDN",
    description:
      "A feature loosely based on the life and times of G.D. Naidu — tycoon, engineer, educationalist, inventor and philanthropist. A school dropout who taught himself machines by stripping a motorcycle down thirteen times, he built Tamil Nadu's largest bus network, and, as a Gandhian who refused to pay British taxes, a business empire the Raj set out to break.",
    director: "Krishnakumar Ramakumar",
    genre: "Biography / Drama",
    runtime: "147 minutes",
    country: "India",
    posterUrl: `${CF}/iffa/images/submissions-2026/gdn-854e379f/banners/portrait.webp`,
    trailerUrl: "https://we.tl/t-LXjWzB6rhSVsJCAv",
  },
  {
    id: 5,
    badge: "Official Selection",
    titlePart1: "Elijah",
    titlePart2: "Peel",
    description:
      "A stadium-filling rock star's life of fame and addiction comes to a sudden halt after a heart attack nearly costs him everything. During his recovery, Elijah meets a young girl whose unwavering faith and wisdom beyond her years begin to break through the walls he has built around his heart.",
    director: "Kevin D. Sepe",
    genre: "Drama / Music",
    runtime: "107 minutes",
    country: "United States",
    posterUrl: `${CF}/iffa/images/submissions-2026/elijah-peel-dddc49bc/banners/portrait.webp`,
    trailerUrl:
      "https://drive.google.com/file/d/1MNWY6np0UaYoYIWyNpK0MlxFzD2ba5wU/view",
  },
  {
    id: 6,
    badge: "Official Selection",
    titlePart1: "Baby Do",
    titlePart2: "Die Do",
    description:
      "In the chaos of Mumbai, Baby Karmarkar — a deaf and mute contract killer — uses the city's overcrowding to mask her hits and vanish into the crowd. When a high-profile kill puts her on a police radar and love arrives in the form of a kind-hearted music teacher, she dares to dream of an escape from violence — just as her past comes crashing back.",
    director: "Nachiket Samant",
    genre: "Crime Thriller",
    runtime: "125 minutes",
    country: "India",
    posterUrl: `${CF}/iffa/images/submissions-2026/BABY%20DO%20DIE%20DO/banners/PORTRAIT.webp`,
    trailerUrl:
      "https://drive.google.com/file/d/1wAY03lzQk2KP0OcaJG_dJ1ogg9YxrbFC/view",
  },
];
