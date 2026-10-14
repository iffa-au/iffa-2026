import FeaturedMovies from "@/modules/home/ui/FeaturedMovies";
import FeaturedSelection from "@/modules/home/ui/FeaturedSelection";
import TextDivider from "@/modules/home/ui/sections/text-divider";
import Carousel from "@/modules/home/ui/views/carousel/Carousel";
import HomeNews from "@/modules/home/News";
import HeroBanner from "@/modules/home/ui/sections/hero-banner";
import {
  HomepageTrailersProvider,
  TrailerSlot,
} from "@/modules/home/ui/homepage-trailers";

export default function Home() {
  return (
    <main className="w-full min-h-screen bg-black">
      <HomepageTrailersProvider>
        <HeroBanner />

        {/* Five fixed trailer slots, filled in order from cms-hub (Site
            content → Homepage trailers). See modules/home/ui/homepage-trailers.tsx. */}
        <TrailerSlot index={0} />

        <TrailerSlot index={1} />

        <TextDivider />
        <TrailerSlot index={2} />

        <div className="relative">
          <FeaturedMovies />
        </div>

        {/* The overlaps around slots 3 and 4 sit on the slots themselves, so
            they disappear with an empty slot instead of pulling
            FeaturedSelection into FeaturedMovies (or the carousel up). */}
        <TrailerSlot index={3} className="-mb-12 md:-mb-16 lg:-mb-20" />

        <FeaturedSelection />

        <TrailerSlot index={4} className="-mt-8 md:-mt-10 lg:-mt-12" />
        {/* Only 2026: the carousel fetches `isFeatured` films, and the CMS
            picker that sets that flag isn't year-scoped — every featured film
            is currently 2026, so a 2025 row fetches nothing and renders null. */}
        <div className="pt-20 md:pt-24 lg:pt-32">
          <Carousel year={2026} />
        </div>

        <div className="h-0" />

        <HomeNews />
      </HomepageTrailersProvider>
    </main>
  );
}
