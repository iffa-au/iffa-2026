const CF = process.env.NEXT_PUBLIC_CLOUDFRONT_URL ?? "";

export const videoUrls = {
  australiaHub: `${CF}iffa/videos/Australia/australia_bg.mp4`,
  filmingLocations: `${CF}iffa/videos/Australia/filming_loc.mp4`,
  filmingOpportunities: `${CF}iffa/videos/Australia/filming-oppurtunities.mp4`,
  productionSupport: `${CF}iffa/videos/Australia/production_support.mp4`,
  filmingGuide: `${CF}iffa/videos/Australia/film_workflow.mp4`,
} as const;

export const navLinks = [
  {
    iconName: "Location01Icon",
    label: "Filming Locations",
    descriptor: "Outback, coastlines, cities & rainforest",
    href: "/australia/filming-locations",
  },
  {
    iconName: "Film01Icon",
    label: "Filming Opportunities",
    descriptor: "Feature films, docs, commercials & more",
    href: "/australia/filming-opportunities",
  },
  {
    iconName: "UserGroupIcon",
    label: "Production Support",
    descriptor: "End-to-end local crew & logistics",
    href: "/australia/production-support",
  },
  {
    iconName: "TaskDone01Icon",
    label: "Filming Guide",
    descriptor: "Step-by-step permits & planning guide",
    href: "/australia/filming-guide",
  },
] as const;

export const filters = ["All", "Urban", "Outback", "Coastal", "Tropical"] as const;
export type LocationFilter = (typeof filters)[number];

export interface AustraliaLocation {
  id: string;
  name: string;
  state: string;
  type: string;
  image: string;
  imagePosition?: string;
  desc: string;
  tags: string[];
}

export const locations: AustraliaLocation[] = [
  {
    id: "sydney",
    name: "Sydney",
    state: "NSW",
    type: "Urban",
    image: `${CF}iffa/images/Australia/sydney.webp`,
    desc: "Iconic harbour city with the Opera House, Harbour Bridge and world-class urban backdrops. Perfect for contemporary drama and commercial shoots.",
    tags: ["City", "Harbour", "Architecture"],
  },
  {
    id: "melbourne",
    name: "Melbourne",
    state: "VIC",
    type: "Urban",
    image: `${CF}iffa/images/Australia/melbourne.webp`,
    desc: "Laneways, rooftops and diverse neighbourhoods make Melbourne one of the most versatile urban filming destinations in the Southern Hemisphere.",
    tags: ["City", "Laneways", "Culture"],
  },
  {
    id: "uluru",
    name: "Uluru & Red Centre",
    state: "NT",
    type: "Outback",
    image: `${CF}iffa/images/Australia/uluru.webp`,
    desc: "Ancient red desert landscapes, Uluru and the MacDonnell Ranges offer otherworldly scale unmatched anywhere on earth.",
    tags: ["Desert", "Ancient", "Epic Scale"],
  },
  {
    id: "kakadu",
    name: "Kakadu",
    state: "NT",
    type: "Outback",
    image: `${CF}iffa/images/Australia/kakadu.webp`,
    desc: "UNESCO World Heritage wetlands, dramatic escarpments and ancient rock art. Unrivalled for nature documentaries and adventure productions.",
    tags: ["UNESCO", "Wetlands", "Wildlife"],
  },
  {
    id: "whitsundays",
    name: "Whitsundays",
    state: "QLD",
    type: "Coastal",
    image: `${CF}iffa/images/Australia/whitsundays.webp`,
    imagePosition: "object-top",
    desc: "74 islands, white silica beaches and turquoise coral sea waters. A natural backdrop for luxury, romance and adventure productions.",
    tags: ["Islands", "Beach", "Coral Sea"],
  },
  {
    id: "greatocean",
    name: "Great Ocean Road",
    state: "VIC",
    type: "Coastal",
    image: `${CF}iffa/images/Australia/great-ocean-road.webp`,
    desc: "Dramatic clifftops, the Twelve Apostles and rugged Southern Ocean coastline. One of the world's most cinematic coastal drives.",
    tags: ["Cliffs", "Ocean", "Dramatic"],
  },
  {
    id: "daintree",
    name: "Daintree Rainforest",
    state: "QLD",
    type: "Tropical",
    image: `${CF}iffa/images/Australia/daintree-rainforest.webp`,
    desc: "The world's oldest tropical rainforest meets the Great Barrier Reef. Lush canopy, rivers and extraordinary biodiversity.",
    tags: ["Rainforest", "Oldest", "Rivers"],
  },
  {
    id: "goldcoast",
    name: "Gold Coast",
    state: "QLD",
    type: "Tropical",
    image: `${CF}iffa/images/Australia/gold-coast.webp`,
    desc: "Home to Village Roadshow Studios, golden beaches and a year-round subtropical climate. A major hub for Hollywood productions in Australia.",
    tags: ["Studios", "Beach", "Subtropical"],
  },
];

export interface Opportunity {
  title: string;
  rebate: string;
  desc: string;
  details: string[];
}

