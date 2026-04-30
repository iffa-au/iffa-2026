import TrailerSection from "@/modules/home/ui/TrailerVideo";
import FeaturedMovies from "@/modules/home/ui/FeaturedMovies";
import FeaturedSelection from "@/modules/home/ui/FeaturedSelection";
import TextDivider from "@/modules/home/ui/sections/text-divider";

const HomeNews = () => (
  <section className="px-6 py-16 bg-black text-white">
    <div className="mx-auto max-w-[1400px]">
      <h2 className="text-2xl font-semibold">Home News</h2>
      <p className="mt-3 text-zinc-300">This placeholder section is ready for home news content.</p>
    </div>
  </section>
);

export default function Home() {
  return (
    <main className="w-full min-h-screen bg-black">
      <section className="px-6 py-10 text-white">
        <h1 className="text-3xl font-semibold">WELCOME TO IFFA 2026</h1>
      </section>

      <TrailerSection
        videoslug="Hero_1v"
        title="Oman: A Global Filming Destination"
        youtubeUrl="https://www.youtube.com/watch?v=AdNUJTBD8Sk"
        learnMoreUrl="/oman"
      />

      <TrailerSection
        videoslug="Hero_2v"
        title="Cassandra"
        youtubeUrl="https://www.youtube.com/watch?v=7Pp5FiS0Lck"
      />

      <TextDivider />

      <div className="relative">
        <FeaturedMovies />
      </div>

      <FeaturedSelection />

      <TrailerSection
        videoslug="Hero_3v"
        title="The Stolen Girl"
        youtubeUrl="https://www.youtube.com/watch?v=huMtYtMoN24"
      />

      

      <HomeNews />
    </main>
  );
}
