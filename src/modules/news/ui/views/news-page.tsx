
"use client";

import { useRef } from "react";
import newsData from "@/modules/news/data/newsData.json";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import NewsGrid from "@/modules/news/ui/components/news-grid";
import NewsSpotlight from "@/modules/news/ui/components/news-spotlight";
import NewsDiscovery from "@/modules/news/ui/components/news-discovery";
import type { FilmHighlight } from "@/modules/news/ui/components/film-spotlight";
import EditorialPuzzle from "@/modules/news/ui/components/unified-layout";
import RecommendedNews from "@/modules/news/ui/components/recommended-news";

const NewsPage = () => {
  const newsTitleRef = useRef<HTMLHeadingElement>(null);

  // Separate featured and regular articles
  const featuredItems = newsData.filter(
    (news) => news.featured === true
  );

  const regularItems = newsData.filter(
    (news) => !news.featured
  );

  const sortedItems = [...featuredItems, ...regularItems];

  // Three main feature articles
  const featuredStories = sortedItems.slice(0, 3);

  const gridStories = sortedItems.slice(3, 9);
  
  const spotlightStories = sortedItems.slice(9, 12);

  const recommendedStories = sortedItems.slice(12, 18);


// Identify articles already used in homepage highlights
  const highlightedLinks = new Set(
  [
    ...featuredStories,
    ...gridStories,
    ...spotlightStories,
    ...recommendedStories,
    ].map((article) => article.link)
  );

// All remaining articles
  const allNewsStories = sortedItems.filter(
  (article) => !highlightedLinks.has(article.link)
  );

// movie articles for the film spotlight sidebar

const spotlightFilms: FilmHighlight[] = [
  {
    id: "film-1",
    title: "High Rollers",
    genre: "Action / Thriller",
    synopsis:
      "A high-stakes crime story about a master thief and the risks of one final challenge.",
  },
  {
    id: "film-2",
    title: "Dhurandhar The Revenge",
    genre: "Action",
    synopsis:
      "A story of identity, loyalty and a dangerous undercover mission.",
  },
];



  // Five latest articles, regardless of whether featured
  const latestStories = [...newsData]
    .sort(
      (a, b) =>
        (Date.parse(b.date) || 0) -
        (Date.parse(a.date) || 0)
    )
    .slice(0, 5);

  // Leave empty until a public Reel URL is available
  const instagramReelUrl = "";

  // Animations
  useGSAP(() => {
    if (newsTitleRef.current) {
      gsap.from(newsTitleRef.current, {
        y: -30,
        opacity: 0,
        duration: 0.6,
      });
    }

    gsap.from(".editorial-row", {
      opacity: 0,
      y: 30,
      stagger: 0.2,
      duration: 0.8,
      ease: "power2.out",
    });
  });

  return (
    <main className="news-page min-h-screen bg-white text-[#171717]">
      <div className="mx-auto max-w-[1440px] px-6 pb-24 pt-14">

        {/* HEADER */}
        
{/* EDITORIAL MASTHEAD */}
<header className="mb-7 border-b border-[#e0e0e0] pb-5">
  <div className="flex items-center justify-between gap-4">
    <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#987539]">
      The IFFA Journal
    </span>

    <span className="hidden text-[10px] uppercase tracking-[0.18em] text-[#8d887f] sm:block">
      Film / Culture / Stories
    </span>
  </div>

  <div className="mt-8 text-center">
    <h1
      ref={newsTitleRef}
      className="news-page-title font-serif text-4xl font-normal leading-none tracking-tight text-[#171717] md:text-6xl"
    >
      Latest News
    </h1>

    <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#77716a] md:text-base">
      Stories, perspectives and conversations from the world of film.
    </p>
  </div>
</header>


        
{/* CONTINUOUS EDITORIAL LAYOUT */}
<EditorialPuzzle
  featured={featuredStories}
  recent={gridStories}
  latest={latestStories}
  spotlight={spotlightStories}
  instagramReelUrl={instagramReelUrl}
/>

<RecommendedNews
  stories={recommendedStories}
  variant="strip"
  title="Recommended Reads"
/>

{/* ALL NEWS */}
<NewsDiscovery
  stories={allNewsStories}
  films={spotlightFilms}
  showFilms={true}
/>

      </div>
    </main>
  );
};

export default NewsPage;
