const POSTER_URL = "https://dhbdzeb2cbayq.cloudfront.net/iffa/images/high-rollers.jpg";
const YOUTUBE_URL = "https://www.youtube.com/watch?v=NhaXDfYundI";

const FeaturedSelection = () => {

  return (
    <section className="w-full bg-black px-6 py-24 md:px-20">
      <div className="mx-auto max-w-[1400px]">
        <h2 className="mb-16 text-center text-3xl font-bold tracking-tight text-white md:text-5xl">
          Featured <span className="text-yellow-500">Selection</span>
        </h2>

        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-stretch">
          <div className="group min-h-[400px] w-full overflow-hidden rounded-sm shadow-2xl md:min-h-[600px] lg:w-1/2">
            <div className="relative h-full min-h-[400px] w-full md:min-h-[600px]">
              <img
                  src={POSTER_URL}
                  alt="High Rollers"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
            </div>
          </div>

          <div className="flex w-full flex-col justify-center rounded-sm border border-white/5 bg-zinc-900/30 p-8 md:p-12 lg:w-1/2">
            <div className="mb-6 flex items-center gap-2 text-yellow-500">
              <span className="text-xs font-bold uppercase tracking-[0.3em]">* Must Watch</span>
            </div>

            <h3 className="mb-8 text-4xl font-bold leading-none text-white md:text-6xl">
              High <span className="text-yellow-500">Rollers</span>
            </h3>

            <p className="mb-10 text-lg font-light leading-relaxed text-gray-400">
              In a world where every gamble could be your last, master thief Mason must outwit merciless
              foes and the law to save the woman he loves. A high-stakes heist thriller that pits greed,
              loyalty, and courage against impossible odds.
            </p>

            <div className="mb-12 grid grid-cols-2 gap-x-4 gap-y-8 border-t border-white/10 pt-8">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-500">Director</p>
                <p className="font-medium text-white">Randall Emmett</p>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-500">Genre</p>
                <p className="font-medium text-white">Action / Thriller</p>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-500">Runtime</p>
                <p className="font-medium text-white">102 minutes</p>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-500">Country</p>
                <p className="font-medium text-white">United States</p>
              </div>
            </div>

            <a
              href={YOUTUBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-fit rounded-sm border border-yellow-500 px-10 py-4 text-center text-xs font-bold uppercase tracking-[0.2em] text-yellow-500 transition-all duration-300 hover:bg-yellow-500 hover:text-black"
            >
              Watch Trailer
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSelection;