"use client";

import { useEffect, useRef, useState } from "react";

type MediaApiResponse = {
	title?: string;
	s3Key?: string;
	youtubeUrl?: string;
};

type FeaturedMovieMediaItem = {
	title?: string;
	poster: string;
	youtubeUrl: string;
};

const CLOUDFRONT_URL = process.env.NEXT_PUBLIC_CLOUDFRONT_URL ?? "";
const API_URL = process.env.NEXT_PUBLIC_SUBMIT_FILM_URL;

const buildCloudFrontUrl = (key: string) => {
	const normalizedBase = CLOUDFRONT_URL.endsWith("/")
		? CLOUDFRONT_URL.slice(0, -1)
		: CLOUDFRONT_URL;
	const normalizedKey = key.startsWith("/") ? key : `/${key}`;
	return `${normalizedBase}${normalizedKey}`;
};

const FeaturedMovies = () => {
	const [mediaItems, setMediaItems] = useState<FeaturedMovieMediaItem[]>([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [loading, setLoading] = useState(true);
	const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const clearTimer = () => {
		if (timerRef.current) {
			clearInterval(timerRef.current);
			timerRef.current = null;
		}
	};

	const startInterval = (ms: number) => {
		clearTimer();
		if (mediaItems.length > 0) {
			timerRef.current = setInterval(() => {
				setCurrentIndex((prev) => (prev + 1) % mediaItems.length);
			}, ms);
		}
	};

	const fetchMedia = async () => {
		if (!API_URL) {
			setLoading(false);
			return;
		}

		try {
			setLoading(true);

			const mediaPromises = Array.from({ length: 10 }, async (_, i) => {
				const title = `Hero_${i + 1}i`;
				try {
					const res = await fetch(`${API_URL}/media-assets/title/${title}`, {
						cache: "no-store",
					});
					if (!res.ok) return null;
					return (await res.json()) as MediaApiResponse;
				} catch {
					return null;
				}
			});

			const results = await Promise.all(mediaPromises);

			const formattedData = results
				.filter((item): item is MediaApiResponse => Boolean(item && item.s3Key))
				.map((item) => ({
					title: item.title,
					poster: buildCloudFrontUrl(item.s3Key as string),
					youtubeUrl: item.youtubeUrl || "https://www.youtube.com/iffa",
				}));

			formattedData.forEach((item) => {
				const preloadImage = new Image();
				preloadImage.src = item.poster;
			});

			setMediaItems(formattedData);
			setCurrentIndex(0);
		} catch (error) {
			console.error("Error fetching media assets:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchMedia();
	}, []);

	useEffect(() => {
		if (mediaItems.length > 0) {
			startInterval(5000);
		}

		return () => clearTimer();
	}, [mediaItems]);

	const handleMouseEnter = () => {
		clearTimer();
	};

	const handleMouseLeave = () => {
		startInterval(5000);
	};

	if (loading) {
		return (
			<div className="flex h-[400px] items-center justify-center bg-black font-bold tracking-widest text-yellow-500">
				LOADING FESTIVAL MEDIA...
			</div>
		);
	}

	if (mediaItems.length === 0) {
		return null;
	}

	const currentItem = mediaItems[currentIndex];

	return (
		<div className="featured-movies relative -ml-[50vw] -mr-[50vw] left-1/2 right-1/2 w-full bg-black">
			<div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
				<div className="relative w-full overflow-hidden rounded-sm border border-white/5 bg-zinc-900 shadow-2xl">
					<img
						src={currentItem.poster}
						alt=""
						aria-hidden="true"
						className="absolute inset-0 h-full w-full scale-[1.05] object-cover blur-md opacity-60 transition-opacity duration-1000"
					/>
					<img
						key={currentItem.poster}
						src={currentItem.poster}
						alt={currentItem.title || "Featured Movies Background"}
						className="relative z-10 block h-auto w-full transition-all duration-1000"
					/>
				</div>

				{currentItem.youtubeUrl && (
					<div className="flex justify-end px-2 py-3 md:px-6 md:py-4">
						<a
							href={currentItem.youtubeUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-block w-fit rounded-sm border border-yellow-500 bg-transparent px-3 py-1.5 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-yellow-500 transition-all duration-300 hover:bg-yellow-500 hover:text-black md:px-10 md:py-4 md:text-xs"
						>
							Watch Trailer
						</a>
					</div>
				)}
			</div>
		</div>
	);
};

export default FeaturedMovies;
