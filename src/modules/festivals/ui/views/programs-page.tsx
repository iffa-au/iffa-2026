import { programCards } from "../../data/programs-data";
import { Breadcrumb } from "@/modules/shared/components/breadcrumb";
import { ProgramCardItem } from "../components/program-card";

export function ProgramsPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-yellow-400/10 blur-3xl" />
      </div>

      <section className="relative z-10 mx-auto max-w-7xl px-5 pt-12 pb-20 md:px-8 md:pt-16 md:pb-28">
        <Breadcrumb
          crumbs={[
            { label: "Home", href: "/" },
            { label: "Festivals", href: "/festivals" },
            { label: "Programs" },
          ]}
        />

        <header className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-yellow-400">
            Festival 2026-2027
          </p>
          <h1 className="mt-3 text-3xl font-bold uppercase tracking-tight text-white md:text-5xl">
            Programs
          </h1>
          <p className="mt-4 max-w-prose text-sm leading-relaxed text-white/70 md:text-base">
            Choose a category to explore festival learning experiences.
          </p>
          <div className="mt-6 h-px w-40 bg-gradient-to-r from-yellow-400 to-transparent" />
        </header>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 md:mt-14">
          {programCards.map((program) => (
            <ProgramCardItem key={program.slug} program={program} />
          ))}
        </div>
      </section>
    </div>
  );
}
