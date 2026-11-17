
"use client";

import { useState } from "react";
import Image from "next/image";
import LatestNewsSidebar from "./latest-news";
import NewsSpotlight from "./news-spotlight";

type NewsArticle = {
  link: string;
  poster?: string;
  companyName: string;
  description: string;
  date: string;
};

type Props = {
  featured: NewsArticle[];
  recent: NewsArticle[];
  latest: NewsArticle[];
  spotlight: NewsArticle[];
  instagramReelUrl?: string;
};

function StoryPhoto({
  article,
  className = "",
}: {
  article: NewsArticle;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={`relative overflow-hidden bg-[#e9e5de] ${className}`}
    >
      {article.poster && !failed ? (
        <Image
          src={article.poster}
          alt=""
          fill
          unoptimized
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="flex h-full items-center justify-center p-4">
          <span className="font-serif italic text-[#987539]">
            IFFA Journal
          </span>
        </div>
      )}
    </div>
  );
}

function CompactStory({ article }: { article: NewsArticle }) {
  return (
    <article className="group min-w-0">
      <a
        href={article.link}
        target="_blank"
        rel="noopener noreferrer"
        className="grid grid-cols-[95px_minmax(0,1fr)] gap-4"
      >
        <StoryPhoto
          key={article.link}
          article={article}
          className="aspect-[4/3] w-full"
        />

        <div className="min-w-0">
          <p className="mb-2 truncate text-[10px] uppercase tracking-wider text-[#987539]">
            {article.companyName}
          </p>

          <h3 className="line-clamp-3 font-serif text-base leading-snug transition-colors group-hover:text-[#987539]">
            {article.description}
          </h3>

          <p className="mt-2 text-[10px] text-[#81786b]">
            {article.date}
          </p>
        </div>
      </a>
    </article>
  );
}

export default function EditorialPuzzle({
  featured,
  recent,
  latest,
  spotlight,
  instagramReelUrl,
}: Props) {
  const [lead, ...supporting] = featured;
  const [recentLead, ...otherReleases] = recent;

  if (!lead) return null;

  return (
    <section
      aria-label="News highlights"
      className="editorial-row mb-12"
    >
      <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_220px]">

    {/* Outer grid: main editorial area + independent news rail */}

    {/* Main editorial area */}
        <div className="min-w-0">

        {/* Existing left and centre columns */}
        <div className="grid items-start gap-7 md:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">


        {/* LEFT — Main feature and next major release */}
        <div className="min-w-0 space-y-7">
          <p className="border-b border-[#ded9d0] pb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#987539]">
            In Focus
          </p>

          <a
            href={lead.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block h-[380px] overflow-hidden bg-[#292621] lg:h-[430px]"
          >
            
<div className="absolute inset-0">
  <StoryPhoto
    key={lead.link}
    article={lead}
    className="h-full w-full"
  />
</div>


            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-6 text-white">
              <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-[#d6b26b]">
                The Lead Story
              </p>

              <h2 className="line-clamp-4 font-serif text-3xl font-bold leading-[1.12] tracking-tight lg:text-[clamp(1.8rem,2.5vw,2.7rem)]">
                {lead.description}
              </h2>

              <p className="mt-4 text-[10px] uppercase tracking-wider text-white/70">
                {lead.companyName} · {lead.date}
              </p>

              <span className="mt-4 inline-block text-xs uppercase tracking-widest">
                Explore story →
              </span>
            </div>
          </a>

          {/* Next story directly underneath the lead */}
          {recentLead && (
            <div className="border-t border-[#ded9d0] pt-5">
              <h2 className="mb-4 font-serif text-2xl">
                Recent Releases
              </h2>

              <a
                href={recentLead.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group grid grid-cols-[43%_minmax(0,1fr)] items-start gap-4"
              >
                <StoryPhoto
                  key={recentLead.link}
                  article={recentLead}
                  className="aspect-[4/3] w-full"
                />

                <div className="min-w-0">
                  <p className="mb-2 text-[10px] uppercase text-[#987539]">
                    {recentLead.companyName}
                  </p>

                  <h3 className="line-clamp-4 font-serif text-lg leading-tight transition-colors group-hover:text-[#987539]">
                    {recentLead.description}
                  </h3>

                  <p className="mt-3 text-[10px] text-[#81786b]">
                    {recentLead.date}
                  </p>
                </div>
              </a>
            </div>
          )}
        </div>

        {/* CENTRE — Featured and supporting releases */}
        <div className="min-w-0 space-y-6">
          <p className="border-b border-[#ded9d0] pb-3 text-[10px] font-semibold uppercase tracking-[0.17em] text-[#987539]">
            Featured Coverage
          </p>

          {supporting.slice(0, 2).map((article) => (
            <article key={article.link} className="group">
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <StoryPhoto
                  key={article.link}
                  article={article}
                  className="aspect-[2.6/1] w-full"
                />

                <p className="mt-3 text-[10px] uppercase tracking-wider text-[#987539]">
                  {article.companyName}
                </p>

                <h3 className="mt-2 line-clamp-3 font-serif text-lg leading-snug transition-colors group-hover:text-[#987539]">
                  {article.description}
                </h3>
              </a>
            </article>
          ))}

          <div className="space-y-5 border-t border-[#ded9d0] pt-5">
            <h2 className="font-serif text-xl">
              More from IFFA
            </h2>

            {otherReleases.slice(0, 2).map((article) => (
              <CompactStory
                key={article.link}
                article={article}
              />
            ))}
          </div>
        </div>

        
        </div>
        {/* END OF CENTRE COLUMN */}

      {/* END OF INNER TWO-COLUMN GRID */}

      {/* FEATURED STORIES — directly below main content */}
      <div className="mt-6">
        <NewsSpotlight stories={spotlight} />
      </div>

    </div>
    {/* END OF MAIN EDITORIAL AREA */}

    {/* RIGHT — INDEPENDENT NEWS SIDEBAR */}
    <div className="min-w-0">
      <LatestNewsSidebar
        stories={latest}
        instagramReelUrl={instagramReelUrl}
      />

      {/* IN BRIEF */}
      <div className="mt-8 border-t border-[#ded9d0] pt-6">
        <h2 className="mb-5 font-serif text-xl">
          In Brief
        </h2>

        <div className="space-y-4">
          {otherReleases.slice(2, 5).map((article) => (
            <article
              key={article.link}
              className="border-b border-[#ded9d0] pb-4"
            >
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <h3 className="line-clamp-3 font-serif text-base leading-snug transition-colors group-hover:text-[#987539]">
                  {article.description}
                </h3>

                <p className="mt-2 text-[10px] text-[#81786b]">
                  {article.date}
                </p>
              </a>
            </article>
          ))}
        </div>
      </div>
    </div>
    {/* END OF RIGHT SIDEBAR */}

  </div>
  {/* END OF OUTER GRID */}

</section>
  );
}
