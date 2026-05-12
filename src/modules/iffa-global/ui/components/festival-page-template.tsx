import Link from "next/link";
import Image from "next/image";
import { FestivalContent } from "@/modules/iffa-global/lib/festival-data";

type FestivalPageTemplateProps = {
  data: FestivalContent;
};

export default function FestivalPageTemplate({
  data,
}: FestivalPageTemplateProps) {
  return (
    <section className="min-h-screen bg-black py-16 text-white">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-8">
          <Link
            href="/iffa-global"
            className="text-sm text-yellow-400 transition hover:text-yellow-300"
          >
            Back to IFFA Global
          </Link>
        </div>

        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-yellow-400 md:text-5xl">
            Learn More About {data.shortTitle}
          </h1>
          <p className="text-xs uppercase tracking-[0.2em] text-yellow-300 sm:text-sm">
            {data.title}
          </p>
        </div>

        <div className="space-y-5 text-sm leading-relaxed text-gray-300 sm:text-base">
          <p>{data.description}</p>
          <p>
            {data.shortTitle} operates as part of the IFFA Global network to
            strengthen international collaboration, creative exchange, and
            industry development across regions.
          </p>
        </div>

        <div className="mt-12">
          <div className="mb-6 flex items-center gap-4">
            <h2 className="whitespace-nowrap text-xl font-bold uppercase tracking-[0.2em] text-white">
              Key <span className="text-yellow-400">Highlights</span>
            </h2>
            <div className="h-px w-full bg-white/20"></div>
          </div>
          <div className="space-y-4">
            {data.highlights.map((item) => (
              <article
                key={item}
                className="rounded-xl border border-white/10 bg-white/5 p-5"
              >
                <p className="text-sm leading-relaxed text-gray-300 sm:text-base">
                  {item}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-10 rounded-xl border border-white/10 bg-white/5 p-6">
          <div className="mb-5 flex items-center justify-center">
            <Image
              src={data.logoSrc}
              alt={`${data.shortTitle} logo`}
              width={220}
              height={70}
              className="h-16 w-auto object-contain"
            />
          </div>
          <div className="mb-6 overflow-hidden rounded-xl border border-white/10">
            <Image
              src={data.heroImageSrc}
              alt={data.title}
              width={1600}
              height={900}
              className="h-[220px] w-full object-cover md:h-[300px]"
            />
          </div>
          <p className="text-sm leading-relaxed text-gray-300 sm:text-base">
            For detailed information regarding film submissions, participation
            opportunities, partnerships, and programme updates, please visit the
            official {data.shortTitle} website:
          </p>
          <a
            href={data.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block rounded-md bg-yellow-400 px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-black transition hover:brightness-110 sm:text-sm"
          >
            Visit {data.shortTitle} Website
          </a>
        </div>
      </div>
    </section>
  );
}
