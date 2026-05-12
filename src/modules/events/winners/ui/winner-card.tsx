type WinnerCardProps = {
  photoUrl: string;
  movieName: string;
  category: string;
  winnerName: string;
};

export function WinnerCard({
  photoUrl,
  movieName,
  category,
  winnerName,
}: WinnerCardProps) {
  return (
    <div className="relative group overflow-hidden rounded-xl border border-white/10 bg-black transition-all hover:scale-[1.02] hover:border-accent-3/50 shadow-2xl">
      <img
        src={photoUrl}
        alt={movieName}
        className="aspect-video w-full object-cover opacity-60 transition-opacity group-hover:opacity-80"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = "/fallbacks/no-poster.svg";
        }}
      />
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-black/60 to-transparent p-6">
        <span className="mb-3 inline-block rounded bg-accent-3 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-black">
          {category}
        </span>
        <h2 className="text-2xl font-bold leading-tight text-white">
          {winnerName || movieName}
        </h2>
        {winnerName ? (
          <p className="mt-1 text-sm font-medium text-accent-3">{movieName}</p>
        ) : null}
      </div>
    </div>
  );
}
