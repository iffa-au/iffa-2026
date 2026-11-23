
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
  dark = false,
  sizes,
}: {
  article: NewsArticle;
  dark?: boolean;
  sizes: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={`absolute inset-0 ${
        dark ? "bg-[#292621]" : "bg-[#e9e4dc]"
      }`}
    >
      {article.poster && !failed ? (
        <Image
          src={article.poster}
          alt=""
          fill
          unoptimized
          sizes={sizes}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center p-6">
          <span
            className={`font-serif text-2xl italic ${
              dark ? "text-[#b69a68]" : "text-[#8c7651]"
            }`}
          >
            IFFA Journal
          </span>
        </div>
      )}
    </div>
  );
}

function LeadStory({ article }: { article: NewsArticle }) {
  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative isolate block min-h-[420px] overflow-hidden bg-[#292621] sm:min-h-[500px] lg:min-h-[530px]"
    >
      <StoryImage
        key={article.link}
        article={article}
        dark
        sizes="(max-width: 1024px) 100vw, 55vw"
      />

      {/* Dark gradient keeps the headline readable */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/5" />

      <div className="absolute inset-x-0 bottom-0 z-10 p-6 sm:p-8 lg:p-7 xl:p-10">
        <div className="mb-5 flex items-center gap-3">
          <span className="h-px w-7 bg-[#d2ac64]" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#e3bd75]">
            The Lead Story
          </span>
        </div>

        <h2 className="line-clamp-4 max-w-[17ch] font-serif text-[clamp(1.9rem,3vw,3.5rem)] font-medium leading-[1.08] tracking-tight text-white">
          {article.description}
        </h2>

        <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] uppercase tracking-[0.12em] text-white/75">
          <span>{article.companyName}</span>
          <span className="h-1 w-1 rounded-full bg-[#d2ac64]" />
          <span>{article.date}</span>
        </div>

        <div className="mt-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-white">
          Explore story
          <span className="text-xl leading-none transition-transform duration-300 group-hover:translate-x-2">
            →
          </span>
        </div>
      </div>
    </a>
  );
}

function SupportingStory({
  article,
  number,
}: {
  article: NewsArticle;
  number: string;
}) {
  return (
    <article className="group min-w-0">
      <a
        href={article.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <div className="relative aspect-[16/9] overflow-hidden bg-[#e9e4dc]">
          <StoryImage
            key={article.link}
            article={article}
            sizes="(max-width: 1024px) 50vw, 25vw"
          />
        </div>

        <div className="pt-4">
          <div className="mb-3 flex items-center gap-3">
            <span className="text-[11px] font-semibold text-[#a4854b]">
              {number}
            </span>
            <span className="h-px w-5 bg-[#b49a66]" />
            <span className="truncate text-[10px] font-medium uppercase tracking-[0.14em] text-[#82776a]">
              {article.companyName}
            </span>
          </div>

          <h3 className="line-clamp-3 font-serif text-[19px] font-medium leading-[1.25] tracking-tight text-[#1b1a18] transition-colors group-hover:text-[#987539] xl:text-[22px]">
            {article.description}
          </h3>

          <p className="mt-3 text-xs text-[#8d887f]">
            {article.date}
          </p>
        </div>
      </a>
    </article>
  );
}

export default function NewsFeatured({ stories }: Props) {
  if (stories.length === 0) return null;

  const [lead, ...supporting] = stories;

  return (
    <section
      aria-label="Featured news"
      className="editorial-row min-w-0"
    >
      {/* Editorial section label */}
      <div className="mb-6 flex items-center gap-4">
        <span className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.2em] text-[#967239]">
          In Focus
        </span>
        <div className="h-px flex-1 bg-[#ded9d0]" />
        <span className="text-[10px] uppercase tracking-[0.12em] text-[#999187]">
          Featured Coverage
        </span>
      </div>

      {/* Main composition */}
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)]">
        <LeadStory article={lead} />

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-1">
          {supporting.slice(0, 2).map((article, index) => (
            <SupportingStory
              key={article.link}
              article={article}
              number={String(index + 2).padStart(2, "0")}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
