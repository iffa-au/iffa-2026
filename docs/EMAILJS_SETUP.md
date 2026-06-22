# EmailJS setup for IFFA forms

## Overview

All forms send **two emails** via EmailJS:

1. **Admin notification** — to IFFA (and Oman contacts for `/oman/enquiry` in prod)
2. **User confirmation** — to the person who submitted the form

In **dev** (`NEXT_PUBLIC_EMAIL_DEV_REDIRECT=true`), both go to `NEXT_PUBLIC_IFFA_NOTIFICATION_EMAIL`.

When dev mode is on, a yellow banner appears at the bottom of the site.

---

## Step 1 — Use existing EmailJS account

Log in at [emailjs.com](https://www.emailjs.com) with the IFFA account that already has:

- Service: `service_sx058wl`
- Public key: `YaVecTMmUJA_vz_f9`

---

## Step 2 — Admin template

You can **reuse** `template_7wfy5ai` (contact form) or create a new template.

### Template settings (EmailJS dashboard)

| Field | Value |
|-------|--------|
| **To Email** | `{{to_email}}` |
| **From Name** | IFFA Awards |
| **Reply To** | `{{reply_to}}` |
| **Subject** | `{{subject}}` |

### Email body

```
New form submission — {{form_type}}

{{message}}
```

### Variables used

- `{{to_email}}` — recipient (dynamic)
- `{{subject}}` — email subject
- `{{message}}` — full submission text
- `{{reply_to}}` — submitter email
- `{{submitter_name}}`, `{{submitter_email}}`, `{{form_type}}`
- Legacy contact fields: `{{fullName}}`, `{{email}}`, `{{phoneNumber}}`, `{{address}}`

Copy the template ID into `NEXT_PUBLIC_EMAILJS_ADMIN_TEMPLATE_ID`.

---

## Step 3 — User confirmation template (create new)

Create a template named e.g. **IFFA User Confirmation**.

| Field | Value |
|-------|--------|
| **To Email** | `{{to_email}}` |
| **Subject** | `{{subject}}` |

### Email body

```
{{message}}
```

Copy the template ID into `NEXT_PUBLIC_EMAILJS_USER_TEMPLATE_ID` (e.g. `template_user_confirm`).

---

## Step 4 — Environment files

Next.js loads env files automatically:

| File | When used |
|------|-----------|
| `.env.development` | `npm run dev` |
| `.env.production` | `npm run build` / `npm start` |
| `.env.local` | Overrides both (gitignored) |

Copy the examples:

```bash
cp .env.development.example .env.development
cp .env.production.example .env.production
```

Set your test email in `.env.development`:

```bash
NEXT_PUBLIC_IFFA_NOTIFICATION_EMAIL=your@gmail.com
NEXT_PUBLIC_EMAIL_DEV_REDIRECT=true
```

For production deploy, set the same vars in AWS/hosting with `NEXT_PUBLIC_EMAIL_DEV_REDIRECT=false`.

---

## Email routing

| Form | Prod admin recipients | Prod user recipient |
|------|----------------------|---------------------|
| Submit Film | IFFA | Submitter |
| Film Enquiry | IFFA | Submitter |
| Contact | IFFA | Submitter |
| Partner | IFFA | Submitter |
| Oman Enquiry | 3 Oman emails + IFFA | Submitter |

**Dev:** all → `NEXT_PUBLIC_IFFA_NOTIFICATION_EMAIL`

---

## Testing

1. Set `.env.development` with your Gmail + `EMAIL_DEV_REDIRECT=true`
2. Restart `npm run dev`
3. Confirm yellow **Email dev mode** banner at bottom
4. Submit contact form or `/oman/enquiry`
5. Check your inbox for admin + user emails (both arrive in dev)

---

## Forms covered

- `/submit-film` — saves to API, then emails
- `/submit-film-enquiry` — saves to API, then emails
- `/contact` — emails only
- `/partnerwithus` — emails only
- `/oman/enquiry` — emails only
