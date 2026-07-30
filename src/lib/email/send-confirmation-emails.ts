import emailjs from "@emailjs/browser";

import { buildAdminEmailContent, buildUserEmailContent } from "./build-email-content";
import {
  EMAILJS_CONFIG,
  getAdminRecipients,
  getUserRecipient,
  isEmailDevRedirect,
} from "./config";
import type { ConfirmationEmailPayload } from "./types";

type EmailParams = Record<string, string>;

async function sendViaEmailJS(
  templateId: string,
  params: EmailParams
): Promise<void> {
  await emailjs.send(
    EMAILJS_CONFIG.serviceId,
    templateId,
    params,
    EMAILJS_CONFIG.publicKey
  );
}

function withDevNote(body: string, note?: string): string {
  if (!note) return body;
  return `[DEV MODE — redirected to IFFA inbox]\n${note}\n${body}`;
}

/**
 * Sends admin notification + user confirmation via EmailJS.
 * Throws if the admin notification fails — for forms with no other backend,
 * that's the only record of the submission, so callers should treat it as a
 * failed submission. A failed user confirmation alone does not throw, since
 * the admin already has the enquiry either way.
 */
export async function sendConfirmationEmails(
  payload: ConfirmationEmailPayload
): Promise<{ adminSent: boolean; userSent: boolean }> {
  const adminContent = buildAdminEmailContent(payload);
  const userContent = buildUserEmailContent(payload);

  const adminRecipients = getAdminRecipients(payload.formType);
  const userRecipient = getUserRecipient(payload.submitterEmail);

  const devPrefix = isEmailDevRedirect() ? "[DEV] " : "";
  const intendedAdmin =
    isEmailDevRedirect() && payload.formType === "oman-filming-enquiry"
      ? `Originally intended for Oman contacts + IFFA`
      : undefined;
  const intendedUser =
    isEmailDevRedirect()
      ? `Originally intended for: ${payload.submitterEmail}`
      : undefined;

  const baseParams: EmailParams = {
    subject: `${devPrefix}${adminContent.subject}`,
    message: adminContent.message,
    form_type: payload.formType,
    submitter_name: payload.submitterName,
    submitter_email: payload.submitterEmail,
    reply_to: payload.submitterEmail,
    fullName: payload.submitterName,
    email: payload.submitterEmail,
    phoneNumber: payload.fields["Phone Number"] ?? payload.fields["Phone"] ?? "",
    address: payload.fields["Country"] ?? payload.fields["City/State"] ?? "",
  };

  let adminSent = false;
  let userSent = false;

  try {
    await Promise.all(
      adminRecipients.map((to) =>
        sendViaEmailJS(EMAILJS_CONFIG.adminTemplateId, {
          ...baseParams,
          to_email: to,
          message: withDevNote(adminContent.message, intendedAdmin),
        })
      )
    );
    adminSent = true;
  } catch (err) {
    console.error("[email] Admin notification failed:", err);
    throw new Error("Admin notification failed to send", { cause: err });
  }

  try {
    await sendViaEmailJS(EMAILJS_CONFIG.userTemplateId, {
      to_email: userRecipient,
      subject: `${devPrefix}${userContent.subject}`,
      message: withDevNote(userContent.message, intendedUser),
      submitter_name: payload.submitterName,
      form_type: payload.formType,
      fullName: payload.submitterName,
      email: payload.submitterEmail,
    });
    userSent = true;
  } catch (err) {
    console.error("[email] User confirmation failed:", err);
  }

  return { adminSent, userSent };
}
