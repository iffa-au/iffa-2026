import type { StepBlock as StepBlockData } from "../../lib/types";

/** One numbered step in the "how it works" sequence. */
export function StepBlock({ step }: { step: StepBlockData }) {
  return (
    <div className="flex h-full flex-col gap-3.5 rounded-xl border border-white/10 bg-white/5 p-6 transition-colors hover:border-yellow-400/55">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-yellow-400">
        {step.step}
      </p>

      <h3 className="text-lg font-semibold leading-snug text-white">{step.title}</h3>

      <p className="text-sm font-light leading-relaxed text-white/70">{step.body}</p>
    </div>
  );
}
