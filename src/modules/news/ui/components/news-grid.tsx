
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

function StoryImage({
  article,
  className = "",
}: {
  article: NewsArticle;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={`relative overflow-hidden bg-[#ebe8e2] ${className}`}
    >
      {article.poster && !failed ? (
        <Image
          src={article.poster}
          alt=""
          fill
          unoptimized
          sizes="(max-width: 1024px) 100vw, 45vw"
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

export default function NewsGrid({ stories }: Props) {
  if (!stories.length) return null;

  const [main, ...secondary] = stories;
  const supporting = secondary.slice(0, 2);
  const headlines = secondary.slice(2, 5);

  return (
    <section
      aria-labelledby="recent-releases-heading"
      className="editorial-row mb-14 border-t border-[#ded9d0] pt-8"
    >
      {/* SECTION HEADING */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-[#987539]">
            The IFFA Journal
          </p>

          <h2
            id="recent-releases-heading"
            className="font-serif text-3xl font-normal md:text-4xl"
          >
            Recent Releases
          </h2>
        </div>

        <span className="hidden text-[10px] uppercase tracking-widest text-[#8d887f] sm:block">
          Discover more
        </span>
      </div>

      {/* EDITORIAL NEWSPAPER LAYOUT */}
      <div className="grid items-start gap-8 md:grid-cols-2 lg:grid-cols-12 lg:gap-7">

        {/* LARGE MAIN STORY */}
        <div className="min-w-0 lg:col-span-5">
          <a
            href={main.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            <StoryImage
              key={main.link}
              article={main}
              className="aspect-[4/3] w-full"
            />

            <p className="mt-5 text-[10px] uppercase tracking-[0.16em] text-[#987539]">
              {main.companyName}
            </p>

            <h3 className="mt-3 line-clamp-4 font-serif text-2xl leading-tight transition-colors group-hover:text-[#987539] lg:text-3xl">
              {main.description}
            </h3>

            <p className="mt-3 text-xs text-[#81786b]">
              {main.date}
            </p>
          </a>
        </div>

        {/* TWO IMAGE + TEXT STORIES */}
        <div className="min-w-0 lg:col-span-4">
          <div className="flex flex-col gap-6">
            {supporting.map((article) => (
              <article
                key={article.link}
                className="border-b border-[#ded9d0] pb-6 last:border-b-0"
              >
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group grid grid-cols-[110px_minmax(0,1fr)] gap-4 md:grid-cols-1 lg:grid-cols-[100px_minmax(0,1fr)] xl:grid-cols-[135px_minmax(0,1fr)]"
                >
                  <StoryImage
                    key={article.link}
                    article={article}
                    className="aspect-[4/3] w-full"
                  />

                  <div className="min-w-0">
                    <p className="mb-2 text-[9px] uppercase tracking-wider text-[#987539]">
                      {article.companyName}
                    </p>

                    <h3 className="line-clamp-4 font-serif text-lg leading-snug transition-colors group-hover:text-[#987539]">
                      {article.description}
                    </h3>

                    <p className="mt-3 text-[10px] text-[#81786b]">
                      {article.date}
                    </p>
                  </div>
                </a>
              </article>
            ))}
          </div>
        </div>

        {/* TEXT-ONLY HEADLINE COLUMN */}
        <div className="min-w-0 md:col-span-2 lg:col-span-3 lg:border-l lg:border-[#ded9d0] lg:pl-6">
          <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.17em] text-[#987539]">
            In Brief
          </p>

          <div className="grid gap-5 sm:grid-cols-3 lg:grid-cols-1">
            {headlines.map((article) => (
              <article
                key={article.link}
                className="border-b border-[#ded9d0] pb-5"
              >
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <h3 className="line-clamp-4 font-serif text-base leading-snug transition-colors group-hover:text-[#987539]">
                    {article.description}
                  </h3>

                  <p className="mt-3 text-[10px] text-[#81786b]">
                    {article.date}
                  </p>
                </a>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
