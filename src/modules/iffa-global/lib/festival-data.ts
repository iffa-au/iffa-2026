export type FestivalSlug = "aiffa" | "miffa" | "aksoman" | "abiff";

export type FestivalContent = {
  slug: FestivalSlug;
  shortTitle: string;
  title: string;
  subtitle: string;
  description: string;
  websiteUrl: string;
  logoSrc: string;
  heroImageSrc: string;
  highlights: string[];
};

export const festivalData: Record<FestivalSlug, FestivalContent> = {
  aiffa: {
    slug: "aiffa",
    shortTitle: "AIFFA",
    title: "Arab International Film Festival of Australia",
    subtitle: "Connecting Arab and Australian filmmaking communities.",
    description:
      "AIFFA creates a bridge between Arab storytellers and Australia through screenings, dialogue, and global industry exchange opportunities.",
    websiteUrl: "https://aiffa.com.au/",
    logoSrc: "/assets/logos/AIFFA.png",
    heroImageSrc: "/images/Home/hero-1.jpg",
    highlights: [
      "International platform for Arab and diaspora filmmakers",
      "Industry collaboration across regions",
      "Community-focused audience engagement",
    ],
  },
  miffa: {
    slug: "miffa",
    shortTitle: "MIFFA",
    title: "Malaysian International Film Festival of Australia",
    subtitle: "Showcasing Malaysian cinema to international audiences.",
    description:
      "MIFFA celebrates Malaysian stories and talent while building stronger creative partnerships between Malaysia, Australia, and the global film network.",
    websiteUrl: "https://miffa.com.au/",
    logoSrc: "/assets/logos/MIFFA.png",
    heroImageSrc: "/images/Home/hero-2.jpg",
    highlights: [
      "Cross-cultural programming and events",
      "Spotlight on emerging and established filmmakers",
      "Expanding Malaysian film visibility globally",
    ],
  },
  aksoman: {
    slug: "aksoman",
    shortTitle: "AKSOMAN",
    title: "AKS Film Platform & AKS University Film Festival",
    subtitle: "Building pathways for students and emerging creators.",
    description:
      "AKSOMAN supports film education and early-career creators through practical programming, mentorship, and collaboration with industry partners.",
    websiteUrl: "https://aksoman.om/",
    logoSrc: "/assets/logos/AKSIFFA.png",
    heroImageSrc: "/images/Home/hero-3.jpg",
    highlights: [
      "Film education and campus engagement",
      "Mentorship-led development opportunities",
      "Regional and international creative exchange",
    ],
  },
  abiff: {
    slug: "abiff",
    shortTitle: "ABIFF",
    title: "Al Batinah International Film Festival",
    subtitle: "Strengthening cultural exchange through cinema.",
    description:
      "ABIFF brings audiences and creators together to celebrate filmmaking, encourage collaboration, and deepen cultural dialogue across borders.",
    websiteUrl: "https://www.instagram.com/albatinahfilm/",
    logoSrc: "/assets/logos/ABIFFA.png",
    heroImageSrc: "/images/Home/hero-1.jpg",
    highlights: [
      "Platform for regional and international films",
      "Cultural storytelling with global perspectives",
      "Collaborative festival ecosystem under IFFA Global",
    ],
  },
};

export const festivalSlugs = Object.keys(festivalData) as FestivalSlug[];
