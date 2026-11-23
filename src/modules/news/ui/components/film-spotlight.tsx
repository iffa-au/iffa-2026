
"use client";

import { useState } from "react";
import Image from "next/image";

export type FilmHighlight = {
  id: string;
  title: string;
  genre?: string;
  synopsis?: string;
  poster?: string;
  href?: string;
};

type Props = {
  films: FilmHighlight[];
};

function FilmCard({ film }: { film: FilmHighlight }) {
  const [imageFailed, setImageFailed] = useState(false);

  const content = (
    <>
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#eae7e1]">
        {film.poster && !imageFailed ? (
          <Image
            src={film.poster}
            alt={film.title}
            fill
            unoptimized
            sizes="(max-width: 1024px) 100vw, 35vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-[#252321] px-6 text-center">
            <span className="font-serif text-3xl italic text-[#d6b26b]">
              IFFA Cinema
            </span>
          </div>
        )}
      </div>

      <div className="pt-5">
        {film.genre && (
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#987539]">
            {film.genre}
          </p>
        )}

        <h3 className="font-serif text-2xl leading-tight text-[#171717] transition-colors group-hover:text-[#987539]">
          {film.title}
        </h3>

        {film.synopsis && (
          <p className="mt-3 text-sm leading-6 text-[#6f6b65]">
            {film.synopsis}
          </p>
        )}
      </div>
    </>
  );

  return (
    <article className="group border-b border-[#ded9d0] pb-8">
      {film.href ? (
        <a href={film.href} className="block">
          {content}
        </a>
      ) : (
        <div>{content}</div>
      )}
    </article>
  );
}

export default function FilmSpotlight({ films }: Props) {
  if (films.length === 0) return null;

  return (
    <aside aria-labelledby="film-spotlight-heading">
      <div className="mb-8 border-t-4 border-[#171717] pt-4">
        <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-[#987539]">
          Discover Cinema
        </p>

        <h2
          id="film-spotlight-heading"
          className="font-serif text-3xl md:text-4xl"
        >
          Film Spotlight
        </h2>
      </div>

      <div className="space-y-8">
        {films.map((film) => (
          <FilmCard key={film.id} film={film} />
        ))}
      </div>
    </aside>
  );
}
