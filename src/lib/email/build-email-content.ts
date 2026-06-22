import { FORM_TYPE_LABELS } from "./config";
import type { ConfirmationEmailPayload } from "./types";

function formatFields(fields: Record<string, string>): string {
  return Object.entries(fields)
    .filter(([, v]) => v.trim().length > 0)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");
}

export function buildAdminEmailContent(payload: ConfirmationEmailPayload): {
  subject: string;
  message: string;
} {
  const label = FORM_TYPE_LABELS[payload.formType] ?? payload.formType;
  const fieldsText = formatFields(payload.fields);

  return {
    subject: `New ${label} — ${payload.submitterName}`,
    message: [
      `A new ${label} has been submitted on the IFFA website.`,
      "",
      `From: ${payload.submitterName}`,
      `Email: ${payload.submitterEmail}`,
      "",
      "— Submission Details —",
      fieldsText,
      "",
      `Submitted at: ${new Date().toLocaleString("en-AU", { timeZone: "Australia/Sydney" })}`,
    ].join("\n"),
  };
}

export function buildUserEmailContent(payload: ConfirmationEmailPayload): {
  subject: string;
  message: string;
} {
  const label = FORM_TYPE_LABELS[payload.formType] ?? payload.formType;

  switch (payload.formType) {
    case "film-submission": {
      const filmTitle = payload.fields["Film Title"] ?? "your film";
      return {
        subject: "IFFA — Film Submission Received",
        message: [
          `Dear ${payload.submitterName},`,
          "",
          `Thank you for submitting "${filmTitle}" to the IFFA Awards.`,
          "",
          "We have received your submission and our team will review it shortly. You will be contacted at this email address if we need any further information.",
          "",
          "Best regards,",
          "The IFFA Awards Team",
        ].join("\n"),
      };
    }

    case "film-enquiry": {
      const filmTitle = payload.fields["Film Title"] ?? "your project";
      return {
        subject: "IFFA — Film Enquiry Received",
        message: [
          `Dear ${payload.submitterName},`,
          "",
          `Thank you for your enquiry regarding "${filmTitle}".`,
          "",
          "We have received your message and a member of our team will be in touch with you shortly.",
          "",
          "Best regards,",
          "The IFFA Awards Team",
        ].join("\n"),
      };
    }

    case "oman-filming-enquiry": {
      const company = payload.fields["Company / Production House"] ?? "your production";
      return {
        subject: "Filming in Oman — Enquiry Received",
        message: [
          `Dear ${payload.submitterName},`,
          "",
          `Thank you for your filming enquiry from ${company}.`,
          "",
          "We have received your enquiry and the Oman Film Society team will review it and contact you regarding locations, permits, and next steps.",
          "",
          "Best regards,",
          "Oman Film Society",
          "In collaboration with IFFA",
        ].join("\n"),
      };
    }

    case "contact":
      return {
        subject: "IFFA — We Received Your Message",
        message: [
          `Dear ${payload.submitterName},`,
          "",
          "Thank you for contacting IFFA Awards. We have received your message and will respond as soon as possible.",
          "",
          "Best regards,",
          "The IFFA Awards Team",
        ].join("\n"),
      };

    case "partner":
      return {
        subject: "IFFA — Partnership Enquiry Received",
        message: [
          `Dear ${payload.submitterName},`,
          "",
          "Thank you for your interest in partnering with IFFA Awards. We have received your enquiry and our partnerships team will be in touch shortly.",
          "",
          "Best regards,",
          "The IFFA Awards Team",
        ].join("\n"),
      };

    default:
      return {
        subject: `IFFA — ${label} Received`,
        message: [
          `Dear ${payload.submitterName},`,
          "",
          `Thank you for your ${label.toLowerCase()}. We have received your submission and will be in touch shortly.`,
          "",
          "Best regards,",
          "The IFFA Awards Team",
        ].join("\n"),
      };
  }
}
