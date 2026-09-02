type EmptyStateProps = {
  /** What happened, in plain words. */
  message: string;
  /** Optional second line offering a way forward. */
  hint?: string;
  /** Clear-filters button, a register CTA, or both. */
  children?: React.ReactNode;
};

/**
 * Shown when a filter combination matches nothing.
 *
 * An empty result is a dead end unless it comes with a way out, so the action
 * slot is where the caller puts "Clear filters" and, where it makes sense,
 * "Register your interest" — the two things a user in this position actually
 * wants.
 *
 * `role="status"` means the message is announced when filtering empties the
 * list, rather than silently replacing the results for anyone not watching.
 */
export function EmptyState({ message, hint, children }: EmptyStateProps) {
  return (
    <div
      role="status"
      className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-14 text-center"
    >
      <p className="text-base font-medium text-white">{message}</p>

      {hint && (
        <p className="max-w-prose text-sm font-light leading-relaxed text-white/60">
          {hint}
        </p>
      )}

      {children && <div className="mt-2 flex flex-wrap justify-center gap-3">{children}</div>}
    </div>
  );
}
