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
    <section className="min-h-screen bg-black text-white py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12">
          <Link
            href="/iffa-global"
            className="text-sm text-yellow-400 hover:text-yellow-300"
          >
            Back to IFFA Global
          </Link>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 md:p-10">
          <div className="mb-6 flex items-center justify-center">
            <Image
              src={data.logoSrc}
              alt={`${data.shortTitle} logo`}
              width={240}
              height={80}
              className="h-20 w-auto object-contain"
            />
          </div>

          <h1 className="mb-2 text-center text-3xl font-bold text-yellow-400 md:text-5xl">
            {data.shortTitle}
          </h1>
          <h2 className="mb-4 text-center text-xl font-semibold md:text-2xl">
            {data.title}
          </h2>
          <p className="mx-auto mb-8 max-w-3xl text-center text-gray-300">
            {data.subtitle}
          </p>

          <div className="mb-8 overflow-hidden rounded-xl border border-white/10">
            <Image
              src={data.heroImageSrc}
              alt={data.title}
              width={1600}
              height={900}
              className="h-[260px] w-full object-cover md:h-[360px]"
            />
          </div>

          <p className="mb-8 text-base leading-relaxed text-gray-300 md:text-lg">
            {data.description}
          </p>

          <div className="mb-8 rounded-xl border border-white/10 bg-black/40 p-5">
            <h3 className="mb-4 text-lg font-semibold">Highlights</h3>
            <ul className="space-y-2 text-gray-300">
              {data.highlights.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-yellow-400">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-center">
            <a
              href={data.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-yellow-400 px-6 py-3 text-sm font-bold uppercase tracking-wide text-black hover:brightness-110"
            >
              Visit {data.shortTitle}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
