import type { BaseSyntheticEvent } from "react";

/**
 * Sends the Talent Lab Apply and Register forms to cms-hub
 * (`POST /talent-lab/applications` and `/talent-lab/registrations`), which
 * saves them, emails the applicant a confirmation and notifies IFFA.
 */

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/+$/, "");

/** The hidden honeypot's value, read from the submitted form element. */
export function honeypotValue(event?: BaseSyntheticEvent): string {
  const formEl = event?.target;
  if (!(formEl instanceof HTMLFormElement)) return "";
  return String(new FormData(formEl).get("homepage") ?? "");
}

export class FormSubmitError extends Error {}

/**
 * POSTs one form and returns the server's JSON. Throws FormSubmitError with a
 * message fit to show the person, so the form can stay filled in and let them
 * try again rather than losing what they typed.
 */
export async function postTalentLabForm<T = { success: boolean; data?: { reference?: string } }>(
  path: "/talent-lab/applications" | "/talent-lab/registrations",
  body: Record<string, unknown>,
): Promise<T> {
  if (!API_BASE) {
    throw new FormSubmitError("The form can't be sent right now. Please try again later.");
  }
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new FormSubmitError(
      "We couldn't reach IFFA just now. Check your connection and try again — your answers are still here.",
    );
  }
  const json = (await res.json().catch(() => ({}))) as { message?: string };
  if (!res.ok) {
    throw new FormSubmitError(
      res.status === 400 && json.message
        ? `Something in the form needs another look: ${json.message}.`
        : "Something went wrong on our side. Please try again in a moment — your answers are still here.",
    );
  }
  return json as T;
}
