"use client";

type SearchFieldProps = {
  id: string;
  /** Visible mono label — this is a real `<label htmlFor>`, not a placeholder. */
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  /** Optional clear-filters button rendered on the same row. */
  children?: React.ReactNode;
};

/**
 * The search input used by the opportunities and resource pages.
 *
 * `type="search"` and a real associated `<label>`. A placeholder is not a
 * label: it disappears the moment someone types, and it is not announced as the
 * field's name — so both are present here rather than one standing in for the
 * other.
 */
export function SearchField({
  id,
  label,
  placeholder,
  value,
  onChange,
  children,
}: SearchFieldProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <label
        htmlFor={id}
        className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60"
      >
        {label}
      </label>

      <input
        id={id}
        type="search"
        value={value}
        placeholder={placeholder}
        onChange={(fieldEvent) => onChange(fieldEvent.target.value)}
        className="h-11 min-w-[220px] flex-1 rounded-lg border border-white/15 bg-white/5 px-3.5 text-sm text-white placeholder:text-white/35 focus-visible:border-yellow-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
      />

      {children}
    </div>
  );
}

/** The "Clear filters" button that sits beside a search field. */
export function ClearFiltersButton({ onClear }: { onClear: () => void }) {
  return (
    <button
      type="button"
      onClick={onClear}
      className="h-11 rounded-lg border border-white/15 px-5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/70 transition-colors hover:border-yellow-400 hover:text-yellow-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
    >
      Clear filters
    </button>
  );
}
