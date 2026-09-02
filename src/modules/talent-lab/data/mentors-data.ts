import type { Mentor } from "../lib/types";

/**
 * PLACEHOLDER CONTENT — pending real data.
 *
 * The ten mentors from the approved design, verbatim. No mentor beyond this
 * list has been invented: naming a person as a Talent Lab mentor is a claim
 * about a real agreement, so this array must only ever grow from confirmed
 * information.
 *
 * `slug` is the reference key — `Stream.mentorSlugs` points here rather than
 * copying mentor objects, so a corrected bio is corrected everywhere.
 */

export const mentors: Mentor[] = [
  {
    slug: "danielle-okafor",
    name: "Danielle Okafor",
    role: "Director",
    organisation: "Sable Lane Pictures",
    country: "Australia",
    type: "Confirmed Mentor",
    discipline: "Directing",
    year: "2026",
    bio: "Director of two features and a returning drama series. Works with participants on visual storytelling, tone and the transition from short form to first feature.",
  },
  {
    slug: "marcus-whitely",
    name: "Marcus Whitely",
    role: "Producer",
    organisation: "Bright Meridian Films",
    country: "Australia",
    type: "Confirmed Mentor",
    discipline: "Producing",
    year: "2026",
    bio: "Producer with credits across independent features and international co-productions. Mentors on financing, packaging and market strategy.",
  },
  {
    slug: "priya-raghunathan",
    name: "Priya Raghunathan",
    role: "Screenwriter",
    organisation: "Freelance",
    country: "Australia",
    type: "Confirmed Mentor",
    discipline: "Writing",
    year: "2026",
    bio: "Screenwriter and script editor working across series and feature drama. Leads table reads and structural development sessions.",
  },
  {
    slug: "elena-vasquez",
    name: "Elena Vasquez",
    role: "Casting Director",
    organisation: "Northlight Casting",
    country: "Australia",
    type: "Confirmed Mentor",
    discipline: "Acting",
    year: "2026",
    bio: "Casting director for features and streaming series. Runs self-tape and casting-room practice for the Actors for Screen Lab.",
  },
  {
    slug: "tomas-lindqvist",
    name: "Tomas Lindqvist",
    role: "Festival Programmer",
    organisation: "Nordic Screen Forum",
    country: "Sweden",
    type: "Confirmed Mentor",
    discipline: "Producing",
    year: "2026",
    bio: "Programmer and market advisor. Speaks to festival strategy, international sales and how selection decisions are actually made.",
  },
  {
    slug: "aisha-rahman",
    name: "Aisha Rahman",
    role: "Documentary Director",
    organisation: "Open Field Docs",
    country: "Australia",
    type: "Confirmed Mentor",
    discipline: "Documentary",
    year: "2026",
    bio: "Documentary director focused on ethics, access and long-form observational work.",
  },
  {
    slug: "jun-ho-park",
    name: "Jun-Ho Park",
    role: "Cinematographer",
    organisation: "Freelance",
    country: "South Korea",
    type: "Past Guest",
    discipline: "Crew",
    year: "2025",
    bio: "Cinematographer across feature and commercial work. Delivered a masterclass on low-budget lighting design.",
  },
  {
    slug: "sofia-almeida",
    name: "Sofia Almeida",
    role: "Editor",
    organisation: "Cut Room Collective",
    country: "Portugal",
    type: "Past Guest",
    discipline: "Crew",
    year: "2025",
    bio: "Editor and post supervisor. Guest session on assembly, structure and working with a director in the edit.",
  },
  {
    slug: "nadia-farouk",
    name: "Nadia Farouk",
    role: "Head of Development",
    organisation: "Gulf Screen Institute",
    country: "Oman",
    type: "Partner",
    discipline: "Producing",
    year: "2026",
    bio: "Represents a partner organisation supporting international exchange places within the Talent Lab.",
  },
  {
    slug: "robert-mahoney",
    name: "Robert Mahoney",
    role: "Sound Designer",
    organisation: "Tidewell Post",
    country: "Australia",
    type: "Confirmed Mentor",
    discipline: "Crew",
    year: "2026",
    bio: "Sound designer and re-recording mixer. Mentors crew-stream participants on post workflow and on-set sound.",
  },
];
