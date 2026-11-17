
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

function AllNewsCard({ article }: { article: NewsArticle }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <article className="group border-b border-[#e2ded6] pb-8">
      <a
        href={article.link}
        target="_blank"
        rel="noopener noreferrer"
        className="grid gap-5 sm:grid-cols-[150px_minmax(0,1fr)]"
      >
        {/* Article image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#eae7e1]">
          {article.poster && !imageFailed ? (
            <Image
              src={article.poster}
              alt=""
              fill
              unoptimized
              sizes="(max-width: 640px) 100vw, 150px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className="flex h-full items-center justify-center p-4 text-center">
              <span className="font-serif text-sm text-[#94763f]">
                IFFA Journal
              </span>
            </div>
          )}
        </div>

        {/* Article information */}
        <div className="min-w-0">
          <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.15em] text-[#94763f]">
            {article.companyName}
          </p>

          <h3 className="font-sans text-xl font-semibold leading-[1.3] tracking-tight text-[#171717] transition-colors group-hover:text-[#987539]">
            {article.description}
          </h3>

          <p className="mt-4 text-xs text-[#77716a]">
            {article.date}
          </p>

          <span className="mt-4 inline-block text-xs font-medium text-[#94763f]">
            Read story →
          </span>
        </div>
      </a>
    </article>
  );
}

export default function AllNewsFeed({ stories }: Props) {
  return (
    <section
      aria-labelledby="all-news-heading"
      className="editorial-row border-t-4 border-[#171717] pt-4"
    >
      {/* Heading */}
      <div className="mb-12">
        <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.2em] text-[#94763f]">
          Explore more
        </p>

        <h2
          id="all-news-heading"
          className="font-serif text-3xl font-semibold md:text-4xl"
        >
          All News
        </h2>

        <p className="mt-4 max-w-2xl text-sm leading-7 text-[#77716a]">
          Discover more stories, interviews, reviews and
          updates from the world of cinema.
        </p>
      </div>

      {/* Continuous article feed */}
      {stories.length > 0 ? (
        <div className="flex flex-col gap-8">
          {stories.map((article) => (
            <AllNewsCard
              key={article.link}
              article={article}
            />
          ))}
        </div>
      ) : (
        <p className="py-12 text-sm text-[#77716a]">
          No additional articles to display.
        </p>
      )}
    </section>
  );
}
