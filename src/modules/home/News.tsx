import { newsData } from "@/modules/home/data/newsData";
import NewsCard from "@/modules/home/ui/news/NewsCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
						<Link href="/latest-news" className="hover:text-yellow-500 transition-colors">Latest <span className="text-yellow-500">News</span></Link>
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

				<div className="mt-12 flex justify-center">
					<Link
						href="/latest-news"
						className="group inline-flex items-center gap-2 rounded-full border border-yellow-500 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-yellow-500 transition-all hover:bg-yellow-500 hover:text-black"
					>
						View All News
						<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
					</Link>
				</div>
			</div>
		</section>
	);
};

export default HomeNews;
