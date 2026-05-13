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

export const featuredFilms: FeaturedFilm[] = [
  {
    id: 1,
    badge: "Official Selection",
    titlePart1: "The",
    titlePart2: "Arab",
    description:
      "Haroun is an old bachelor who has been living in Oran for several years, quietly navigating the tensions of identity, belonging, and the passage of time.",
    director: "Malek Bensmail",
    genre: "Drama",
    runtime: "106 minutes",
    country: "Algeria",
    posterUrl: `${CF}/iffa/images/THE-ARAB.jpg`,
    trailerUrl: "https://vimeo.com/1176566092",
  },
  {
    id: 2,
    badge: "Must Watch",
    titlePart1: "High",
    titlePart2: "Rollers",
    description:
      "In a world where every gamble could be your last, master thief Mason must outwit merciless foes and the law to save the woman he loves. A high-stakes heist thriller that pits greed, loyalty, and courage against impossible odds.",
    director: "Randall Emmett",
    genre: "Action / Thriller",
    runtime: "102 minutes",
    country: "United States",
    posterUrl: `${CF}/iffa/images/high-rollers.jpg`,
    trailerUrl: "https://www.youtube.com/watch?v=NhaXDfYundI",
  },
];
