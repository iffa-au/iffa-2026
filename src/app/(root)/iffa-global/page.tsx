import Link from "next/link";
import Image from "next/image";
import { festivalData, festivalSlugs } from "@/modules/iffa-global/lib/festival-data";

const reasons = [
  "International platforms for emerging filmmakers",
  "Skills development and mentorship",
  "Cross-cultural collaboration through cinema",
];

export default function IffaGlobalPage() {
  return (
    <section className="min-h-screen bg-black py-16 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-yellow-400 md:text-6xl">
            IFFA Global
          </h1>
          <div className="mx-auto mb-6 h-1 w-24 bg-gradient-to-r from-yellow-500 to-yellow-300"></div>
          <p className="mx-auto max-w-3xl text-sm leading-relaxed text-gray-300 sm:text-base">
            IFFA Global connects festivals that bridge cultures and support
            emerging filmmakers on a global stage.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {festivalSlugs.map((slug) => {
            const item = festivalData[slug];

            return (
              <article
                key={item.slug}
                className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:border-yellow-400/40 hover:bg-white/10"
              >
                <div className="mb-6 flex h-28 items-center justify-center">
                  <Image
                    src={item.logoSrc}
                    alt={`${item.shortTitle} logo`}
                    width={240}
                    height={200}
                    className="h-20 w-auto object-contain opacity-95 transition-opacity group-hover:opacity-100"
                  />
                </div>
                <h2 className="mb-4 text-center text-lg font-bold uppercase tracking-wide text-yellow-400">
                  {item.title}
                </h2>
                <p className="min-h-20 text-center text-sm leading-relaxed text-gray-300 sm:text-base">
                  {item.description}
                </p>

                <div className="mt-6 flex items-center justify-center gap-3">
                  <a
                    href={item.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-md bg-yellow-400 px-4 py-2 text-xs font-bold uppercase tracking-wide text-black transition hover:brightness-110 sm:text-sm"
                  >
                    Visit {item.shortTitle}
                  </a>
                  <Link
                    href={`/iffa-global/${item.slug}`}
                    className="rounded-md border border-white/30 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white transition hover:border-yellow-400 hover:text-yellow-400 sm:text-sm"
                  >
                    Learn More
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mb-12 mt-12">
          <div className="mb-6 flex items-center gap-4">
            <h2 className="whitespace-nowrap text-xl font-bold uppercase tracking-[0.2em] text-white">
              Why <span className="text-yellow-400">IFFA Global</span>
            </h2>
            <div className="h-px w-full bg-white/20"></div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
            <ul className="space-y-3 text-sm text-gray-300 sm:text-base">
              {reasons.map((reason) => (
                <li key={reason} className="flex items-start gap-3">
                  <span className="mt-1 text-yellow-400">•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 border-t border-white/10 pt-8">
          {festivalSlugs.map((slug) => {
            const item = festivalData[slug];
            return (
              <a
                key={`explore-${item.slug}`}
                href={item.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md bg-yellow-400 px-6 py-2.5 text-xs font-bold uppercase tracking-wide text-black transition hover:brightness-110 sm:text-sm"
              >
                Explore {item.shortTitle}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
