"use client";

import { useId } from "react";

type FormFieldProps = {
  label: string;
  /** Marked visibly, not just by a red asterisk convention. */
  required?: boolean;
  /** Shown under the control, and wired to the input via `aria-describedby`. */
  helper?: string;
  /** Present => the field is invalid. */
  error?: string;
  /**
   * How the label attaches to what it names.
   *
   * `"control"` (the default) renders a real `<label htmlFor>` and is correct
   * for anything that accepts our generated id — every `<input>`, `<select>`
   * and `<textarea>`.
   *
   * `"group"` is for a composite widget that owns its own focusable trigger and
   * takes no id from us — `multi-select-dropdown` is the only one. There, the
   * label becomes a `<span>` naming a `role="group"` wrapper via
   * `aria-labelledby`, so the field still has a real programmatic name instead
   * of a `<label htmlFor>` pointing at an element that does not exist.
   */
  labelling?: "control" | "group";
  /** Receives the ids to attach to the control. */
  children: (props: {
    id: string;
    "aria-describedby": string | undefined;
    "aria-invalid": boolean;
    "aria-required": boolean;
  }) => React.ReactNode;
};

/**
 * Mono label, control, helper text and an explicit error line.
 *
 * The render-prop shape exists so the ids are generated once here and handed to
 * whatever control the caller renders — a `<label htmlFor>` that points at
 * nothing is the single most common way a form ends up unusable with a screen
 * reader, and this makes that impossible to get wrong.
 *
 * Errors are announced through `role="alert"` and stated in words. A red border
 * alone tells nobody what is wrong. Optional fields are labelled "optional"
 * rather than leaving the user to infer it from the absence of an asterisk.
 */
export function FormField({
  label,
  required = false,
  helper,
  error,
  labelling = "control",
  children,
}: FormFieldProps) {
  const id = useId();
  const helperId = `${id}-helper`;
  const errorId = `${id}-error`;
  const labelId = `${id}-label`;

  const describedBy =
    [helper ? helperId : null, error ? errorId : null].filter(Boolean).join(" ") ||
    undefined;

  const labelContent = (
    <>
      {label}
      {required ? (
        <span className="pl-1 text-yellow-400">*</span>
      ) : (
        <span className="pl-1.5 normal-case tracking-normal text-white/40">
          (optional)
        </span>
      )}
    </>
  );

  const labelClass =
    "font-mono text-[10px] uppercase tracking-[0.18em] text-white/70";

  const control = children({
    id,
    "aria-describedby": describedBy,
    "aria-invalid": Boolean(error),
    "aria-required": required,
  });

  return (
    <div className="flex flex-col gap-2">
      {labelling === "group" ? (
        <span id={labelId} className={labelClass}>
          {labelContent}
        </span>
      ) : (
        <label htmlFor={id} className={labelClass}>
          {labelContent}
        </label>
      )}

      {labelling === "group" ? (
        <div
          role="group"
          aria-labelledby={labelId}
          aria-describedby={describedBy}
        >
          {control}
        </div>
      ) : (
        control
      )}

      {helper && (
        <p id={helperId} className="text-xs font-light leading-relaxed text-white/50">
          {helper}
        </p>
      )}

      {error && (
        <p
          id={errorId}
          role="alert"
          className="flex items-start gap-1.5 text-xs leading-relaxed text-[#F5A25A]"
        >
          <span aria-hidden="true">!</span>
          {error}
        </p>
      )}
    </div>
  );
}
