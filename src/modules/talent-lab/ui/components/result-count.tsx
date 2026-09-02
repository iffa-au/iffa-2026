type ResultCountProps = {
  count: number;
  /** The thing being counted, e.g. "program". Pluralised here. */
  noun: string;
  /** Override when the plural is irregular. */
  pluralNoun?: string;
};

/**
 * "{n} programs shown".
 *
 * `aria-live="polite"` because filtering changes the result silently for anyone
 * not watching the grid — the count is the only announcement that the page did
 * anything.
 *
 * `count` is always `filterX(...).length` at the call site. No page types a
 * number that describes its own data.
 */
export function ResultCount({ count, noun, pluralNoun }: ResultCountProps) {
  const plural = pluralNoun ?? `${noun}s`;

  return (
    <p
      aria-live="polite"
      className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45"
    >
      {count} {count === 1 ? noun : plural} shown
    </p>
  );
}
