import { newsData } from "@/modules/home/data/newsData";
import NewsCard from "@/modules/home/ui/news/NewsCard";

const HomeNews = () => {
	const selectedIndices = [1, 4, 0, 5];
	const displayNews = selectedIndices
		.map((index) => newsData[index])
		.filter((item): item is (typeof newsData)[number] => Boolean(item));

	return (
		<section className="w-full bg-black px-6 pb-32 pt-20">
			<div className="mx-auto max-w-[1400px]">
				<div className="mb-16 text-center">
					<h2 className="mb-6 text-5xl font-bold tracking-tight text-white md:text-6xl">
						Latest <span className="text-yellow-500">News</span>
					</h2>
					<p className="mx-auto max-w-2xl text-lg font-light leading-relaxed text-gray-300 md:text-xl">
						Stay updated with the latest announcements and stories from the world of cinema.
					</p>
				</div>

				<div className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-8 md:grid md:grid-cols-4 md:items-stretch md:overflow-visible md:pb-0">
					{displayNews.map((news) => (
						<div
							key={news.id}
							className="h-full min-w-[85%] snap-center sm:min-w-[45%] md:min-w-0"
						>
							<NewsCard news={news} />
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default HomeNews;
