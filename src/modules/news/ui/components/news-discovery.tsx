
import AllNewsFeed from "./all-news";
import FilmSpotlight, {
  type FilmHighlight,
} from "./film-spotlight";

type NewsArticle = {
  link: string;
  poster?: string;
  companyName: string;
  description: string;
  date: string;
};

type Props = {
  stories: NewsArticle[];
  films: FilmHighlight[];
  showFilms?: boolean;
};

export default function NewsDiscovery({
  stories,
  films,
  showFilms = true,
}: Props) {
  const hasFilmSidebar = showFilms && films.length > 0;

  return (
    <section
      aria-label="News and film discovery"
      className={
        hasFilmSidebar
          ? "grid items-start gap-10 lg:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.9fr)] lg:gap-12"
          : "block"
      }
    >
      {/* LEFT — CONTINUOUS NEWS */}
      <div className="min-w-0">
        <AllNewsFeed stories={stories} />
      </div>

      {/* RIGHT — FILM SPOTLIGHT */}
      {hasFilmSidebar && (
        
<div className="min-w-0 lg:border-l lg:border-[#ded9d0] lg:pl-10">
  <FilmSpotlight films={films} />
</div>

      )}
    </section>
  );
}
