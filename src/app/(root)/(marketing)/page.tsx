import TrailerSection from "@/modules/home/ui/TrailerVideo";
import FeaturedMovies from "@/modules/home/ui/FeaturedMovies";
import FeaturedSelection from "@/modules/home/ui/FeaturedSelection";
import TextDivider from "@/modules/home/ui/sections/text-divider";
import Carousel from "@/modules/home/ui/views/carousel/Carousel";
import HomeNews from "@/modules/home/News";

export default function Home() {
  return (
    <main className="w-full min-h-screen bg-black">
      <section className="px-6 py-10 text-white">
        
      </section>

      <TrailerSection
        videoslug="Hero_1v"
        title="Oman: A Global Filming Destination"
        youtubeUrl="https://www.youtube.com/watch?v=AdNUJTBD8Sk"
        learnMoreUrl="/oman"
      />

      <TrailerSection
        videoUrl="https://dhbdzeb2cbayq.cloudfront.net/iffa/videos/The_Arab/index.m3u8"
        title="The Arab"
        youtubeUrl="https://youtu.be/kk3jGmIcFi0"
      />

      <TextDivider />

      <div className="relative">
        <FeaturedMovies />
      </div>

      <TrailerSection
        videoslug="Hero_2v"
        title="Cassandra"
        youtubeUrl="https://www.youtube.com/watch?v=7Pp5FiS0Lck"
      />

      <div className="-mt-12 md:-mt-16 lg:-mt-20">
        <FeaturedSelection />
      </div>

      <div className="-mt-8 md:-mt-10 lg:-mt-12">
        <TrailerSection
          videoslug="Hero_3v"
          title="The Stolen Girl"
          youtubeUrl="https://www.youtube.com/watch?v=huMtYtMoN24"
        />
      </div>
            <div className="pt-20 md:pt-24 lg:pt-32">
        <Carousel year={2026} />
      </div>
      <div className="pt-20 md:pt-24 lg:pt-32">
        <Carousel year={2025} />
      </div>

      <div className="h-0" />

      <HomeNews />
    </main>
  );
}
