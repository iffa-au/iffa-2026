/**
 * Canonical `fields` keys shared across form payloads. Anything mapped to
 * FULL_NAME / EMAIL / PHONE_NUMBER / COUNTRY / CITY_STATE is already surfaced
 * by the EmailJS admin template's own header table (Full Name / Email /
 * Phone Number / City-State) via the params built in send-confirmation-emails.ts,
 * so build-email-content.ts excludes them from the message body to avoid
 * showing the same value twice.
 *
 * Company and free-text fields (Notes / Synopsis / Brief Project Description)
 * are intentionally left out here — each form's version of those means
 * something slightly different, so forcing one shared label would blur that
 * rather than clean it up.
 */
export const FIELD_KEYS = {
  FULL_NAME: "Full Name",
  EMAIL: "Email Address",
  PHONE_NUMBER: "Phone Number",
  COUNTRY: "Country",
  CITY_STATE: "City/State",
  MESSAGE: "Message",
} as const;
