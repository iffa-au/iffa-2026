const CF = process.env.NEXT_PUBLIC_CLOUDFRONT_URL ?? "";

export const videoUrls = {
  omanHub: `${CF}iffa/videos/Oman/oman_bg.mp4`,
  filmingLocations: `${CF}iffa/videos/Oman/filming_loc.mp4`,
  filmingOpportunities: `${CF}iffa/videos/Oman/filming-oppurtunities.mp4`,
  productionSupport: `${CF}iffa/videos/Oman/production.mp4`,
  filmingGuide: `${CF}iffa/videos/Oman/filming_guide.mp4`,
};

export const navCards = [
  {
    title: "Filming Locations",
    descriptor: "Deserts, coastlines, mountains & heritage sites",
    href: "/oman/filming-locations",
    icon: "Location01Icon",
  },
  {
    title: "Filming Opportunities",
    descriptor: "Feature films, docs, commercials & more",
    href: "/oman/filming-opportunities",
    icon: "Film01Icon",
  },
  {
    title: "Production Support",
    descriptor: "End-to-end local crew & logistics",
    href: "/oman/production-support",
    icon: "UserGroupIcon",
  },
  {
    title: "Filming Guide",
    descriptor: "Step-by-step permits & planning guide",
    href: "/oman/filming-guide",
    icon: "TaskDone01Icon",
  },
] as const;

export const categories = [
  "All",
  "Desert Landscapes",
  "Mountain Ranges",
  "Coastlines & Beaches",
  "Urban & Modern",
  "Wadis & Natural Water Landscapes",
  "Forts, Castles & Heritage",
] as const;

export type LocationCategory = (typeof categories)[number];

export interface FilmingLocation {
  id: number;
  title: string;
  category: LocationCategory;
  description: string;
  image: string;
}

export const filmingLocations: FilmingLocation[] = [
  {
    id: 1,
    title: "Wahiba Sands",
    category: "Desert Landscapes",
    description: "Vast golden dune seas stretching to the horizon",
    image: `${CF}iffa/images/Oman/wahiba_sands.webp`,
  },
  {
    id: 2,
    title: "Rub' al Khali Edge",
    category: "Desert Landscapes",
    description: "Dramatic desert landscapes with shifting sand formations",
    image: `${CF}iffa/images/Oman/rub_al_khali_edge.webp`,
  },
  {
    id: 3,
    title: "Al Hajar Mountains",
    category: "Mountain Ranges",
    description: "Rugged peaks and dramatic gorges",
    image: `${CF}iffa/images/Oman/hajar.webp`,
  },
  {
    id: 4,
    title: "Wadi Ghul",
    category: "Mountain Ranges",
    description: "Oman's Grand Canyon — deep dramatic wadis",
    image: `${CF}iffa/images/Oman/wadi_khul.webp`,
  },
  {
    id: 5,
    title: "Muscat Corniche",
    category: "Coastlines & Beaches",
    description: "Iconic waterfront with forts and mountains as backdrop",
    image: `${CF}iffa/images/Oman/corniche.webp`,
  },
  {
    id: 6,
    title: "Salalah Coast",
    category: "Coastlines & Beaches",
    description: "Lush monsoon coastline, pristine and untouched",
    image: `${CF}iffa/images/Oman/salalah.webp`,
  },
  {
    id: 7,
    title: "Nizwa Fort",
    category: "Forts, Castles & Heritage",
    description: "16th-century fortress at the heart of ancient Oman",
    image: `${CF}iffa/images/Oman/nizwa_fort.webp`,
  },
  {
    id: 8,
    title: "Old Muscat",
    category: "Forts, Castles & Heritage",
    description: "Walled city gates, palaces and traditional architecture",
    image: `${CF}iffa/images/Oman/old_muscat.webp`,
  },
  {
    id: 9,
    title: "Mutrah Souq",
    category: "Forts, Castles & Heritage",
    description: "Labyrinthine market full of atmospheric alleyways",
    image: `${CF}iffa/images/Oman/mutrah_souq.webp`,
  },
  {
    id: 10,
    title: "Muscat CBD",
    category: "Urban & Modern",
    description: "Contemporary architecture meets Arabian identity",
    image: `${CF}iffa/images/Oman/muscat_cbd.webp`,
  },
  {
    id: 11,
    title: "Qurum District",
    category: "Urban & Modern",
    description: "Modern city living with coastal access",
    image: `${CF}iffa/images/Oman/qurum.webp`,
  },
  {
    id: 12,
    title: "Wadi Shab",
    category: "Wadis & Natural Water Landscapes",
    description: "Turquoise pools and dramatic canyon walls cutting through the desert",
    image: `${CF}iffa/images/Oman/wadi_shab.webp`,
  },
  {
    id: 13,
    title: "Wadi Bani Khalid",
    category: "Wadis & Natural Water Landscapes",
    description: "Crystal-clear natural pools surrounded by palm trees and sandstone",
    image: `${CF}iffa/images/Oman/wadi_bani_khalid.webp`,
  },
  {
    id: 14,
    title: "Bahla Fort",
    category: "Forts, Castles & Heritage",
    description: "UNESCO World Heritage mud-brick fortress dating back to the 13th century",
    image: `${CF}iffa/images/Oman/bahla_fort.webp`,
  },
  {
    id: 15,
    title: "Fort Bait Naman",
    category: "Forts, Castles & Heritage",
    description: "Restored 17th-century coastal fort with white-washed towers and traditional Omani architecture",
    image: `${CF}iffa/images/Oman/fort_bait_naman.webp`,
  },
];

