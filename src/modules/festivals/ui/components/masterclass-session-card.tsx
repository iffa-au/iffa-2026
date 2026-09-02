import type { MasterclassSession } from "../../data/masterclass-data";

/**
 * The source mockup crams "Speakers: … / date / time / format" into run-on
 * lines. Here each fact gets its own labelled row so the block can be scanned
 * rather than parsed.
 */
const MetaRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
    <dt className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45 sm:w-24 sm:pt-0.5">
      {label}
    </dt>
    <dd className="text-sm leading-relaxed text-white">{value}</dd>
  </div>
);

export function MasterclassSessionCard({ session }: { session: MasterclassSession }) {
  return (
    <article className="flex h-full flex-col rounded-xl border border-white/10 bg-white/5 p-6 transition-colors duration-300 hover:border-yellow-400/40 md:p-8">
      <header>
        <h3 className="text-xl font-semibold leading-snug text-white md:text-2xl">
          {session.title}
        </h3>
        <p className="mt-3 max-w-prose text-sm leading-relaxed text-white/70">
          {session.description}
        </p>
      </header>

      <div className="my-6 h-px bg-white/10" />

      <dl className="flex flex-col gap-3">
        <MetaRow label="Speakers" value={session.speakers.join(" x ")} />
        <MetaRow label="Date" value={session.date} />
        <MetaRow label="Time" value={session.time} />
        <MetaRow label="Format" value={session.format} />
      </dl>

      <ul className="mt-6 flex flex-wrap gap-2">
        {session.tags.map((tag) => (
          <li
            key={tag}
            className="rounded-full border border-yellow-300/30 bg-yellow-400/5 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.15em] text-yellow-300/90"
          >
            {tag}
          </li>
        ))}
      </ul>

      {/* Deliberately inert: registration has no destination yet. */}
      <div className="mt-auto pt-7">
        <button
          type="button"
          disabled
          aria-disabled="true"
          aria-describedby={`${session.id}-register-note`}
          className="w-full cursor-not-allowed rounded-md border border-yellow-400/50 bg-transparent px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-yellow-400/70 opacity-70 sm:w-auto"
        >
          Register Session
        </button>
        <p
          id={`${session.id}-register-note`}
          className="mt-2 text-[11px] leading-relaxed text-white/45"
        >
          Registration opens soon.
        </p>
      </div>
    </article>
  );
}
