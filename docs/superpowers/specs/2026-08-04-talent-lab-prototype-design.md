# IFFA Talent Lab — Prototype Design Brief

**Purpose:** Design brief for generating a high-fidelity multipage prototype of the new **IFFA Talent Lab** section in Claude Design.
**Date:** 2026-08-04
**Prepared for:** Claude Design (prototype generation)
**Source of truth:** IFFA Talent Lab Program Plan (§14 Website Information Architecture, §16 Application System, §18 Accessibility, §21 Technical/URLs) + IFFA Talent Lab Network Contributor Proposal deck.

---

## 0. TL;DR for the designer

Design an **11-screen dark-themed prototype** that adds a **Talent Lab** section to the existing IFFA Awards website. It starts at the current IFFA homepage — where a new **"TALENT LAB" dropdown** is added to the header (between *Past Events* and *Latest News*) — and expands into a full multipage section: a flagship landing page plus Opportunities, Program detail, Mentors, Events, Alumni, Resources, Partners, and two application forms.

**The prototype must look like it belongs to the existing IFFA site**: pure-black background, white text, a single gold/amber accent, Raleway + Geist Mono type, uppercase wide-tracked nav labels, minimal sharp-edged chrome. It is a screen-industry **career-development pathway**, not a workshop flyer — imagery shows filmmakers/actors/crew collaborating and learning, never only red-carpet glamour.

---

## 1. Product context

**IFFA Talent Lab** is a year-round, primarily-online screen-industry development platform connecting emerging Australian screen talent (filmmakers, actors, writers, producers, crew) with established Australian and international mentors.

- **Tagline:** *Global Networks. Australian Screen Futures.*
- **Model:** Expression-of-Interest open year-round + **two formal 6-week cohorts per year**.
  - Cycle One — applications Jan–Feb, delivery Apr–Jun, showcase late Jun/Jul.
  - Cycle Two — applications Jul–Aug, delivery Oct–Nov, showcase Nov–Dec.
- **Cohort:** ~10–12 selected participants per cycle (deck: 12–15); ~20–30 emerging practitioners per year.
- **Positioning:** ongoing industry-access & career pathway — mentoring, masterclasses, workshops, project development, professional introductions, showcase.

**Important framing note for build (design as dynamic, not hard-coded):** the Program Plan repeatedly specifies "CMS-driven" content — Opportunities, Programs/Streams, Mentors, Alumni, Partners, Resources, Events, FAQs, Outcomes. The live IFFA codebase is a pure frontend with **no CMS**; it uses an external REST API plus **static typed data files**. So in the prototype these are presented as **dynamic, data-driven card/list collections populated with representative sample content** — designed to be edited/added without redesigning the page. Do not present them as fixed one-off hard-coded blocks.

---

## 2. Visual system (inherited from the live IFFA site — match exactly)

### 2.1 Color

| Token | Value | Use |
|---|---|---|
| Background (page) | `#000000` (pure black, `oklch(0 0 0)`) | All page backgrounds |
| Chrome / header / overlay | `#0E0C15` (near-black, faint indigo) | Fixed header (`/90` + backdrop-blur), mobile menu, dropdowns |
| Hairline border | `#252134` and `rgba(255,255,255,0.10)` | Header underline, card borders, dividers |
| Foreground | `#FFFFFF` | Primary text, headings |
| Muted foreground | `~#B3B3B3` (`oklch(0.708 0 0)`) | Secondary text, captions, meta |
| Accent — gold | `#E6BA35` (primary), `#C9943A` (deep) | CTAs, eyebrows, active nav, hover borders, stat numbers |
| Accent — highlight yellow | `yellow-500` (`#EAB308`) | Reserved like the site's "ENTRIES OPEN" tag |
| Card surface | `rgba(255,255,255,0.05)` on black | Cards, panels, form fields |

**Accent discipline:** the site is **monochrome-forward**. Gold is the *single* accent — use it sparingly on primary actions, eyebrow labels, active/hover states, and key numbers. Everything else is black/white/grey. Do not introduce additional hues except the functional status-pill colors (§5.2).

### 2.2 Typography

