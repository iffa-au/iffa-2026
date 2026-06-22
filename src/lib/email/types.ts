export type FormType =
  | "film-submission"
  | "film-enquiry"
  | "contact"
  | "partner"
  | "oman-filming-enquiry";

export type ConfirmationEmailPayload = {
  formType: FormType;
  submitterEmail: string;
  submitterName: string;
  fields: Record<string, string>;
};
