# Status

Updated: 2026-09-04

Current state of work across `iffa-2026` and `../cms-hub`. Keep this short —
delete finished items rather than accumulating a changelog. Git already has
the history.

## In flight

- **One festival a year + Festival page redesign** (branch `page/festivals`).
  The Festivals section was built for two festivals a month; IFFA now runs one
  a year. Months are gone from the model, the API layer and the UI.

  Site: `/festivals` is now the festival — hero, statement, programme, award,
  venues, CTA, archive — and there is no separate festival detail page.
  `/festivals/<slug>` survives for links shared earlier: the current
  festival's slug 307s to `/festivals`, a past one renders an archive recap,
  anything else 404s. Each film has its own page at
  `/festivals/screening/<id>`, keyed on the title slug rather than a Mongo
  subdocument id, which is rewritten on every save. The page has its own
  palette and two of its own faces (Big Shoulders, Newsreader), loaded on the
  route rather than site-wide.

  The programme is one section per night, with the previous card layout. A
  horizontal poster reel above it was cut — it carried exactly the same films,
  so every visitor scrolled the schedule twice. When nothing is published the
  section becomes an animated title card instead of an empty panel.

  New CMS field: `about.imageUrl` / `about.imageKey`, a wide banner between the
  About text and the stats. `edition` is gone from the festival everywhere —
  one festival a year makes a position-within-the-year meaningless.

  cms-hub: `year` is stored on the festival, derived from `startDate` and
  carrying a **unique index** — one festival a year is enforced by the
  database, not by convention. Create and update both return a 409 naming the
  festival already holding that year. The CMS list is keyed by year and "New
  festival" opens on the next free one. The coming-soon months editor is gone;
  `comingSoonMonths` stays on the settings schema so no document needs
  migrating, and nothing reads it.

  **Before the backend deploys, run the backfill** — see the note below. It has
  not been run yet.

## Run before the next backend deploy

`cms-hub/backend/scripts/backfill-festival-year.ts` fills `year` on existing
festivals and builds the unique index:

```bash
cd ../cms-hub/backend
npx tsx scripts/backfill-festival-year.ts            # dry run, writes nothing
npx tsx scripts/backfill-festival-year.ts --confirm  # writes
```

This writes to the production database. `year` is unique and Mongo counts a
missing field as null, so two festivals without one collide: deploying the
model before the backfill fails the index build on boot and every write after
it errors. The dry run is safe and reports any year already holding two
festivals — it refuses to write in that case, because which one to move is an
editorial call.

- **prod-aws release** — main merged into `prod-aws`, `package-lock.json`
  removed, `pnpm-lock.yaml` synced. Verified `pnpm install --frozen-lockfile`
  resolves. Needs commit + push, then Amplify deploys.

## Blocked on AWS console (not code)

- **CloudFront `E20HYJ5WFWT8LJ`** → Behaviors → Default (*) → allowed methods
  must include `OPTIONS`, cache methods tick `OPTIONS`, origin request policy
  `CORS-S3Origin`. Then invalidate `/*`.
  Fixes homepage HLS videos, which currently fail preflight in production.
- **S3 CORS** — remove the trailing slash from the
  `https://main.dyxfgriwrgezw.amplifyapp.com/` origin entry. Partner logo
  uploads from the live CMS fail until this is done.
- **IAM `iffa-cms-hub-instance-role`** — needs `s3:PutObject` and
  `s3:DeleteObject` on `arn:aws:s3:::iffa-media-vault/*` for partner logo
  replacement and future image cleanup. Bucket versioning recommended.
  Festivals adds **`s3:ListBucket` on `arn:aws:s3:::iffa-media-vault`** (the
  bucket, not `/*`): deleting a festival lists its folder before removing it.
  Without it the record deletes and the artwork is silently orphaned.
- **App Runner** — confirm `CLOUDFRONT_URL` and `AWS_S3_BUCKET` are set.

## Waiting on backend deploy

Per-submission S3 upload folders are committed in `cms-hub` but **not
deployed**. The frontend already sends `submissionRef` / `group` / `name` on
every presign call; the live backend ignores them, so uploads still land in the
flat folder. No real upload has been run end-to-end through the new path yet —
do one test submission after deploying and check the bucket.

## Unmerged branches

| Branch | Holds |
|---|---|
| `page/talentlab-prod` | Talent Lab page + the festivals pages (supersedes `page/festivals` — merging it covers both) |
| `page/aboutus` | May, ~95 commits behind, one dead commit. Probably safe to delete |

## Never verified

The CMS Partners page, Carousel page, and Site Content nav dropdown have not
been visually checked — they need an authenticated CMS session.

## Local development

The backend's `.env` has no `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY`, so
every S3 call fails locally with `CredentialsProviderError`. Everything except
image upload works without them — a CMS save that attaches no image succeeds.
The presign endpoints now say this in their error response rather than
returning a bare "Internal server error".

Point the public site at the local backend with `.env.local`
(`NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1`); its committed `.env`
targets deployed App Runner, which has no festivals routes until it is
redeployed. Note `revalidate: 300` caches fetches in dev too — clear
`.next/cache/fetch-cache` to see a CMS edit immediately.

## Small known issues

- Enquiry form sends `interested_tier` as `"1"`/`"2"`/`"3"`, so emails read
  "Interested Tier: 2".
- `playwright` sits in `package.json` devDependencies but nothing imports it;
  it's a local verification tool. Removing it from `main` would stop every
  `prod-aws` merge needing a lockfile resync.
- Submissions page heading is now static `New Submissions`, so the 2022–2025
  archive pages no longer show their year.
