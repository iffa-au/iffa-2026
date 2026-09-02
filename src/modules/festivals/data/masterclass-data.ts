/**
 * Masterclass programme content.
 *
 * CONTENT EDITOR NOTES
 * --------------------
 * - Speaker photos are placeholders. `initials` renders on a gold gradient
 *   (the same pattern used on the AIFFA page) until real headshots exist. Add an
 *   `image` field here and to `speaker-card.tsx` when photos are supplied.
 * - Session dates sit inside the festival window (20-26 August 2026) so they
 *   stay consistent with the banner meta row.
 * - `REGISTER NOW` / `REGISTER SESSION` have no destination yet and are
 *   deliberately inert. See festival_progress.md.
 */

export type MasterclassSession = {
  id: string;
  title: string;
  description: string;
  speakers: string[];
  /** Display-ready date, e.g. "22 August 2026". */
  date: string;
  /** Display-ready time range, e.g. "10:00 - 11:00 AM". */
  time: string;
  format: string;
  tags: string[];
};

export type MasterclassSpeaker = {
  id: string;
  name: string;
  /** Placeholder avatar initials, used until real headshots exist. */
  initials: string;
  role: string;
  country: string;
  experience: string;
};

export type LearnTopic = {
  id: string;
  title: string;
  description: string;
  /** Key into the Hugeicons map in `ui/components/learn-topic-card.tsx`. */
  iconName: string;
};

export const masterclassIntro = {
  heading: "Masterclass",
  description:
    "Craft-focused sessions with directors, writers and producers working today — small rooms, specific problems, and time to ask the follow-up question.",
  dateRange: "20-26 AUG 2026",
  location: "MELBOURNE",
};

export const masterclassSessions: MasterclassSession[] = [
  {
    id: "directing-the-difficult-scene",
    title: "Directing the Difficult Scene",
    description:
      "Blocking, coverage and performance choices for scenes with no easy answer — walking through a single sequence from script page to locked cut.",
    speakers: ["Jane Smith", "Alice Steve"],
    date: "22 August 2026",
    time: "10:00 - 11:00 AM",
    format: "Online via Zoom",
    tags: ["Directing", "Performance", "Beginner friendly"],
  },
  {
    id: "the-second-draft",
    title: "The Second Draft",
    description:
      "What actually changes between a first and second draft, and how to tell structural problems apart from dialogue problems.",
    speakers: ["Marcus Reilly"],
    date: "23 August 2026",
    time: "2:00 - 3:30 PM",
    format: "In person - Federation Hall",
    tags: ["Screenwriting", "Structure"],
  },
  {
    id: "financing-a-first-feature",
    title: "Financing a First Feature",
    description:
      "Budgets, soft money, co-production treaties and the paperwork that decides whether a first feature gets made at all.",
    speakers: ["Priya Raman", "Daniel Okafor"],
    date: "24 August 2026",
    time: "11:00 AM - 1:00 PM",
    format: "In person - Main Theatre",
    tags: ["Producing", "Financing", "Advanced"],
  },
  {
    id: "cutting-for-rhythm",
    title: "Cutting for Rhythm",
    description:
      "An editor's session on pace, breath and the cuts an audience feels without noticing. Bring a scene that is not working.",
    speakers: ["Sofia Marchetti"],
    date: "25 August 2026",
    time: "4:00 - 5:30 PM",
    format: "Hybrid - Cinema Two and online",
    tags: ["Editing", "Post-production"],
  },
];

export const masterclassSpeakers: MasterclassSpeaker[] = [
  {
    id: "jane-smith",
    name: "Jane Smith",
    initials: "JS",
    role: "Director",
    country: "Australia",
    experience: "18 years directing feature drama and long-form television",
  },
  {
    id: "marcus-reilly",
    name: "Marcus Reilly",
    initials: "MR",
    role: "Screenwriter",
    country: "Ireland",
    experience: "Eleven produced features, script consultant since 2015",
  },
  {
    id: "priya-raman",
    name: "Priya Raman",
    initials: "PR",
    role: "Producer",
    country: "India",
    experience: "20 years in international co-production and festival financing",
  },
  {
    id: "sofia-marchetti",
    name: "Sofia Marchetti",
    initials: "SM",
    role: "Editor",
    country: "Spain",
    experience: "Editor on more than 30 features across documentary and fiction",
  },
];

export const learnTopics: LearnTopic[] = [
  {
    id: "directing",
    title: "Directing",
    description:
      "Working with actors, planning coverage, and holding a scene's intent together from the floor to the edit.",
    iconName: "Camera01Icon",
  },
  {
    id: "screenwriting",
    title: "Screenwriting",
    description:
      "Structure, revision and the discipline of cutting what you like in service of what the film needs.",
    iconName: "PencilEdit01Icon",
  },
  {
    id: "producing",
    title: "Producing",
    description:
      "Budgets, schedules, financing routes and the practical decisions that keep a production solvent.",
    iconName: "Briefcase01Icon",
  },
  {
    id: "industry-networking",
    title: "Industry Networking",
    description:
      "How festival meetings actually work, who to approach, and what to have ready before you do.",
    iconName: "UserGroupIcon",
  },
];
