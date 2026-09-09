# Status

Updated: 2026-09-09

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
  anything else 404s. The page has its own palette and two of its own faces
  (Big Shoulders, Newsreader), loaded on the route rather than site-wide.

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

- **Screenings became sessions** (branch `page/festivals`, cms-hub
  `chore/festival`). A screening used to BE a film: one row carrying both the
  film's metadata and the time it played. A session that programmed more than
  one title had to be entered as N screenings sharing a time and a venue, with
  nothing tying them together and nowhere to put the block's own name.

  The hierarchy is now `Festival -> Screening (session) -> Film`. A screening
  has a title, a description, a **start and end date**, a time, a venue and a
  seat status; the films it programmes hang underneath and carry only what is
  true of the film itself. All of it is editable in cms-hub — the festival
  editor nests a films list inside each screening, with add/reorder/remove at
  both levels.

  Because a screening can now span days, the programme no longer groups by
  night. `groupScreeningsByDay` is gone; `orderScreenings` sorts sessions by
  opening date then time, and the programme renders one section per session.

  Routes: `/festivals/screening/<id>` is now the **session** page (billing on
  the dark ground, lineup on paper, reusing the programme's film card), and
  films moved to a new `/festivals/film/<id>`. Film URLs are flat rather than
  nested under a session, because a film can be programmed twice and a URL
  naming one session makes the other unreachable.

  **Deploy order is free.** `festival-api.ts` reads a pre-migration row (one
  with `date` and no `films`) as a session of one, so the public site renders
  correctly against an un-migrated database — verified against production,
  which is still serving the old shape. The migration is what makes the CMS
  editable again, not what keeps the site up. The CMS editor reads both shapes
  too, and writes the new one.

  **Before the backend deploys, run the screening migration** — see below.

- **Festival buttons** (branch `page/festivals`). Every CTA in the section
  carried its own copy of the same class string — six of them, already drifted
  on the focus ring. They now go through `ui/components/festival-button.tsx`:
  four variants, two sizes, an optional arrow, and a beam that crosses the face
  on hover and focus rather than a flat colour swap. Two of the variants
  (`ink`, `inkSolid`) are for the cream programme sections, which had no button
  style at all — amber on cream is the one pairing in this palette that fails
  contrast.

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

`cms-hub/backend/scripts/migrate-screenings-to-sessions.ts` converts embedded
screenings from the old "a screening is a film" shape to sessions holding
films:

```bash
cd ../cms-hub/backend
npx tsx scripts/migrate-screenings-to-sessions.ts            # dry run, writes nothing
npx tsx scripts/migrate-screenings-to-sessions.ts --confirm  # writes
```

Also writes to the production database. Each old row becomes a session of one
film carrying the same title; same-date rows are **not** merged, because they
had their own times and venues and merging them would lose both — combining
them is a programming call for staff, in the CMS, afterwards. Idempotent: a
screening that already has a `films` array is skipped, so a re-run after a
partial failure only touches what is left. `posterKey` is carried across
deliberately — it is what the cascade delete walks, and dropping it would
orphan every uploaded poster in S3 on the next save.

Until this runs, the public site is fine (the API layer reads the old shape)
but the CMS cannot save a festival without the editor rewriting its programme
into the new shape — which is what opening and saving one does.

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
- **S3 CORS — `POST` in `AllowedMethods`** (new, required by the 5MB upload
  limit). Submission image uploads moved from a presigned PUT to a presigned
  POST, because only POST can carry the `content-length-range` policy that
  makes the size cap enforceable server-side. The bucket CORS rule currently
  allows PUT; **until POST is added, every image upload on the public
  submission form fails at the browser preflight.** Deploy the backend and
  the site together — the new frontend cannot upload via an old backend
  (it needs the `fields` in the presign response), and vice versa.
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
