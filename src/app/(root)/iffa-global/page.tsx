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
    <section className="min-h-screen bg-black py-20 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 text-center">
          <h1 className="mb-3 text-4xl font-bold md:text-6xl">IFFA Global</h1>
          <p className="mx-auto max-w-3xl text-sm text-gray-300 sm:text-base">
            IFFA Global connects festivals that bridge cultures and support
            emerging filmmakers on a global stage.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {festivalSlugs.map((slug) => {
            const item = festivalData[slug];

            return (
              <article
                key={item.slug}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
              >
                <div className="mb-5 flex h-24 items-center justify-center">
                  <Image
                    src={item.logoSrc}
                    alt={`${item.shortTitle} logo`}
                    width={240}
                    height={80}
                    className="h-20 w-auto object-contain"
                  />
                </div>
                <h2 className="mb-2 text-center text-lg font-bold text-yellow-400">
                  {item.shortTitle}
                </h2>
                <p className="mb-6 text-center text-sm text-gray-300">
                  {item.subtitle}
                </p>

                <div className="flex justify-center gap-3">
                  <a
                    href={item.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-md bg-yellow-400 px-4 py-2 text-xs font-bold uppercase tracking-wide text-black hover:brightness-110"
                  >
                    Visit {item.shortTitle}
                  </a>
                  <Link
                    href={`/iffa-global/${item.slug}`}
                    className="rounded-md border border-white/30 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white hover:border-yellow-400 hover:text-yellow-400"
                  >
                    Learn More
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="mb-4 text-lg font-semibold">
            Why <span className="text-yellow-400">IFFA Global</span>
          </h3>
          <ul className="space-y-2 text-gray-300">
            {reasons.map((reason) => (
              <li key={reason} className="flex gap-2">
                <span className="text-yellow-400">•</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
