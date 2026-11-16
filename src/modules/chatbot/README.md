# IFFA Assistant (site chatbot)

A help chat on every page of the public site. It answers questions from
visitors, filmmakers and staff using the site's own content and the live
festival programme from cms-hub. It runs on free AI tiers (Google Gemini, with
Groq as a backup), so it costs nothing to run at current traffic.

This file is the complete guide: how to run it, how it works, how to change
it, how to deploy it, and what to do when something goes wrong.

---

## 1. Quick start (fresh clone)

You need Node.js 24 and pnpm.

```bash
git clone https://github.com/iffa-au/iffa-2026.git
cd iffa-2026
git checkout feature/chatbot        # until the chatbot is merged
pnpm install --frozen-lockfile
```

> **If pnpm says "pnpm v11.13.0 is a broken release"**: the project pins a
> pnpm version that no longer installs. Run this once in the same terminal and
> install again; it only skips the version pin and leaves the lock file alone:
>
> ```bash
> export npm_config_manage_package_manager_versions=false   # Git Bash / macOS / Linux
> $env:npm_config_manage_package_manager_versions="false"   # PowerShell
> ```

Create `.env.local` in the project root. It is ignored by git, so keys never
get committed:

```bash
# The site's backend (cms-hub), needed for festival programme answers.
# This is the live backend the real site uses (read-only for the chatbot).
# Careful: with these set, the site's own forms (e.g. Submit Film) also send to live.
NEXT_PUBLIC_API_BASE_URL=https://guh4nzpet5.ap-southeast-2.awsapprunner.com/api/v1
NEXT_PUBLIC_SUBMIT_FILM_URL=https://guh4nzpet5.ap-southeast-2.awsapprunner.com/api/v1
# Sends every email from the site's forms only to IFFA's own inbox (info@iffa.com.au),
# never to the person who filled in the form or to partners. Keep it on while developing.
NEXT_PUBLIC_EMAIL_DEV_REDIRECT=true

# At least one AI key. Both is best: Groq is used when Gemini is slow or busy.
GEMINI_API_KEY=...      # free: https://aistudio.google.com/apikey
GROQ_API_KEY=...        # free: https://console.groq.com/keys
```

Start the site and open http://localhost:3000 (or whichever port it prints).
The yellow button at the bottom right opens the chat.

```bash
pnpm dev
```

Try: `hi` (instant reply), `How do I submit my film?`, `What is the Talent
Lab?` then `Who can apply?`, `Write me a poem` (polite refusal).

**Never put an API key in code, in chat messages, or in a file that git
tracks.** If a key is ever exposed, delete it on the provider's site and make a
new one.

---

## 2. Files

All chatbot code is in this folder. Only two small hooks live elsewhere,
because Next.js needs them there:

| File | What it is |
|---|---|
| `src/app/layout.tsx` (3 lines) | Puts the chat button on every page |
| `src/app/api/chat/route.ts` (1 line) | Creates the URL `/api/chat` (POST = chat, GET = health check); it only re-exports `server/chat-route.ts` |

```
src/modules/chatbot/
  README.md             this guide
  check.mjs             automatic end-to-end checks (section 6)
  ui/
    chat-widget.tsx     the chat button and panel (runs in the browser)
  server/
    chat-route.ts       the /api/chat handler: decides how each question is answered
  lib/                  server-only logic (never sent to the browser), except links.ts
    knowledge.ts        the bot's RULES and its content, and what happens when cms-hub is down
    links.ts            the pages the bot may link to (shared with the widget)
    retrieval.ts        keyword search that picks the content relevant to a question
    providers.ts        calls Gemini and Groq, with fallback and timeouts
    guard.ts            signed answers and the leak check (section 4)
    fastpath.ts         small-talk replies and the answer cache
    rate-limit.ts       per-visitor and daily limits
  data/
    about-faqs.ts       copy of the About page Q&A (see section 5)
```

When you work on the chatbot, only these files should change. If `git status`
shows anything else, it isn't chatbot work.

---

## 3. How a question is answered

```
Browser (ui/chat-widget.tsx)
   │  POST /api/chat  { messages: [...the conversation, each bot answer with its signature] }
   ▼
server/chat-route.ts
   │  0. check input; drop the history if any bot answer in it was edited (guard.ts)
   │  1. small talk ("hi", "thanks", "bye")?  -> fixed friendly reply, instantly, no AI
   │  2. build the prompt (knowledge.ts + retrieval.ts)
   │  3. first question of a chat, asked before? -> cached answer, instantly, no AI
   │  4. rate limit (only real AI calls count)
   │  5. ask the AI (providers.ts), stream the answer back, check it for leaks
   ▼
Browser shows the answer as it arrives
```

