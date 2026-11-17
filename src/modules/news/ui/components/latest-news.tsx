
type NewsArticle = {
  link: string;
  companyName: string;
  description: string;
  date: string;
};

type Props = {
  stories: NewsArticle[];
  instagramReelUrl?: string;
};

function getInstagramEmbedUrl(url?: string) {
  if (!url) return null;

  try {
    const parsed = new URL(url);

    if (
      !["instagram.com", "www.instagram.com"].includes(
        parsed.hostname
      )
    ) {
      return null;
    }

    const match = parsed.pathname.match(
      /^\/reel\/([A-Za-z0-9_-]+)\/?$/
    );

    if (!match) return null;

    return `https://www.instagram.com/reel/${match[1]}/embed/`;
  } catch {
    return null;
  }
}

export default function LatestNewsSidebar({
  stories,
  instagramReelUrl,
}: Props) {
  const embedUrl = getInstagramEmbedUrl(instagramReelUrl);

  return (
    <aside
      aria-label="Latest news and social media"
      className="min-w-0 border-t border-[#d9d4cb] pt-8 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0"
    >
      <h2 className="mb-8 font-serif text-3lg font-semibold">
        Latest headlines
      </h2>

      <ol className="divide-y divide-[#e2ded6]">
        {stories.map((article) => (
          <li key={article.link} className="py-3 first:pt-0">
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <h3 className="font-sans text-[15px] font-semibold leading-[1.4] text-[#171717] transition-colors group-hover:text-[#987539]">
                {article.description}
              </h3>

              <p className="mt-3 text-[11px] uppercase tracking-wider text-[#77716a]">
                {article.companyName} · {article.date}
              </p>
            </a>
          </li>
        ))}
      </ol>

      <a
  href="#all-news-heading"
  className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#987539] transition-colors hover:text-black"
>
  Explore all news <span aria-hidden="true">→</span>
</a>

      {embedUrl && (
        <section className="mt-12 border-t border-[#d9d4cb] pt-8">
          <h3 className="font-serif text-2lg font-semibold">
            Follow IFFA
          </h3>

          <p className="mb-6 mt-2 text-sm text-[#77716a]">
            Catch our latest moments on Instagram.
          </p>

          <div className="mx-auto w-full max-w-[250px] overflow-hidden">
            <iframe
              src={embedUrl}
              title="IFFA Instagram Reel"
              loading="lazy"
              allowFullScreen
              className="block aspect-[9/16] w-full border-0"
            />
          </div>
        </section>
      )}
    </aside>
  );
}
