export type NewsItem = {
  id: number;
  title: string;
  excerpt: string;
  imageUrl: string;
  publishedAt: string;
  href: string;
};

export const newsData: NewsItem[] = [
  {
    id: 1,
    title: "IFFA 2026 Announces Festival Lineup",
    excerpt:
      "The official lineup showcases bold voices from across global cinema and emerging storytellers.",
    imageUrl:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "2026-03-10",
    href: "/news/iffa-2026-lineup",
  },
  {
    id: 2,
    title: "New International Jury Panel Revealed",
    excerpt:
      "Award-winning directors, producers, and critics join the jury for this year's competition slate.",
    imageUrl:
      "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "2026-03-18",
    href: "/news/international-jury-panel",
  },
  {
    id: 3,
    title: "Masterclass Series Opens Registration",
    excerpt:
      "Industry-led sessions on writing, direction, production design, and distribution are now open.",
    imageUrl:
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "2026-03-22",
    href: "/news/masterclass-registration",
  },
  {
    id: 4,
    title: "IFFA Partners With Regional Film Labs",
    excerpt:
      "A new collaboration will support first-time filmmakers with mentorship and development grants.",
    imageUrl:
      "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "2026-04-01",
    href: "/news/regional-film-labs",
  },
  {
    id: 5,
    title: "Tickets for Opening Night Now Live",
    excerpt:
      "Secure your seat for the opening gala, red carpet arrivals, and premiere screening event.",
    imageUrl:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "2026-04-05",
    href: "/news/opening-night-tickets",
  },
  {
    id: 6,
    title: "Community Screenings Program Expanded",
    excerpt:
      "The program brings curated films and filmmaker Q&A sessions to audiences across the region.",
    imageUrl:
      "https://images.unsplash.com/photo-1585951237318-9ea5e175b891?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "2026-04-12",
    href: "/news/community-screenings-expanded",
  },
];