export const features = [
  {
    icon: "Layers01Icon",
    title: "Diverse Landscape Variety",
    description:
      "From dunes and wadis to coastlines and mountain ranges — a full spectrum of natural backdrops within a single country.",
  },
  {
    icon: "SparklesIcon",
    title: "Untapped Cinematic Potential",
    description:
      "Most landscapes remain unphotographed and unfilmed — giving your production an authentic and exclusive look.",
  },
  {
    icon: "FlashIcon",
    title: "Efficient Logistics",
    description:
      "High-quality local infrastructure, accessible roads, and a growing network of production-friendly services.",
  },
  {
    icon: "AnalyticsUpIcon",
    title: "Growing Film Economy",
    description:
      "Government investment in the creative sector and increasing openness to international productions of all scales.",
  },
] as const;

export const opportunities = [
  {
    title: "Feature Films & Drama Series",
    desc: "Large-scale narrative productions seeking distinctive visual environments not available elsewhere in the region.",
  },
  {
    title: "Documentary & Factual Content",
    desc: "Natural history, cultural exploration, and investigative documentaries with access to unique subject matter.",
  },
  {
    title: "Commercial & Advertising",
    desc: "Automotive, travel, lifestyle, and luxury brands seeking high-impact desert and coastal backdrops.",
  },
  {
    title: "Music Videos & Short-Form Content",
    desc: "Artists and content creators seeking visually distinctive locations for creative and editorial productions.",
  },
  {
    title: "Photography & Print",
    desc: "Fashion editorials, travel photography, and archival documentation projects across varied terrain.",
  },
];

export const quickFacts = [
  { label: "Climate", value: "Arid, Sun Year-Round" },
  { label: "Language", value: "Arabic (English Widely Spoken)" },
  { label: "Currency", value: "Omani Rial (OMR)" },
  { label: "Time Zone", value: "GMT+4" },
];

export const productionServices = [
  {
    icon: "ClipboardIcon",
    title: "Pre-Production Support",
    items: [
      "Project feasibility and planning",
      "Location research and scouting coordination",
      "Budgeting and scheduling guidance",
      "Filming permit preparation and documentation",
    ],
  },
  {
    icon: "Film01Icon",
    title: "Production Services",
    items: [
      "Line production and local management",
      "Production coordination and crew supervision",
      "Access to local crew — camera, lighting, sound, art",
      "Casting support for actors, extras, and talent",
    ],
  },
  {
    icon: "FileValidationIcon",
    title: "Permits & Government Coordination",
    items: [
      "Guidance on permit requirements",
      "Coordination with Ministry of Information Oman",
      "Assistance with documentation and approvals",
      "Approval timeline management",
    ],
  },
];

export const workflowSteps = [
  {
    number: "01",
    title: "Contact the Ministry of Information Oman",
    intro:
      "The first step is to initiate the filming approval process with the relevant authority.",
    items: [
      "Confirming permit requirements",
      "Understanding documentation needs",
      "Reviewing the nature and scope of the production",
    ],
    note: "The Ministry of Information Oman is the primary authority responsible for filming permits and approvals.",
  },
  {
    number: "02",
    title: "Engage a Local Production Partner",
    intro:
      "Working with a local production company, fixer, or line producer is strongly recommended to support the production process in Oman.",
    items: [
      "Permit coordination",
      "Location scouting",
      "Crew sourcing",
      "Logistics and on-ground execution",
    ],
    note: "Their local knowledge helps streamline planning and ensures smoother coordination throughout the project.",
  },
  {
    number: "03",
    title: "Finalise the Core Production Plan",
    intro:
      "Before submitting for approvals, the core production framework should be locked in.",
    items: [
      "Shooting schedule confirmed",
      "Key locations selected and assessed",
      "Budget framework approved",
      "Crew and equipment requirements finalised",
    ],
    note: "Having these elements confirmed early helps avoid delays and supports a more efficient permit process.",
  },
  {
    number: "04",
    title: "Obtain Permits and Proceed to Production",
    intro:
      "Once approvals are granted and permits are issued, production can move forward.",
    items: [
      "Permits issued and confirmed",
      "Crew and equipment mobilised",
      "Begin filming in approved locations",
      "Maintain compliance with permit conditions throughout",
    ],
    note: null,
  },
];

export const warningItems = [
  "Drone filming",
  "Large-scale crews",
  "Heritage or public locations",
  "Imported equipment",
  "Sensitive or restricted areas",
  "Overnight or multi-day shoots",
];