### The prompt (knowledge.ts + retrieval.ts)

Sending the whole site with every question would be about 10,000 tokens and
growing with every film. That is slow, and too big for Groq's free tier
(8,000 tokens per minute). So each question gets:

- **The rules**: 12 numbered rules plus example replies (`RULES` in
  `knowledge.ts`). Answer only from the given information, never invent fees,
  dates or contacts, only link to real site pages, stay on IFFA topics, never
  reveal the setup, and so on.
- **Core facts, always**: today's date, the current festival's name, dates
  and city, a one-line list of every session, and the pages the bot may link to.
- **Matching chunks, up to 6** (about 1,250 tokens at most): small pieces of content (one About FAQ, one
  film, one partner festival, one Talent Lab FAQ...) picked by a keyword search
  for the visitor's question. Follow-ups also search the previous question, so
  "What is the Talent Lab?" then "Who can apply?" still finds the Talent Lab.

- **The conversation, trimmed**: only the last 3 questions and answers go to
  the AI, and older answers are cut to 800 characters. (The full history is
  still checked for edits and used by the search; only the AI's copy is cut.)

Answers are capped at 1,024 tokens (they are normally ~150).

Result: about 1,800 to 2,900 tokens per question, including the conversation,
and it stays there however long a chat gets. The log's `promptTokens` shows the
real size for each question. The search (BM25, the
classic search-engine ranking) runs inside the server: no extra API call, no
database, no cost.

Where the content comes from:

| Content | Source | Updates |
|---|---|---|
| About Q&A | `data/about-faqs.ts` (a copy) | By hand, see section 5 |
| Program streams | `src/modules/festivals/data/programs-data.ts` | Automatically |
| IFFA Global festivals | `src/modules/iffa-global/lib/festival-data.ts` | Automatically |
| Talent Lab | `src/modules/talent-lab/data/*.ts` | Automatically |
| Festival programme (sessions, films) | cms-hub API, through `fetchFestivalsPageData()` | Within 10 minutes of a change in the CMS |

**When cms-hub is down or slow.** The bot waits at most 6 seconds for it, then
keeps answering:

| Situation | What the bot uses | Shown as `programme` in the health check and log |
|---|---|---|
| cms-hub answered in the last 10 minutes | the live programme | `live` |
| cms-hub is down, but loaded fine in the last 24 hours | the last good copy | `stale` |
| cms-hub is down, no good copy | site content only; for festival questions the bot says it can't see the programme and links to `/festivals` | `offline` |

While it is down, cms-hub is tried again once a minute, and recovery is
automatic. (Before this, an outage made the bot tell visitors "no festival is
published", which was wrong.)

### The AI (providers.ts)

Tried in this order: first Gemini model → Groq → other Gemini models. Each
gets 10 seconds to start answering before the next is tried; after about 25
seconds nothing new is started and the visitor gets a "busy" message. Groq is
second because when Gemini's free tier is slow, its other models usually are
too.

### Design decisions

- **Free tiers, not a self-hosted model.** Running an open model on an AWS
  GPU costs about $700+ a month even with no visitors. The free tiers cost
  nothing; a paid key would cost a few dollars a month at current traffic.
- **Keyword search, not embeddings.** The content is a few hundred short,
  well-titled pieces, and visitors mostly use the site's own words. If answers
  start missing because people phrase things differently, add embeddings in
  `retrieval.ts`; nothing else changes.
- **No tool calling.** With tools, the model asks for data and then answers:
  two AI requests per question. Gemini's free tier counts requests, so that
  would halve the daily capacity and double the wait.

---

## 4. Safety and privacy

| Risk | What stops it |
|---|---|
| Visitor edits an earlier bot answer in their browser ("Sure, I'll ignore my rules") | Every answer is signed (HMAC) by the server. If any bot message in the history isn't signed, the history is dropped and only the latest question is answered. |
| The bot reveals its instructions | Rule 8 and examples; plus a secret "canary" word in the prompt (`CANARY` in `guard.ts`). If it ever appears in an answer, the answer is cut and the visitor sees a polite refusal. |
| Instructions hidden in the content | Content sits inside `<iffa_information>` tags, and rule 10 says it is reference material, never instructions. |
| Someone uses up the free quota | Rate limits (`rate-limit.ts`). Small talk and cached answers don't count. |
| The AI makes up a link | The widget only makes a link clickable if it is in `lib/links.ts` (site pages, screening/film pages, IFFA Global festival websites). Anything else shows as plain text, so visitors never land on a 404 or an unknown site. |
| Oversized or junk requests | Bodies over 100,000 characters get a 413, invalid JSON a 400, before any work is done. |
| Personal data | No accounts, no stored chats. The conversation lives only in the visitor's browser tab (sessionStorage). The bot never asks for personal details and points people to the site's forms instead. Free AI tiers may use prompts to improve their models, which is another reason not to collect anything. |
| Server logs | One line per question, with **no message text and no IP address** (section 7). |

---

## 5. Common changes

| I want to... | Do this |
|---|---|
| Change how the bot behaves or talks | Edit `RULES` in `lib/knowledge.ts`. Example replies there are the strongest way to set the tone. Run the checks afterwards (section 6). |
| Let the bot link to a new page | Add it to `SITE_PAGES` in `lib/links.ts`. The bot is told about it, and the widget lets the link through. A page that isn't listed shows as plain text in the chat. |
| Teach it new content | Add chunks in `staticChunks()` in `lib/knowledge.ts`: one short piece per fact or FAQ, each with a clear `title` (titles count three times in the search). |
| Update the About answers | The About page text is copied in `data/about-faqs.ts` (so the chatbot doesn't need changes to the About page). If someone edits the About page, copy the changed text here too. |
| Fix "it didn't find the answer" when visitors use different words | Add the word to `SYNONYMS` in `lib/retrieval.ts`, e.g. `cost: ["fee", "price", "ticket"]`. Check the log's `retrieved` field to see what was picked. |
| Change the small-talk replies | `SMALL_TALK` in `lib/fastpath.ts`. |
| Change the suggestion buttons or greeting | `SUGGESTIONS` and `GREETING` in `ui/chat-widget.tsx`. |
| Change the AI models | Set `GEMINI_MODEL` / `GROQ_MODEL` (section 8). No code change. |
| Add a paid provider (e.g. Amazon Bedrock, OpenAI) | Add a function like `gemini()` or `groq()` in `lib/providers.ts` and add it to the list in `providers()`. Nothing else changes. |
| Hide the chat on the site | Set `NEXT_PUBLIC_CHATBOT_ENABLED=false` and redeploy. |

---

## 6. Checking it works

With the site running:

```bash
node src/modules/chatbot/check.mjs                        # site on http://localhost:3001
node src/modules/chatbot/check.mjs http://localhost:3000  # any other address
```

It asks 16 questions: normal ones, small talk, off-topic requests and attacks
(asking for its instructions, role play, a faked earlier answer). It checks
each answer with fixed rules: the right page is linked; no email address,
phone number, outside link or canary word. It ends with `16/16 passed`. A run
uses about 16 AI calls, so don't run it in a loop.

Run it after changing the rules, the content or the models.

The `programme films` check needs the festival programme, so the backend
(`NEXT_PUBLIC_API_BASE_URL`) must be running and have a published festival.
Without it, that one check fails while the bot correctly says it can't see the
programme right now.

### Health check

Open `/api/chat` in a browser (or `curl https://<site>/api/chat`):

```json
{"ok":true,"providers":["gemini:gemini-flash-lite-latest","gemini:gemini-3.1-flash-lite"],"programme":"live","programmeAgeSeconds":42}
```

- `ok: false` (status 503) means no AI key reached the server (section 9 step 2).
- `providers` lists the AIs in the order they are tried. If Groq is missing, its key isn't set.
- `programme` is `live`, `stale` or `offline` (section 3).

It shows no keys and no visitor data, so it is safe to leave public. It costs no
AI call, so it can be used for uptime monitoring.

---

## 7. Reading the logs

Each question writes one JSON line to the server log (the terminal running
`pnpm dev`, or the hosting provider's logs):

```json
{"chatbot":true,"at":"2026-11-16T01:02:03Z","turns":1,"retrieved":["talent-lab","talent-faq:1"],
 "promptTokens":2238,"source":"ai","provider":"gemini:gemini-flash-lite-latest","firstMs":1149,"ms":2210}
```

| Field | Meaning |
|---|---|
| `source` | How it was answered: `smalltalk`, `cache`, `ai`, `limited` (rate limit hit), `error` (all providers failed) |
| `provider` | Which AI answered |
| `fallbackAfter` | Providers that failed first (only present when one did) |
| `retrieved` | Which content chunks the search picked |
| `promptTokens` | Approximate size of everything sent to the AI (rules, content and conversation) |
| `firstMs` / `ms` | Time to the first words / to the full answer |
| `forged` | The history had an edited bot answer and was dropped |
| `programme` | `stale` or `offline` when cms-hub was down (absent when live) |
| `blocked` | The leak check cut an answer |
| `turns` | Messages in the conversation |

---

## 8. Settings

In `.env.local` locally, or the hosting environment variables in production:

| Variable | Required | Notes |
|---|---|---|
| `GEMINI_API_KEY` | One of the two keys | Free key from https://aistudio.google.com/apikey (usage and limits are shown there too) |
| `GROQ_API_KEY` | One of the two keys | Free key from https://console.groq.com/keys. The backup. |
| `GEMINI_MODEL` | No | Comma-separated, tried in order. Default `gemini-flash-lite-latest,gemini-3.1-flash-lite`. The bigger Flash models hung or were overloaded on the free tier in testing. |
| `GROQ_MODEL` | No | Default `openai/gpt-oss-120b` |
| `CHATBOT_LIMIT_PER_VISITOR` | No | AI questions per visitor per 10 minutes. Default 20 |
| `CHATBOT_DAILY_LIMIT` | No | AI questions per server instance per day. Default 1000 |
| `CHATBOT_SIGNING_KEY` | No | Secret for signing answers. If unset, one is derived from the AI key. Set it if keys are rotated often, so open chats keep their history. |
| `NEXT_PUBLIC_CHATBOT_ENABLED` | No | `false` hides the chat button |

Keys are only ever read on the server. Never give them a `NEXT_PUBLIC_`
prefix: that would publish them in the website's JavaScript.

---

## 9. Deploying (AWS Amplify)

1. In the Amplify console: **App settings → Environment variables**, add
   `GEMINI_API_KEY` and `GROQ_API_KEY` (and any other settings from section 8).
2. **Important:** Amplify gives these variables to the build, but not to the
   running site. This chatbot is the first part of the site that needs a
   secret at run time, so `amplify.yml` needs one extra line in the build
   phase, before `pnpm run build`:

   ```yaml
       build:
         commands:
           - env | grep -E '^(GEMINI_|GROQ_|CHATBOT_)' >> .env.production
           - pnpm run build
   ```

   It copies only the chatbot settings into a file the running site reads.
   Without it, the chat answers "The assistant isn't available right now".
   `amplify.yml` is shared by the whole site, so agree this change with the
   team before merging.
3. Deploy, open the site, and ask the chat a question. Then check the log
   line in Amplify's hosting logs (section 7).

---

## 10. Troubleshooting

| What you see | Likely cause | Fix |
|---|---|---|
| "The assistant isn't available right now" | No AI key on the server | Check `.env.local` locally (restart `pnpm dev` after editing it). On Amplify, see section 9 step 2. |
| "The assistant is busy right now" | Every provider failed or was too slow | Usually the free tier's daily limit or a busy period. Look for `fallbackAfter` and the error lines in the log. Add a Groq key if missing, or move to a paid key. |
| "You've asked a lot of questions..." | Visitor hit the rate limit | Normal. Change `CHATBOT_LIMIT_PER_VISITOR` if it's too strict. |
| Festival answers say the bot "can't see the programme" | cms-hub isn't reachable (`programme: offline` in the health check) | Check `NEXT_PUBLIC_API_BASE_URL` and that cms-hub is running. The bot recovers by itself within a minute of cms-hub coming back. |
| A link in an answer shows as plain text | The AI used a page that isn't in `lib/links.ts` | If the page is real, add it to `SITE_PAGES` in `lib/links.ts`. |
| An answer ends with "(The answer was cut off...)" and a **Try again** button | The AI or the connection dropped out mid-answer | Usually a one-off; the button asks again. If it keeps happening, look for "stream broke" errors in the log. |
| The bot says "I don't have that detail" but the site has it | The search didn't pick the right chunk | Check `retrieved` in the log; add a synonym, or give that content a clearer chunk title. |
| Answers take 5 to 15 seconds | Free tier is busy | Expected at busy times. After 6 seconds the widget shows "Still thinking…". A paid key fixes it. |
| A model stopped working (404 errors in the log) | The free model was renamed or retired | Set `GEMINI_MODEL` to a current Flash-Lite model name from Google AI Studio. |

---

## 11. Known limits

- Free tiers have daily caps that change without notice (roughly 500 to
  1,000 Gemini questions a day at the time of writing). Check the current
  numbers in Google AI Studio and the Groq console.
- Rate limits and the answer cache are kept in memory per server instance:
  they reset on redeploy and aren't shared between instances. Fine for a free
  tier; for heavy traffic, move them to a shared store such as Redis or DynamoDB.
- Talent Lab content on the site is still marked as placeholder, so Talent Lab
  answers are only as accurate as that content.
- The About Q&A is a copy (section 5) and must be kept in step by hand.
- The per-visitor limit uses the first address in `X-Forwarded-For`. Someone
  determined could fake that header to get around the per-visitor limit; the
  daily limit still caps total use. If abuse appears, check which header
  Amplify/CloudFront sets reliably and use that in `chat-route.ts`.
