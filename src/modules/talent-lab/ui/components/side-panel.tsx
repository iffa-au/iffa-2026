type SidePanelProps = {
  /** Mono heading. Rendered as an `<h2>` so the rail is navigable by heading. */
  eyebrow: string;
  /** "gold" for the page's primary action rail; "plain" for supporting detail. */
  tone?: "gold" | "plain";
  children: React.ReactNode;
};

/**
 * One card in a detail page's sidebar rail.
 *
 * The program and event detail pages both run a sticky rail of these: the gold
 * one carries the page's primary action, the plain ones carry supporting facts.
 * Tone is a prop rather than two components because the two differ only in
 * their border and wash — everything structural is shared.
 */
export function SidePanel({ eyebrow, tone = "plain", children }: SidePanelProps) {
  const toneClasses =
    tone === "gold"
      ? "border-yellow-400/35 bg-yellow-400/[0.06]"
      : "border-white/10 bg-white/5";

  return (
    <div className={`flex flex-col gap-4 rounded-xl border p-6 md:p-7 ${toneClasses}`}>
      <h2
        className={`font-mono text-[10px] uppercase leading-relaxed tracking-[0.2em] ${
          tone === "gold" ? "text-yellow-400" : "text-white/60"
        }`}
      >
        {eyebrow}
      </h2>

      {children}
    </div>
  );
}

/** The sticky rail the panels sit in. Static below `lg`, where there is no rail. */
export function SideRail({ children }: { children: React.ReactNode }) {
  return (
    <aside className="flex flex-col gap-5 lg:sticky lg:top-28 lg:self-start">
      {children}
    </aside>
  );
}
