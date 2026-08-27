<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# IFFA 2026 — public website

Marketing and festival site for the India Film Festival of Australia.
Next.js 16 App Router, React 19, Tailwind v4, pnpm.

**Read `docs/STATUS.md` before starting work** — it holds what's in flight,
what's blocked, and what's next. This file holds only things that rarely
change.

## The other half of the system

The backend and CMS live in a **sibling repo**: `../cms-hub`.

| | |
|---|---|
| `../cms-hub/backend` | Express + Mongoose API (App Runner) |
| `../cms-hub/client` | Next.js admin CMS (Amplify) |

This site is read-only against that API except for the submit-film form.
Anything about data shape, filtering, sort order, or uploads is decided
there, not here. Check `../cms-hub/AGENTS.md` before assuming a frontend fix.

## Layout

```
src/app/(root)/...        routes; (marketing)/page.tsx is the homepage
src/modules/<feature>/    ui/ + lib/ + data/ per feature
src/components/           shared components
src/lib/, src/utils/      helpers, form schemas
```

Features own their own `lib/`. `src/modules/events/submissions/lib/submissions.ts`
is the shared API layer for film data and is used well outside the submissions
page — the homepage carousel and nominations page import from it too.

## Environment

`.env` is git-ignored. The two that matter:

```
NEXT_PUBLIC_API_BASE_URL   = https://guh4nzpet5.ap-southeast-2.awsapprunner.com/api/v1
NEXT_PUBLIC_SUBMIT_FILM_URL = same host   # separate var, same value
NEXT_PUBLIC_CLOUDFRONT_URL  = https://dhbdzeb2cbayq.cloudfront.net
```

**`NEXT_PUBLIC_*` is inlined at build time.** Editing `.env` does nothing until
the dev server restarts. A "Failed to fetch" on every page usually means `.env`
points somewhere dead — check it before debugging code.

Don't repoint `.env` at `localhost:8000` unless you're actively changing backend
code, and put it back afterwards.

## Branches

```
feature/fix branch  →  dev  →  main  →  prod-aws
```

Feature branches **never** merge straight to main. `dev` is tested first.

`prod-aws` is the production deploy branch and is **pnpm-only**: it has no
`package-lock.json`, pins `packageManager: pnpm`, and its `amplify.yml` runs
`pnpm install --frozen-lockfile`. When merging main into it:

- keep `package-lock.json` deleted
- if `package.json` changed, run `pnpm install --lockfile-only` and commit
  `pnpm-lock.yaml`, or the build fails with `ERR_PNPM_OUTDATED_LOCKFILE`
- never `git add .` on that merge

## Data gotchas

These cost real time to rediscover.

**Use `crewDirectors`, not `directors`.** The API returns both. `directors` is
legacy and is empty for everything submitted through the current form; the real
names are on `crewDirectors`. `mapSubmissionFilmListItem` already prefers it.

**Use the shared mapper.** If a card shows "Genre TBA", "Duration TBA" or
"Synopsis coming soon", the API almost certainly returned that data and a local
mapper dropped it. `MoviesCard` renders genre, duration, cast, synopsis and
trailer — a mapper that only picks poster fields silently breaks all of them.

**The public API is approved-only**, filtered server-side. It returns the year's
full list newest-first; there is no `limit` param, so trim client-side.

**2022–2025 records were bulk-imported** outside Mongoose and have no
`createdAt`. Anything sorting by date needs `_id` as a tiebreaker.

**`isFeatured` is not year-scoped.** It's the CMS's hand-picked set of 5 for the
submissions hero. Don't use it for per-year rows — it returns nothing for any
year the admin hasn't curated.

## Verifying UI work

Playwright is available locally. Prefer driving the real page over asserting
that a change works — several bugs in this codebase rendered fine and were only
caught by reading the DOM.

Note the homepage carousel is `IntersectionObserver`-gated and GSAP-animated:
scroll to it, and click via `el.click()` in `page.evaluate` rather than
Playwright's click, which fails on a moving target.

Playwright is a local tool. It is *not* a build dependency — don't add browser
tests to the build.

## Known-broken, not your fault

- Homepage HLS videos fail CORS in production: the site's CloudFront distribution
  is missing `OPTIONS` in its allowed methods. Localhost CORS errors on
  `.m3u8`/`.ts` are expected and unrelated to your change.
- Enquiry form submits `interested_tier` as `"1"`/`"2"`/`"3"`, so emails read
  "Interested Tier: 2".
- `public/images/Partners/Logos/universal.png` is 3840×2160 / 1.2MB for a small
  logo tile.
