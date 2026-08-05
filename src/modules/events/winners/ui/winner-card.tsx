import { ArrowRight } from "lucide-react";
import Link from "next/link";

type WinnerCardProps = {
  photoUrl: string;
  movieName: string;
  category: string;
  winnerName: string;
  href: string | null;
};

export function WinnerCard({
  photoUrl,
  movieName,
  category,
  winnerName,
  href,
}: WinnerCardProps) {
  const card = (
    <div className="group relative flex min-h-[340px] items-end overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-yellow-500/40 hover:shadow-2xl hover:shadow-yellow-500/10 sm:min-h-[400px]">
      <img
        src={photoUrl}
        alt={movieName}
        className="absolute inset-0 h-full w-full object-cover opacity-80 transition-transform duration-500 ease-out group-hover:scale-105"
        loading="lazy"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = "/fallbacks/no-poster.svg";
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/75 via-50% to-black/10" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/90 via-black/20 to-transparent" />

      <div className="relative flex flex-col gap-3 p-6 sm:p-8">
        <span className="inline-flex w-fit items-center rounded-md bg-yellow-500 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-black">
          Winner &mdash; {category}
        </span>
        <h2 className="line-clamp-2 text-2xl font-bold uppercase leading-tight text-white sm:text-3xl">
          {movieName}
        </h2>
        {winnerName ? (
          <p className="truncate text-base font-medium text-white/70">
            {winnerName}
          </p>
        ) : null}
        <span className="mt-2 inline-flex w-fit items-center gap-1.5 border-b border-white/40 pb-0.5 text-xs font-bold uppercase tracking-widest text-white transition-colors group-hover:border-yellow-500 group-hover:text-yellow-500">
          Read More
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </div>
  );

  if (!href) return card;

  return (
    <Link href={href} aria-label={`View synopsis: ${movieName}`}>
      {card}
    </Link>
  );
}