export const opportunities: Opportunity[] = [
  {
    title: "Feature Films",
    rebate: "Up to 40%",
    desc: "International productions with qualifying Australian spend are eligible for the Location Offset rebate administered by Screen Australia.",
    details: [
      "Minimum AUD $15M qualifying spend",
      "Principal photography in Australia",
      "Screen Australia registration required",
    ],
  },
  {
    title: "TV Series & Streaming",
    rebate: "Up to 20%",
    desc: "Drama series, documentaries and episodic content qualify under the PDV and Location Offset programs with state top-up incentives.",
    details: [
      "Per-episode qualifying spend",
      "Screen Australia content classification",
      "State top-up rebates available",
    ],
  },
  {
    title: "Commercials & Branded",
    rebate: "State Incentives",
    desc: "Each Australian state offers tailored incentives for commercial production and branded content shot on location.",
    details: [
      "No minimum spend threshold at state level",
      "Fast-track permit processing available",
      "Tourism partnership opportunities",
    ],
  },
  {
    title: "Documentary & Co-Production",
    rebate: "Funding + Rebates",
    desc: "Screen Australia funds international co-productions and provides rebates for location-based documentary shoots.",
    details: [
      "Content funding available",
      "Access to national archives & institutions",
      "Indigenous consultation support provided",
    ],
  },
];

export interface ServiceItem {
  name: string;
  desc: string;
}

export interface ServiceSection {
  category: string;
  title: string;
  items: ServiceItem[];
}

export const services: ServiceSection[] = [
  {
    category: "Pre-Production",
    title: "Before You Shoot",
    items: [
      {
        name: "Location Scouting",
        desc: "Professional scouts across all states with permit liaison and council approvals.",
      },
      {
        name: "Visa & Work Permits",
        desc: "Specialist migration agents for international cast, crew and equipment importation.",
      },
      {
        name: "Budget & Rebate Consulting",
        desc: "Screen Australia rebate maximisation strategies and co-production structuring.",
      },
    ],
  },
  {
    category: "On-Ground Support",
    title: "While You're Shooting",
    items: [
      {
        name: "Local Crew Hire",
        desc: "Access to MEAA-affiliated crew across all departments nationwide.",
      },
      {
        name: "Equipment Rental",
        desc: "Camera, grip, lighting and specialised gear through national suppliers.",
      },
      {
        name: "Logistics & Transport",
        desc: "Production vehicles, freight and customs clearance support.",
      },
    ],
  },
  {
    category: "Post-Production",
    title: "After You Wrap",
    items: [
      {
        name: "VFX & Digital Effects",
        desc: "World-class VFX houses across Sydney, Melbourne and Brisbane.",
      },
      {
        name: "Sound Design & Mixing",
        desc: "AFTRS-trained engineers and purpose-built mixing theatres.",
      },
      {
        name: "DCP & International Delivery",
        desc: "Digital cinema package creation and international delivery support.",
      },
    ],
  },
];

export interface WorkflowStep {
  number: string;
  title: string;
  intro: string;
  items: string[];
  note: string | null;
}

export const workflowSteps: WorkflowStep[] = [
  {
    number: "01",
    title: "Contact Screen Australia",
    intro:
      "Begin by reaching out to Screen Australia, the federal government agency overseeing film production support and permits.",
    items: [
      "Confirm eligibility for producer offset or location offset rebates",
      "Review the Producer Offset guidelines",
      "Understand documentation and co-production requirements",
      "Register your production project",
    ],
    note: "Screen Australia is the primary authority for federal incentives. State-level film offices (e.g. Screen NSW, Film Victoria) handle location-specific support.",
  },
  {
    number: "02",
    title: "Engage a Local Production Partner",
    intro:
      "Partnering with an Australian line producer or production services company is strongly recommended to navigate permits, unions, and logistics.",
    items: [
      "Location scouting and permit coordination",
      "Local crew sourcing (MEAA union-compliant)",
      "Equipment hire and logistics",
      "On-ground production management",
    ],
    note: "Australia has a mature screen industry with experienced crews across all states. Local knowledge significantly reduces setup time.",
  },
  {
    number: "03",
    title: "Secure Locations & Permits",
    intro:
      "Once locations are selected, permits must be obtained from the relevant state or local authority.",
    items: [
      "Apply through the relevant state screen office or council",
      "Confirm National Park or heritage site requirements if applicable",
      "Arrange public liability insurance (mandatory for all permits)",
      "Submit drone / aerial filming applications separately (CASA regulated)",
    ],
    note: "Lead times vary — city councils may process permits in days, while national parks or defence lands can take several weeks.",
  },
  {
    number: "04",
    title: "Finalise Production Plan",
    intro:
      "Lock in the full production framework before mobilising crew and equipment.",
    items: [
      "Shooting schedule confirmed",
      "Budget and rebate claims structured",
      "Crew contracts and visas (if applicable) finalised",
      "Equipment carnets arranged for imported gear",
    ],
    note: null,
  },
  {
    number: "05",
    title: "Begin Production & Claim Rebates",
    intro:
      "With permits in hand and crew on the ground, production can commence. Rebate documentation should be tracked from day one.",
    items: [
      "Maintain qualifying Australian production expenditure (QAPE) records",
      "Ensure all expenditure receipts align with Screen Australia guidelines",
      "Submit Location Offset application post-production",
      "Work with an Australian accountant familiar with screen incentives",
    ],
    note: "The Producer Offset offers up to 40% rebate for feature films; the Location Offset offers 30% for eligible foreign productions spending AUD $15M+.",
  },
];

export const warningItems: string[] = [
  "Drone / aerial filming (CASA approval required)",
  "Heritage-listed or national park locations",
  "Large-scale crowd or stunt sequences",
  "Imported equipment (carnet may be required)",
  "Child performers (state-specific laws apply)",
  "Underwater or marine environment shoots",
];