- **Primary typeface:** Raleway (headings + body).
- **Mono/label typeface:** Geist Mono — used for eyebrow labels, nav items, small meta, form labels, stat captions.
- **Nav & label style:** `UPPERCASE`, `letter-spacing: 0.2em`, small sizes (10–14px scaling).
- **Headings:** Raleway, tight leading; hero display large and confident. Body copy comfortable, generous line-height, muted where secondary.

### 2.3 Shape, spacing, motion

- **Radius:** base `10px` (`0.625rem`); larger surfaces use multiples (up to ~26px for feature panels). **Nav/dropdown items are sharp: `2px` radius** to match the existing Past Events dropdown.
- **Spacing:** generous vertical rhythm between sections (matches the homepage's large `pt-20 md:pt-24 lg:pt-32` gaps). Roomy, cinematic, uncluttered.
- **Cards:** `white/5` surface, `white/10` border; on hover, subtle lift + **gold border** + slight brightness.
- **Motion:** restrained, tasteful fades / slide-ins on scroll (the site uses GSAP). No autoplay audio. Respect reduced-motion.
- **Header behaviour:** fixed top bar; transparent over the homepage hero, `#0E0C15/90` + blur once scrolled or on other pages. Content sits below an ~88px header offset.

### 2.4 Accessibility (Program Plan §18 — WCAG 2.2 AA target)

- Visible keyboard focus rings on every interactive element.
- **Status is never communicated by color alone** — every status pill = icon + text label + color.
- Sufficient contrast for muted text on black.
- All images have descriptive alt text (note placeholders in the design).
- Form fields clearly labelled; accessible, explicit error/validation states.
- Fully keyboard-navigable header dropdown and mobile menu.
- Mobile-responsive at all breakpoints; layout survives text scaling.

---

## 3. Header modification (the prototype's entry point)

On the **existing IFFA homepage** (Screen 1), add one new item to the desktop right-hand nav.

**Current right nav (desktop, `lg+`):** `[ Past Events ▾ ]  [ Latest News ]`
**New right nav:** `[ Past Events ▾ ]  [ Talent Lab ▾ ]  [ Latest News ]`

- **"TALENT LAB" trigger:** ghost button, identical styling to the other nav buttons — `UPPERCASE`, `letter-spacing 0.2em`, white text, `hover:bg-white/10`, `2px` radius.
- **Dropdown panel:** background `black/90`, `border-white/20`, `2px` radius, subtle shadow — styled like the Past Events dropdown but **flat (single level, no nested submenus)** because each item is its own destination.
- **Dropdown items (in order):**
  1. Overview → `/talent-lab`
  2. Current Opportunities → `/talent-lab/opportunities`
  3. Programs & Streams → `/talent-lab/programs`
  4. Mentors → `/talent-lab/mentors`
  5. Events & Masterclasses → `/talent-lab/events`
  6. Alumni Stories → `/talent-lab/alumni`
  7. Resources → `/talent-lab/resources`
  8. Partners → `/talent-lab/partners`
  9. *(divider)*
  10. **Register Your Interest** → `/talent-lab/register` — visually distinguished with **gold** text/accent as the primary action.
- **Center link untouched:** the yellow "ENTRIES OPEN — IFFA 2026" link stays.
- **Mobile:** the same items appear stacked inside the existing full-screen `#0E0C15` overlay menu, under a "TALENT LAB" group heading.

Everything else on the homepage stays exactly as it is (no promo block added in this prototype).

---

## 4. Screen list & routes (11 screens)

| # | Screen | Route | Type |
|---|---|---|---|
| 1 | Homepage (modified header) | `/` | Existing + new nav dropdown |
| 2 | **Talent Lab Landing** | `/talent-lab` | Flagship marketing page |
| 3 | Opportunities listing | `/talent-lab/opportunities` | Filterable card collection |
| 4 | Program / Stream detail | `/talent-lab/programs/[slug]` | Detail template |
| 5 | Mentors directory | `/talent-lab/mentors` | Filterable grid + profile detail |
| 6 | Events & Masterclasses | `/talent-lab/events` (+ `/[slug]` detail) | Listing + detail |
| 7 | Alumni Stories | `/talent-lab/alumni` | Filterable profile grid |
| 8 | Resources library | `/talent-lab/resources` | Searchable/tagged list |
| 9 | Partners | `/talent-lab/partners` | Categorised logo wall |
| 10 | **Expression of Interest** form | `/talent-lab/register` | Short form (Plan Form One) |
| 11 | **Formal Application** form | `/talent-lab/apply` | Detailed form (Plan Form Two) |

URL structure follows Program Plan §21.

---

## 5. Reusable components (define once, reuse across screens)

### 5.1 Opportunity card
Fields: program title · short summary · location/online status · eligible career stage · relevant disciplines (tag chips) · application opening date · closing date · program dates · **status pill** · **Apply** button.
Layout: `white/5` card, `white/10` border, gold hover border. Status pill top-right. Disciplines as small mono chips.

### 5.2 Status pill (7 states — icon + text + color, never color-only)
| Status | Suggested treatment |
|---|---|
| Expressions of Interest Open | gold/amber, ● icon |
| Applications Opening Soon | neutral/grey, ◔ icon |
| Applications Open | green, ● icon |
| Closing Soon | orange, ◑ icon |
| Applications Closed | muted grey, ○ icon |
| In Progress | blue, ► icon |
| Completed | dim white, ✓ icon |

### 5.3 Other repeating components
- **Stream card** — icon/thumbnail, stream name, one-line description, "Learn more".
- **Mentor card** — photograph, name, professional role, organisation, country/region, tag (**Confirmed Mentor** vs **Past Guest** vs **Partner**), professional link icon. Opens profile detail (bio, relevant program, participation year).
- **Alumni card** — headshot/project image, name, role, Talent Lab cycle, short bio, outcome line, portfolio link; filterable by year & discipline.
- **Resource row/card** — type icon (guide/video/template/funding/directory), title, topic tags, career-stage tag, download/open action.
- **Partner tile** — logo, organisation name, category; grouped by category. (Prototype uses neutral placeholder logos — real prospective partners must NOT be shown as confirmed, per Plan §9/§10.)
- **Stat tile** — large gold number + Geist Mono caption.
- **Step block** — number, title, short line (for "How It Works").
- **FAQ accordion item** — question row expands to answer.
- **Form field set** — Geist Mono label, input on `white/5` with `white/15` border, gold focus ring, helper text, explicit error state; optional/private fields clearly marked.
- **Section header** — gold eyebrow (mono, uppercase) + Raleway heading + optional muted subtitle.

---

## 6. Screen specifications

### Screen 1 — Homepage (modified)
Reuse the existing homepage (trailer hero sections, featured movies, carousels, news). **Only change:** the header now includes the **Talent Lab** dropdown (§3). Show the dropdown in its open state in at least one frame so the new entry point is visible.

### Screen 2 — Talent Lab Landing (`/talent-lab`) — flagship
Full-bleed dark, generous section rhythm. Section order (Plan §14 §1–§15):

1. **Hero** — background image or short silent video (filmmakers/actors/crew in workshop/collaboration settings). Overlaid: gold mono eyebrow "IFFA TALENT LAB", H1 **"IFFA Talent Lab"**, tagline **"Global Networks. Australian Screen Futures."**, intro paragraph:
   > "IFFA Talent Lab connects emerging Australian screen talent with experienced practitioners, organisations and international networks through mentoring, masterclasses, workshops, project development and professional industry opportunities."
   Buttons: **View Current Opportunities** (primary, gold), **Register Your Interest** (primary outline); secondary text-link **Become a Mentor or Partner**.
2. **Program Snapshot** — 4 stat tiles: *Two Talent Lab cycles each year* · *10–12 participants per cycle* · *Australian & international mentors* · *Year-round Expressions of Interest*.
3. **Why the Talent Lab Exists** — short narrative on the access gap, IFFA's international reach, education-to-industry transition, inclusive pathways. Two-column text + supporting image.
4. **How It Works** — 4-step horizontal process: **Register your interest → Apply for an open program → Join workshops & mentoring → Present your work & build industry connections.**
5. **Current Opportunities** — 2–3 featured Opportunity cards (§5.1) with status pills + "View all opportunities →" (to Screen 3).
6. **Talent Lab Streams** — responsive grid of ~10 stream cards: Emerging Filmmakers Lab · Producers & Project Development Lab · Actors for Screen Lab · Screenwriters Lab · Documentary Lab · International Screen Exchange · Industry Masterclass Series · Regional & Online Talent Lab · Crew & Technical Pathways · Women in Screen Leadership.
7. **What Participants Receive** — 9-item benefits grid: Masterclasses · Mentoring · Project feedback · Career guidance · Industry introductions · Professional profiles · Showcase opportunities · Alumni network · Completion certificate. Footnote: *"Opportunities and introductions are subject to program availability and do not guarantee employment or representation."*
8. **Who Can Apply** — eligibility (emerging/early-career, Australia-based, 18+, disciplines, commitment) + inclusion statement, plus: *"Eligibility may vary between Talent Lab programs according to the objectives and requirements of individual program partners and funding bodies."*
9. **Mentors preview** — horizontal row of ~5 mentor cards → "Meet our mentors →" (Screen 5).
10. **Partners** — categorised placeholder logo strip (Government & screen agencies · Industry organisations · Education · International · Corporate) → Screen 9.
11. **Outcomes** — KPI stat band framed as pilot targets/results (e.g., 20 participants · 8–12 mentors · 4 masterclasses · 80% completion). Framed as "from the pilot" / representative.
12. **Alumni preview** — 2–3 alumni cards → Screen 7.
13. **Resources preview** — 3–4 resource rows → Screen 8.
14. **FAQ** — accordion with the Plan's 12 questions (Who can apply? Is it free? Can students apply? Regional? Online or in person? Employment? International applicants? Materials needed? Access adjustments? Selection? Become a mentor? Organisation partner?).
15. **Final CTA** — heading **"Take the Next Step in Your Screen Career"**, buttons: **Register Your Interest** · **View Open Programs** · **Partner with IFFA Talent Lab**.

### Screen 3 — Opportunities (`/talent-lab/opportunities`)
- Page header + intro.
- **Filter bar:** discipline, career stage, delivery mode (online/in-person), status, cycle/year. Optional search.
- **Grid of Opportunity cards** (§5.1) showing the full range of status pills across sample entries.
- Empty/soon states considered. Each card → Program detail (Screen 4). Prominent "Register Your Interest" affordance for the year-round EOI.

### Screen 4 — Programs index + Program / Stream detail (`/talent-lab/programs`, `/talent-lab/programs/[slug]`)
**Index (`/talent-lab/programs`)** — the "Programs & Streams" nav destination: reuses the Streams grid (same ~10 stream cards as landing §6), each card linking to its detail below. Short intro header on top.

**Detail (`/talent-lab/programs/[slug]`)** — template driven by the Plan's program fields (§15):
- **Hero:** program title, program type, status pill, short description, key dates (applications open/close, program start/end), delivery mode, location, **Apply** button.
- **Body:** full description · eligibility · available disciplines · number of places · cost · access information · 6-week curriculum outline (Week 1 Orientation → Week 6 Mentor Tables → Showcase) · what participants receive.
- **Associated mentors** row (mentor cards).
- **Related resources** + **partner organisations** for this program.
- **Terms & conditions / code of conduct** links.
- Sticky **Apply** CTA → Screen 11.

### Screen 5 — Mentors directory (`/talent-lab/mentors`)
- Page header + intro; clearly distinguishes **Confirmed Talent Lab mentors** vs **Past guest speakers** vs **Program partners / supporting organisations** (Plan §14 §9).
- **Filters:** discipline, country/region, program, type, participation year.
- **Grid of mentor cards** (§5.3). Selecting one opens a **profile detail** (photo, name, role, organisation, country, short bio, relevant program, participation year, professional link). Note: profiles only shown with consent/approval — represented in prototype with sample data.

### Screen 6 — Events & Masterclasses (`/talent-lab/events` + `/[slug]`)
- **Listing:** upcoming & past public masterclasses/sessions as event cards (title, date/time, format, speaker, online/venue, register/RSVP).
- **Event detail:** description, speaker(s), date/time with timezone, format, **Add to calendar** link, register button. (Public masterclasses support event structured data — Plan §21.)

### Screen 7 — Alumni Stories (`/talent-lab/alumni`)
- Page header + intro.
- **Filters:** year & discipline.
- **Grid of alumni cards** (§5.3) with outcome lines; optional detail view (bio, project/career objective, program experience, post-program outcome, portfolio link). Only consented/verified stories (sample data in prototype).

### Screen 8 — Resources library (`/talent-lab/resources`)
- **Search + tag filters** by topic and career stage.
- **List/grid of resource rows** (§5.3): screen-industry guides, career resources, recorded masterclasses, funding info, pitching templates, project-development templates, industry directories, accessibility resources, professional-conduct info. Type icons + tags.

### Screen 9 — Partners (`/talent-lab/partners`)
- **Logo wall grouped by category:** Government & screen agencies · Industry organisations · Education partners · International partners · Corporate supporters.
- Each tile: placeholder logo, organisation name, category, active status. **Only confirmed/approved partners shown — prototype uses neutral placeholders; no real prospective partner names/logos presented as confirmed** (Plan §9/§10).
- Include a "Partner with IFFA Talent Lab" CTA (→ enquiry / register).

### Screen 10 — Expression of Interest (`/talent-lab/register`) — Plan Form One
Short, single-column, friendly. Fields:
- Name · Email · State/Territory (select) · Primary screen discipline (select) · Career stage (select) · Link to portfolio/profile · Programs of interest (multi-select) · Mailing-list consent (checkbox) · Access requirements (optional textarea) · Privacy consent (checkbox).
- Submit → success confirmation state. Show labelled fields, focus + error states, spam-protection note.

### Screen 11 — Formal Application (`/talent-lab/apply`) — Plan Form Two
Longer, grouped into clear sections/steps:
1. **Contact:** full name · email · phone · suburb, state & postcode.
2. **Profile:** primary & secondary disciplines · career stage · short professional biography · career objective.
3. **Project & motivation:** project/portfolio description · why the program would benefit you · portfolio/showreel/project link · availability · previous professional-development programs.
4. **Optional & private (clearly marked):** access requirements · demographic questions — explicitly optional, stored securely, *never shown on public profiles*.
5. **Consents (separate checkboxes):** media consent (separate from application consent) · privacy declaration · code-of-conduct agreement.
- Progress indicator, per-section validation, accessible errors, review-before-submit, success state.

---

## 7. Cross-cutting content & copy notes

- **Voice:** professional, warm, opportunity-focused; grant/government-credible. Emphasise access, mentoring, pathways, inclusion, international networks.
- **Inclusion statement** appears on landing (§8) and forms: encourages under-represented practitioners; access adjustments available without disclosing medical details.
- **No over-promising:** always pair opportunity language with the "does not guarantee employment/representation" caveat.
- **Legal/consent footer links** (Plan §19): Privacy policy · Application terms · Code of conduct · Media consent · Complaints/feedback · Accessibility contact.
- **Placeholder data:** use realistic but clearly fictional sample mentors, alumni, opportunities, and neutral partner logos.

---

## 8. Responsive & states

- Design **desktop + mobile** for every screen; tablet inferred.
- Header dropdown collapses into the existing full-screen mobile overlay.
- Show meaningful **states**: opportunity statuses across the spectrum, form success + error, empty filters, mentor confirmed-vs-guest distinction.
- Maintain the ~88px fixed-header offset on all Talent Lab pages.

---

## 9. Deliverable checklist for the prototype

- [ ] Homepage with Talent Lab dropdown (shown open).
- [ ] Talent Lab landing page (all 15 sections).
- [ ] Opportunities listing with filters + all status pills.
- [ ] Program/Stream detail template.
- [ ] Mentors directory + profile detail.
- [ ] Events listing + event detail.
- [ ] Alumni stories with filters.
- [ ] Resources library with search/tags.
- [ ] Partners categorised wall.
- [ ] Expression of Interest form (+ success state).
- [ ] Formal Application form (grouped/stepped + success state).
- [ ] Consistent dark IFFA theme, gold accent, Raleway + Geist Mono, WCAG-AA affordances throughout.
