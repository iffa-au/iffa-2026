"use client";

import { useEffect, useRef, useState } from "react";

type LazyBackgroundVideoProps = {
	src: string;
	className?: string;
};

export function LazyBackgroundVideo({
	src,
	className = "absolute inset-0 w-full h-full object-cover",
}: LazyBackgroundVideoProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const videoRef = useRef<HTMLVideoElement>(null);
	const [shouldLoad, setShouldLoad] = useState(false);

	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setShouldLoad(true);
				} else {
					videoRef.current?.pause();
				}
			},
			{ threshold: 0.1, rootMargin: "120px" },
		);

		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		const video = videoRef.current;
		if (!shouldLoad || !video) return;

		video.src = src;
		video.load();
		video.play().catch(() => {});
	}, [shouldLoad, src]);

	return (
		<div ref={containerRef} className="absolute inset-0">
			<video
				ref={videoRef}
				className={className}
				loop
				muted
				playsInline
				preload="none"
			/>
		</div>
	);
}
