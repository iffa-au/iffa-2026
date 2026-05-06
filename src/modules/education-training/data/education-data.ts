import { Lightbulb, Clapperboard, Handshake, type LucideIcon } from "lucide-react";

export interface Section {
  title: string;
  intro: string;
  paragraphs: string[];
  points: string[];
}

export const sections: Section[] = [
  {
    title: "Learn & Develop",
    intro: "Building Stories Through Screen Practice",
    paragraphs: [
      "The IFFA Education & Training Programme is a structured learning initiative designed to support emerging filmmakers in developing creative, technical, and professional skills through the process of storytelling.",
      "The programme focuses on \"learning through story\" — guiding participants from initial idea generation through to structured narrative development and production planning. Participants are supported in transforming concepts into fully realised story frameworks, while gaining practical insight into the filmmaking process.",
      "Through guided workshops and industry-informed sessions, participants explore narrative techniques, screenplay development, and the foundations of screen storytelling. The programme integrates both creative and practical learning, ensuring participants understand not only how to tell stories, but how to prepare them for real-world production.",
      "As projects evolve, participants engage in collaborative development, forming teams, exploring casting and locations, and building an understanding of key production elements including camera, lighting, and sound.",
      "The programme aims to strengthen creative confidence, develop industry-ready skills, and create pathways for emerging filmmakers to engage with the broader screen industry.",
    ],
    points: [
      "Concept development and idea generation",
      "Storytelling techniques and narrative structure",
      "Screenplay writing and refinement",
      "Script breakdown and project planning",
      "Budgeting, scheduling, and resource planning",
      "Casting, team formation, and location planning",
      "Introduction to camera, lighting, and sound",
    ],
  },
  {
    title: "Create & Explore",
    intro: "Applying storytelling through practical screen exercises",
    paragraphs: [
      "Building on developed scripts and creative planning, participants engage in guided, hands-on learning activities designed to translate written narratives into visual form.",
      "This phase focuses on practical screen-based exercises within a structured learning environment, where participants explore directing, visual storytelling, and collaborative workflows.",
      "Participants are introduced to key filmmaking processes — including cinematography, lighting, sound, and editing — through supervised activities that emphasise experimentation, skill development, and creative problem-solving.",
      "Rather than full-scale production, the focus is on applying storytelling principles through short-form exercises, enabling participants to understand how narrative, performance, and visual language come together on screen.",
      "Participants also gain introductory experience in post-production processes such as editing, sound design, and visual refinement, supporting the development of cohesive screen-based outcomes within a learning context.",
    ],
    points: [
      "Directing and visual storytelling techniques",
      "Cinematography fundamentals and camera operation",
      "Lighting and sound principles for screen",
      "Collaborative workflows and on-set awareness",
      "Editing and post-production fundamentals",
      "Sound design and audio refinement",
      "Visual enhancement and storytelling through editing",
      "Development of short-form screen exercises",
    ],
  },
  {
    title: "Showcase & Connect",
    intro: "Presenting ideas and engaging with industry",
    paragraphs: [
      "In the final phase, participants are supported in presenting their creative work and ideas within a professional context.",
      "This includes developing pitching skills, participating in curated showcases, and gaining insight into how creative concepts and early-stage work can be communicated to industry audiences.",
      "The focus is on building confidence, communication skills, and professional awareness, rather than commercial release outcomes.",
      "Participants engage with industry professionals through networking opportunities, gaining exposure to industry perspectives and creating pathways for future collaboration and career development.",
      "This phase also encourages international exchange and cross-cultural dialogue, supporting participants to understand storytelling within a global context.",
    ],
    points: [
      "Pitch development and presentation skills",
      "Curated showcases of concepts and short-form outputs",
      "Introduction to industry pathways and opportunities",
      "Industry engagement and professional networking",
      "Understanding audience engagement and presentation",
      "International collaboration and cross-cultural exchange",
    ],
  },
];

export interface PhaseHighlight {
  title: string;
  text: string;
  Icon: LucideIcon;
}

export const phaseHighlights: PhaseHighlight[] = [
  {
    title: "Learn & Develop",
    text: "A structured learning initiative guiding emerging filmmakers from idea generation through narrative development, storytelling, and production planning.",
    Icon: Lightbulb,
  },
  {
    title: "Create & Explore",
    text: "Engage in guided, hands-on screen exercises — exploring directing, visual storytelling, cinematography, and post-production within a structured learning environment.",
    Icon: Clapperboard,
  },
  {
    title: "Showcase & Connect",
    text: "Present creative work and ideas, develop pitching and communication skills, and engage with industry professionals and international networks.",
    Icon: Handshake,
  },
];

export const programmeDelivery = [
  "Industry-led mentorship",
  "Structured training workshops",
  "Hands-on practical learning",
  "Project-based collaboration",
  "Industry engagement platforms",
];

export const programmeOutcomes = [
  "Youth empowerment",
  "Skills development",
  "Employment pathways",
  "Cultural exchange",
  "Creative industry growth",
];
