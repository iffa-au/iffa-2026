"use client";

/**
 * The controls both Talent Lab forms are built from.
 *
 * Native `<input>`, `<select>`, `<textarea>` and `<input type="checkbox">`
 * rather than the repo's Radix-backed wrappers. That is deliberate: a native
 * control accepts the id `form-field` generates, so the `<label htmlFor>`
 * association is real rather than approximated, and keyboard behaviour, form
 * reset, autofill and mobile pickers all work without being re-implemented.
 * The design's own markup uses native controls for the same fields.
 *
 * Every control carries the same focus ring. The invalid state is a border
 * colour *and* the error text `form-field` renders — never colour alone.
 */

const BASE =
  "w-full rounded-lg border bg-white/5 text-[15px] text-white transition-colors placeholder:text-white/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400";

const borderFor = (invalid: boolean) =>
  invalid ? "border-[#F5A25A]/70" : "border-white/15 hover:border-white/30";

/** The id / aria bundle `form-field` hands to its child. */
export type ControlProps = {
  id: string;
  "aria-describedby": string | undefined;
  "aria-invalid": boolean;
  "aria-required": boolean;
};

type TextControlProps = ControlProps &
  React.InputHTMLAttributes<HTMLInputElement>;

export function TextControl({ ...props }: TextControlProps) {
  return (
    <input
      {...props}
      className={`h-12 px-3.5 ${BASE} ${borderFor(props["aria-invalid"])}`}
    />
  );
}

type TextAreaControlProps = ControlProps &
  React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function TextAreaControl({ rows = 4, ...props }: TextAreaControlProps) {
  return (
    <textarea
      {...props}
      rows={rows}
      className={`resize-y px-3.5 py-3 leading-relaxed ${BASE} ${borderFor(props["aria-invalid"])}`}
    />
  );
}

type SelectControlProps = ControlProps &
  React.SelectHTMLAttributes<HTMLSelectElement> & {
    options: readonly string[];
    /** The empty first entry. Selecting it leaves the field unanswered. */
    placeholder?: string;
  };

export function SelectControl({
  options,
  placeholder = "Select…",
  ...props
}: SelectControlProps) {
  return (
    <select
      {...props}
      className={`h-12 px-3 ${BASE} ${borderFor(props["aria-invalid"])}`}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option} value={option} className="bg-[#0e0d13]">
          {option}
        </option>
      ))}
    </select>
  );
}

type CheckboxRowProps = {
  id: string;
  label: React.ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** "Required" / "Optional" — stated in words beside the label. */
  flag?: "required" | "optional";
  error?: string;
  describedBy?: string;
};

/**
 * A single checkbox and its label.
 *
 * A real `<input type="checkbox">` inside a `<label>`, so the whole row is a
 * click target and Space toggles it — the design draws these as styled buttons
 * with `aria-pressed`, which reads as a toggle button rather than a consent
 * checkbox. `accent-color` gives the native control the gold tick without
 * replacing it.
 */
export function CheckboxRow({
  id,
  label,
  checked,
  onChange,
  flag,
  error,
  describedBy,
}: CheckboxRowProps) {
  const errorId = `${id}-error`;
  const describedByValue =
    [describedBy, error ? errorId : null].filter(Boolean).join(" ") || undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="flex cursor-pointer items-start gap-3 text-sm font-light leading-relaxed text-white/85"
      >
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(changeEvent) => onChange(changeEvent.target.checked)}
          aria-invalid={Boolean(error)}
          aria-describedby={describedByValue}
          className="mt-0.5 h-4 w-4 flex-none accent-[#E6BA35] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
        />

        <span>
          {label}
          {flag && (
            <span
              className={`pl-2 font-mono text-[9px] uppercase tracking-[0.14em] ${
                flag === "required" ? "text-yellow-400" : "text-white/45"
              }`}
            >
              · {flag}
            </span>
          )}
        </span>
      </label>

      {error && (
        <p
          id={errorId}
          role="alert"
          className="flex items-start gap-1.5 pl-7 text-xs leading-relaxed text-[#F5A25A]"
        >
          <span aria-hidden="true">!</span>
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * The summary shown after a failed submit.
 *
 * A form that only marks its individual fields leaves someone who pressed
 * Submit at the bottom of a long page with no idea anything happened. This is
 * `role="alert"`, so it is announced, and it says how many fields need
 * attention rather than just going red.
 */
export function FormErrorSummary({ count }: { count: number }) {
  if (count === 0) return null;

  return (
    <p
      role="alert"
      className="flex items-start gap-2.5 rounded-lg border border-[#F5A25A]/50 bg-[#F5A25A]/10 px-4 py-3 text-sm leading-relaxed text-[#F5A25A]"
    >
      <span aria-hidden="true">⚠</span>
      {count === 1
        ? "One field needs your attention before this can be submitted."
        : `${count} fields need your attention before this can be submitted.`}
    </p>
  );
}

/** The gold submit / continue button both forms use. */
export function PrimaryFormButton({
  children,
  type = "submit",
  onClick,
}: {
  children: React.ReactNode;
  type?: "submit" | "button";
  onClick?: () => void;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="inline-flex items-center justify-center rounded-sm border border-yellow-400 bg-yellow-400 px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-black transition-colors hover:bg-yellow-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
    >
      {children}
    </button>
  );
}

/** The outline secondary button both forms use. */
export function SecondaryFormButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center justify-center rounded-sm border border-white/20 px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:border-yellow-400 hover:text-yellow-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
    >
      {children}
    </button>
  );
}
