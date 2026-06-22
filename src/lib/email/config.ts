import type { FormType } from "./types";

/** EmailJS — existing IFFA account credentials (override via env) */
export const EMAILJS_CONFIG = {
  serviceId:
    process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? "service_sx058wl",
  publicKey:
    process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? "YaVecTMmUJA_vz_f9",
  /** Admin notification — set To Email to {{to_email}} in EmailJS dashboard */
  adminTemplateId:
    process.env.NEXT_PUBLIC_EMAILJS_ADMIN_TEMPLATE_ID ?? "template_7wfy5ai",
  /** User confirmation — set To Email to {{to_email}} in EmailJS dashboard */
  userTemplateId:
    process.env.NEXT_PUBLIC_EMAILJS_USER_TEMPLATE_ID ?? "template_user_confirm",
} as const;

export const IFFA_NOTIFICATION_EMAIL =
  process.env.NEXT_PUBLIC_IFFA_NOTIFICATION_EMAIL ?? "info@iffaawards.com";

export const OMAN_ADMIN_RECIPIENTS = [
  process.env.NEXT_PUBLIC_OMAN_RECIPIENT_1 ?? "omanfilmsociety@gmail.com",
  process.env.NEXT_PUBLIC_OMAN_RECIPIENT_2 ?? "alajmifilm@gmail.com",
  process.env.NEXT_PUBLIC_OMAN_RECIPIENT_3 ?? "fahad.almaimani@gmail.com",
  IFFA_NOTIFICATION_EMAIL,
];

export const FORM_TYPE_LABELS: Record<string, string> = {
  "film-submission": "Film Submission",
  "film-enquiry": "Film Enquiry",
  contact: "Contact Form",
  partner: "Partnership Enquiry",
  "oman-filming-enquiry": "Oman Filming Enquiry",
};

/** True when all emails should go to IFFA only (dev / staging) */
export function isEmailDevRedirect(): boolean {
  return process.env.NEXT_PUBLIC_EMAIL_DEV_REDIRECT === "true";
}

export function getAdminRecipients(formType: FormType): string[] {
  if (isEmailDevRedirect()) {
    return [IFFA_NOTIFICATION_EMAIL];
  }

  if (formType === "oman-filming-enquiry") {
    return OMAN_ADMIN_RECIPIENTS;
  }

  return [IFFA_NOTIFICATION_EMAIL];
}

export function getUserRecipient(submitterEmail: string): string {
  if (isEmailDevRedirect()) {
    return IFFA_NOTIFICATION_EMAIL;
  }
  return submitterEmail;
}
