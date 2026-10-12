"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { fetchJsonCached } from "@/lib/media-cache";

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

/** How long the incoming banner takes to push the outgoing one off to the left. */
const SLIDE_MS = 900;
/** How long each banner holds, fully in place, once its slide has finished. */
const HOLD_MS = 3500;
/** Every banner gets the same slot, measured from the moment it starts sliding in. */
const SLOT_MS = SLIDE_MS + HOLD_MS;
/** A smooth start and a soft landing — no snap at either end of the slide. */
const SLIDE_EASING = "cubic-bezier(0.65, 0, 0.35, 1)";
/** The frame's shape until the first banner reports its own. */
const DEFAULT_RATIO = 16 / 9;

const buildCloudFrontUrl = (key: string) => {
	const normalizedBase = CLOUDFRONT_URL.endsWith("/")
		? CLOUDFRONT_URL.slice(0, -1)
		: CLOUDFRONT_URL;
	const normalizedKey = key.startsWith("/") ? key : `/${key}`;
	return `${normalizedBase}${normalizedKey}`;
};

// A background tab shouldn't keep rotating: browsers throttle its timers, and
// the viewer comes back to a banner that changes the instant they look.
const subscribeToPageVisibility = (onChange: () => void) => {
	document.addEventListener("visibilitychange", onChange);
	return () => document.removeEventListener("visibilitychange", onChange);
};
const isPageVisible = () => !document.hidden;

type LoadStatus = "loaded" | "error";

