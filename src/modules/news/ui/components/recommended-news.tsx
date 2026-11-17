
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
  variant?: "strip" | "sidebar";
  title?: string;
};

function ArticleImage({
  article,
  compact = false,
}: {
  article: NewsArticle;
  compact?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={`relative shrink-0 overflow-hidden bg-[#eeeae4] ${
        compact
          ? "h-[78px] w-[105px]"
          : "aspect-[16/10] w-full"
      }`}
    >
      {article.poster && !failed ? (
        <Image
          src={article.poster}
          alt=""
          fill
          unoptimized
          sizes={
            compact
              ? "105px"
              : "(max-width: 640px) 50vw, 240px"
          }
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="flex h-full items-center justify-center p-3 text-center">
          <span className="font-serif text-sm italic text-[#987539]">
            IFFA
          </span>
        </div>
      )}
    </div>
  );
}

export default function RecommendedNews({
  stories,
  variant = "strip",
  title = "Recommended Reads",
}: Props) {
  if (stories.length === 0) return null;

  const isSidebar = variant === "sidebar";
  const visibleStories = stories.slice(
    0,
    isSidebar ? 5 : 6
  );

  return (
    <section
      aria-label={title}
      className={
        isSidebar
          ? "border-t-4 border-[#171717] pt-5"
          : "editorial-row my-12 border-y border-[#171717] py-7"
      }
    >
      <h2
        className={`font-serif font-normal text-[#171717] ${
          isSidebar
            ? "mb-6 text-2xl"
            : "mb-8 text-3xl md:text-4xl"
        }`}
      >
        {title}
      </h2>

      {isSidebar ? (
        <div className="divide-y divide-[#ded9d0]">
          {visibleStories.map((article) => (
            <article
              key={article.link}
              className="group py-5 first:pt-0"
            >
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4"
              >
                <ArticleImage
                  article={article}
                  compact
                />

                <div className="min-w-0">
                  <h3 className="line-clamp-4 font-serif text-base leading-snug transition-colors group-hover:text-[#987539]">
                    {article.description}
                  </h3>

                  <p className="mt-2 text-[10px] uppercase tracking-wider text-[#81786b]">
                    {article.companyName}
                  </p>
                </div>
              </a>
            </article>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="grid min-w-[1080px] grid-cols-6 gap-0">
            {visibleStories.map((article) => (
              <article
                key={article.link}
                className="group min-w-0 border-r border-[#ded9d0] px-4 first:pl-0 last:border-r-0 last:pr-0 lg:px-5"
              >
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <ArticleImage article={article} />

                  <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#987539]">
                    {article.companyName}
                  </p>

                  <h3 className="mt-2 line-clamp-5 font-serif text-[15px] font-medium leading-[1.3] text-[#171717] transition-colors group-hover:text-[#987539] xl:text-[17px]">
                    {article.description}
                  </h3>
                </a>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
