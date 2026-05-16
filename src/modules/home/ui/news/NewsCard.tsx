import type { NewsItem } from "@/modules/home/data/newsData";

type NewsCardProps = {
  news: NewsItem;
};

const formatDate = (date: string): string => {
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime())
    ? date
    : parsed.toLocaleDateString("en-AU", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
};

const NewsCard = ({ news }: NewsCardProps) => {
  return (
    <article className="h-full overflow-hidden rounded-xl border border-white/10 bg-zinc-900/40">
      <div className="relative h-44 w-full overflow-hidden">
        <img
          src={news.imageUrl}
          alt={news.title}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
      </div>

      <div className="flex h-[calc(100%-11rem)] flex-col p-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-yellow-500">
          {formatDate(news.publishedAt)}
        </p>

        <h3 className="line-clamp-2 text-xl font-semibold text-white">{news.title}</h3>

        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-zinc-300">
          {news.excerpt}
        </p>
      </div>
    </article>
  );
};

export default NewsCard;