const FeaturedMovies = () => {
	/*
	  One element that stays mounted through every state. The observers attach
	  to it once; when the placeholder used to be swapped for the banner, they
	  were left watching a detached node and the off-screen pause never fired.
	*/
	const containerRef = useRef<HTMLDivElement>(null);
	const [mediaItems, setMediaItems] = useState<FeaturedMovieMediaItem[]>([]);
	const [hasFetched, setHasFetched] = useState(false);
	const [isNear, setIsNear] = useState(false);
	const [isOnScreen, setIsOnScreen] = useState(false);
	const pageVisible = useSyncExternalStore(subscribeToPageVisibility, isPageVisible, () => true);

	const [activeIndex, setActiveIndex] = useState(0);
	// The banner being pushed out. Only it and the active banner animate; the
	// rest wait off to the right without a transition, so a banner moving back
	// into the queue never visibly crosses the frame.
	const [previousIndex, setPreviousIndex] = useState<number | null>(null);
	// The furthest banner the rotation has reached. Images are mounted one ahead
	// of it rather than all ten at once, so a visitor who scrolls past after one
	// banner downloads two, not ten.
	const [furthestIndex, setFurthestIndex] = useState(0);
	const [loadStatus, setLoadStatus] = useState<Record<string, LoadStatus>>({});
	// Each banner's own width/height. The artwork is shown whole — it can't be
	// cropped — so the frame takes the shape of whichever banner is in it.
	const [ratios, setRatios] = useState<Record<string, number>>({});
	const shownAtRef = useRef(0);

	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;

		// Starts the fetch a little before the section arrives…
		const nearObserver = new IntersectionObserver(
			([entry]) => setIsNear(entry.isIntersecting),
			{ rootMargin: "200px" },
		);
		// …but the rotation only runs while it can actually be seen.
		const screenObserver = new IntersectionObserver(
			([entry]) => setIsOnScreen(entry.isIntersecting),
			{ threshold: 0.25 },
		);

		nearObserver.observe(el);
		screenObserver.observe(el);
		return () => {
			nearObserver.disconnect();
			screenObserver.disconnect();
		};
	}, []);

	useEffect(() => {
		if (!isNear || hasFetched || !API_URL) return;

		let cancelled = false;

		const fetchMedia = async () => {
			try {
				const mediaPromises = Array.from({ length: 10 }, async (_, i) => {
					const title = `Hero_${i + 1}i`;
					return fetchJsonCached<MediaApiResponse>(
						`${API_URL}/media-assets/title/${title}`,
					);
				});

				const results = await Promise.all(mediaPromises);
				if (cancelled) return;

				const formattedData = results
					.filter((item): item is MediaApiResponse =>
						Boolean(item && item.s3Key),
					)
					.map((item) => ({
						title: item.title,
						poster: buildCloudFrontUrl(item.s3Key as string),
						youtubeUrl: item.youtubeUrl || "https://www.youtube.com/iffa",
					}));

				setMediaItems(formattedData);
			} catch (error) {
				console.error("Error fetching media assets:", error);
			} finally {
				if (!cancelled) setHasFetched(true);
			}
		};

		void fetchMedia();
		return () => {
			cancelled = true;
		};
	}, [isNear, hasFetched]);

	const count = mediaItems.length;
	const statusOf = (index: number) => loadStatus[mediaItems[index]?.poster];

	// The next banner that hasn't failed to load. A broken image is skipped
	// rather than shown as an empty frame.
	let nextIndex = activeIndex;
	for (let step = 1; step < count; step++) {
		const candidate = (activeIndex + step) % count;
		if (statusOf(candidate) !== "error") {
			nextIndex = candidate;
			break;
		}
	}

	const isPlaying = count > 1 && isOnScreen && pageVisible;
	const activeStatus = statusOf(activeIndex);
	const nextReady = statusOf(nextIndex) === "loaded";

	// A banner's slot starts when it begins to slide in, and starts over after
	// any pause — scrolling back to the section never cuts straight to the next
	// banner. Rotation only ever moves onto a banner
	// that has loaded, but the very first one is active before it arrives, so
	// its slot waits for `activeStatus` too rather than spending it on a blank.
	useEffect(() => {
		shownAtRef.current = performance.now();
	}, [activeIndex, isPlaying, activeStatus]);

	useEffect(() => {
		if (!isPlaying || nextIndex === activeIndex) return;
		// Wait for the next banner to be fully downloaded before moving on: the
		// current one holds a little longer rather than sliding in a blank.
		if (!nextReady) return;

		// A broken current banner has nothing to hold, so move on at once.
		const elapsed = performance.now() - shownAtRef.current;
		const delay = activeStatus === "error" ? 0 : Math.max(0, SLOT_MS - elapsed);

		const timer = setTimeout(() => {
			setPreviousIndex(activeIndex);
			setActiveIndex(nextIndex);
			setFurthestIndex((furthest) => Math.max(furthest, nextIndex));
		}, delay);

		return () => clearTimeout(timer);
	}, [isPlaying, activeIndex, nextIndex, nextReady, activeStatus]);

	const markStatus = (poster: string, status: LoadStatus) =>
		setLoadStatus((prev) => (prev[poster] === status ? prev : { ...prev, [poster]: status }));

	// Nothing to show: no API configured, or it answered with no banners.
	if (!API_URL || (hasFetched && count === 0)) {
		return <div ref={containerRef} className="hidden" />;
	}

	const markRatio = (poster: string, img: HTMLImageElement) => {
		if (!img.naturalWidth || !img.naturalHeight) return;
		const ratio = img.naturalWidth / img.naturalHeight;
		setRatios((prev) => (prev[poster] === ratio ? prev : { ...prev, [poster]: ratio }));
	};

	const currentItem = count > 0 ? mediaItems[activeIndex] : null;
	const frameRatio = (currentItem && ratios[currentItem.poster]) || DEFAULT_RATIO;
	const motion = {
		transitionDuration: `${SLIDE_MS}ms`,
		transitionTimingFunction: SLIDE_EASING,
	};

	return (
		<div
			ref={containerRef}
			className="featured-movies relative w-full max-w-6xl mx-auto bg-black"
		>
			{/*
			  The frame is sized by percentage padding — relative to its width —
			  so it holds the active banner's exact shape at any screen size, and
			  eases to the next banner's shape in step with the slide instead of
			  jumping the page below it.
			*/}
			<div
				role="region"
				aria-roledescription="carousel"
				aria-label="Featured films"
				style={{ paddingTop: `${100 / frameRatio}%`, ...motion }}
				className="relative w-full overflow-hidden rounded-sm border border-white/5 bg-black shadow-2xl transition-[padding-top] motion-reduce:transition-none"
			>
				{mediaItems.map((item, index) => {
					const isMounted = index <= furthestIndex + 1 || index === nextIndex;
					if (!isMounted) return null;

					const isActive = index === activeIndex;
					const isPrevious = index === previousIndex && !isActive;
					const isLoaded = loadStatus[item.poster] === "loaded";

					/*
					  Three places a banner can be: in the frame (active, once
					  loaded), pushed out to the left (the one it replaced), or
					  waiting on the right. Only the first two animate — a banner
					  returning to the queue jumps straight from left to right while
					  it is out of sight, instead of sliding back across the frame.
					*/
					const position = isActive && isLoaded
						? "translate-x-0"
						: isPrevious
							? "-translate-x-full"
							: "translate-x-full";
					const animates = isActive || isPrevious;

					return (
						<Image
							key={item.poster}
							src={item.poster}
							alt={isActive ? item.title || "Featured film" : ""}
							aria-hidden={!isActive}
							fill
							sizes="(min-width: 1152px) 1152px, 100vw"
							loading="eager"
							onLoad={(e) => {
								markRatio(item.poster, e.currentTarget);
								markStatus(item.poster, "loaded");
							}}
							onError={() => markStatus(item.poster, "error")}
							style={animates ? motion : undefined}
							// `contain`, never `cover`: the artwork is licensed as
							// supplied and must not be cropped. At rest the frame
							// matches the banner's shape exactly, so nothing shows
							// around it.
							className={`object-contain ${position} ${
								animates ? "transition-transform motion-reduce:transition-none" : ""
							} ${isActive ? "z-20" : isPrevious ? "z-10" : "z-0"}`}
						/>
					);
				})}
			</div>

			{currentItem?.youtubeUrl && (
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
	);
};

export default FeaturedMovies;
