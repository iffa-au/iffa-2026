"use client";

export type StepState = {
  label: string;
  /** 1-based. */
  number: number;
};

type StepIndicatorProps = {
  steps: readonly StepState[];
  /** 1-based index of the step being shown. */
  current: number;
  /** The highest step reached so far — everything below it is navigable. */
  furthest: number;
  onSelect: (step: number) => void;
};

/**
 * The clickable progress indicator on the application form.
 *
 * Each step is a real `<button>` carrying `aria-current="step"` when it is the
 * one on screen, inside a `<nav>` so the whole thing is one landmark rather
 * than five loose controls.
 *
 * Steps at or before `furthest` are enabled; the ones beyond it are `disabled`
 * with `aria-disabled` and an explanation above the row, because jumping to
 * step 5 from an empty step 1 skips the validation the form exists to perform.
 * Going *back* is always allowed — nothing is lost, and re-reading an earlier
 * answer is not an error.
 */
export function StepIndicator({
  steps,
  current,
  furthest,
  onSelect,
}: StepIndicatorProps) {
  return (
    <nav aria-label="Application progress">
      <ol className="flex flex-wrap gap-2.5">
        {steps.map((step) => {
          const isCurrent = step.number === current;
          const isReachable = step.number <= furthest;
          const isDone = step.number < furthest;

          return (
            <li key={step.number} className="min-w-[132px] flex-1">
              <button
                type="button"
                onClick={() => onSelect(step.number)}
                disabled={!isReachable}
                aria-disabled={!isReachable}
                aria-current={isCurrent ? "step" : undefined}
                className={`flex w-full items-center gap-2.5 rounded-lg border px-3.5 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 ${
                  isReachable
                    ? "border-yellow-400/60 hover:border-yellow-400"
                    : "cursor-not-allowed border-white/12"
                }`}
              >
                <span
                  className={`inline-flex h-6 w-6 flex-none items-center justify-center rounded-full border font-mono text-[10px] ${
                    isCurrent
                      ? "border-yellow-400 bg-yellow-400 text-black"
                      : isDone
                        ? "border-yellow-400/60 bg-yellow-400/20 text-yellow-400"
                        : "border-white/15 text-white/40"
                  }`}
                >
                  {isDone ? <span aria-hidden="true">✓</span> : step.number}
                </span>

                <span
                  className={`font-mono text-[9.5px] uppercase tracking-[0.14em] ${
                    isCurrent ? "text-white" : "text-white/45"
                  }`}
                >
                  {step.label}
                </span>

                <span className="sr-only">
                  {isCurrent
                    ? " — current step"
                    : isReachable
                      ? " — completed, select to review"
                      : " — not yet available, finish the current step first"}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
