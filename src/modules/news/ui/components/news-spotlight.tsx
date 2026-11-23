
"use client";

import { useState } from "react";
import Image from "next/image";

type NewsArticle = {
  link: string;
  poster?: string;
  companyName: string;
  description: string;
  date: string;
};

type Props = {
  stories: NewsArticle[];
};

function FeatureImage({
  article,
}: {
  article: NewsArticle;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#e9e5de] lg:aspect-[5/4]">
      {article.poster && !failed ? (
        <Image
          src={article.poster}
          alt={article.description}
          fill
          unoptimized
          sizes="(max-width: 1024px) 100vw, 65vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-serif text-2xl italic text-[#987539]">
            IFFA Journal
          </span>
        </div>
      )}
    </div>
  );
}

function RelatedStory({
  article,
  index,
}: {
  article: NewsArticle;
  index: number;
}) {
  return (
    <article className="group border-t border-[#ded9d0] pt-5">
      <a
        href={article.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.17em] text-[#987539]">
          Related / {String(index + 1).padStart(2, "0")}
        </p>

        <h3 className="line-clamp-3 font-sans text-[15px] font-semibold leading-[1.35] text-[#191816] transition-colors group-hover:text-[#987539] xl:text-base">
          {article.description}
        </h3>

        <div className="mt-3 flex items-center justify-between gap-4">
          <p className="text-[10px] text-[#81786b]">
            {article.companyName} · {article.date}
          </p>

          <span className="text-[#987539] transition-transform group-hover:translate-x-1">
            →
          </span>
        </div>
      </a>
    </article>
  );
}

export default function NewsSpotlight({ stories }: Props) {
  if (stories.length === 0) return null;

  const [mainStory, ...relatedStories] = stories;

  return (
    <section
      aria-labelledby="featured-stories-heading"
      className="editorial-row mb-12 border-t border-[#ded9d0] pt-8"
    >
      {/* SECTION HEADING */}
      <div className="mb-7 flex items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#987539]">
            The Screening Room
          </p>

          <h2
            id="featured-stories-heading"
            className="font-serif text-3xl font-normal tracking-tight md:text-4xl"
          >
            Featured Stories
          </h2>
        </div>

        <span className="hidden text-[10px] uppercase tracking-[0.16em] text-[#8d887f] sm:block">
          IFFA Journal / 03
        </span>
      </div>

      {/* EDITORIAL SPREAD */}
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.65fr)] lg:gap-10">

        {/* LEFT — HEADLINES */}
        <div className="min-w-0">
          <article className="group pb-6">
            <a
              href={mainStory.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#987539]">
                The Feature
              </p>

              <h3 className="line-clamp-5 font-serif text-2xl font-bold leading-[1.15] tracking-tight text-[#191816] transition-colors group-hover:text-[#987539] xl:text-3xl">
                {mainStory.description}
              </h3>

              <p className="mt-4 text-xs text-[#81786b]">
                {mainStory.companyName} · {mainStory.date}
              </p>

              <span className="mt-5 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#987539]">
                Explore story <span>→</span>
              </span>
            </a>
          </article>

          <div className="space-y-5">
            {relatedStories.slice(0, 2).map((article, index) => (
              <RelatedStory
                key={article.link}
                article={article}
                index={index}
              />
            ))}
          </div>
        </div>

        {/* RIGHT — LARGE FEATURE PHOTOGRAPH */}
        <a
          href={mainStory.link}
          target="_blank"
          rel="noopener noreferrer"
          className="group block min-w-0"
        >
          <FeatureImage
            key={mainStory.link}
            article={mainStory}
          />

          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="text-[10px] uppercase tracking-[0.14em] text-[#81786b]">
              Featured Photography
            </p>

            <span className="text-xs font-medium text-[#987539]">
              View Story →
            </span>
          </div>
        </a>

      </div>
    </section>
  );
}
