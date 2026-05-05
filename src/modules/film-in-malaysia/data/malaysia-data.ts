const CF = process.env.NEXT_PUBLIC_CLOUDFRONT_URL ?? "";

export const videoUrls = {
  malaysiaHub: `${CF}iffa/videos/Malaysia/malaysia_bg.mp4`,
  filmingLocations: `${CF}iffa/videos/Malaysia/malaysia_filming_loc.mp4`,
  filmingOpportunities: `${CF}iffa/videos/Malaysia/malaysia_opportunities.mov`,
  productionSupport: `${CF}iffa/videos/Malaysia/malaysia_production.mp4`,
  filmingGuide: `${CF}iffa/videos/Malaysia/filming_workflow.mov`,
} as const;

export const subPages = [
  {
    iconName: "Location01Icon",
    label: "Filming Locations",
    descriptor: "Jungles, coastlines, cities & heritage sites",
    href: "/malaysia/filming-locations",
  },
  {
    iconName: "Film01Icon",
    label: "Filming Opportunities",
    descriptor: "Feature films, docs, commercials & more",
    href: "/malaysia/filming-opportunities",
  },
  {
    iconName: "UserGroupIcon",
    label: "Production Support",
    descriptor: "End-to-end local crew & logistics",
    href: "/malaysia/production-support",
  },
  {
    iconName: "TaskDone01Icon",
    label: "Filming Guide",
    descriptor: "Step-by-step permits & planning guide",
    href: "/malaysia/filming-guide",
  },
] as const;

export const filters = ["All", "Urban", "Jungle", "Coastal", "Heritage"] as const;
export type LocationFilter = (typeof filters)[number];

export interface MalaysiaLocation {
  id: string;
  name: string;
  state: string;
  type: string;
  image: string;
  desc: string;
  tags: string[];
}

export const locations: MalaysiaLocation[] = [
  {
    id: "kualalumpur",
    name: "Kuala Lumpur",
    state: "WP",
    type: "Urban",
    image: `${CF}iffa/images/Malaysia/kuala-lumpur.webp`,
    desc: "Petronas Twin Towers, Merdeka Square, Chow Kit night markets and a futuristic skyline. Perfect for contemporary drama, action and commercial shoots.",
    tags: ["City", "Skyline", "Night"],
  },
  {
    id: "putrajaya",
    name: "Putrajaya",
    state: "WP",
    type: "Urban",
    image: `${CF}iffa/images/Malaysia/putrajaya.webp`,
    desc: "Grand federal buildings, sweeping bridges and wide manicured boulevards. Ideal for political thrillers and sci-fi productions.",
    tags: ["Architecture", "Futuristic", "Wide Shots"],
  },
  {
    id: "borneo",
    name: "Borneo Rainforest",
    state: "Sabah",
    type: "Jungle",
    image: `${CF}iffa/images/Malaysia/borneo-rainforest.webp`,
    desc: "One of the world's oldest rainforests. Rivers, wildlife, dense canopy and morning fog create an unmatched natural atmosphere.",
    tags: ["Rainforest", "Wildlife", "Remote"],
  },
  {
    id: "tamannegara",
    name: "Taman Negara",
    state: "Pahang",
    type: "Jungle",
    image: `${CF}iffa/images/Malaysia/taman-negara.webp`,
    desc: "130-million-year-old primary jungle with canopy walkways, remote river systems and indigenous settlements.",
    tags: ["Jungle", "Rivers", "Indigenous"],
  },
  {
    id: "langkawi",
    name: "Langkawi",
    state: "Kedah",
    type: "Coastal",
    image: `${CF}iffa/images/Malaysia/langkawi.webp`,
    desc: "Turquoise Andaman waters, limestone karst islands and pristine beaches. A natural backdrop for adventure and romance productions.",
    tags: ["Beach", "Islands", "Water"],
  },
  {
    id: "perhentian",
    name: "Perhentian Islands",
    state: "Terengganu",
    type: "Coastal",
    image: `${CF}iffa/images/Malaysia/perhentian-islands.jpg`,
    desc: "Remote unspoiled coral islands with crystal-clear water. Minimal infrastructure makes it ideal for survival and nature shoots.",
    tags: ["Coral", "Remote", "Nature"],
  },
  {
    id: "georgetown",
    name: "George Town",
    state: "Penang",
    type: "Heritage",
    image: `${CF}iffa/images/Malaysia/george-town.jpg`,
    desc: "UNESCO World Heritage streets, colonial shophouses, vibrant street art and a rich multicultural texture.",
    tags: ["UNESCO", "Colonial", "Street Art"],
  },
  {
    id: "malacca",
    name: "Malacca City",
    state: "Malacca",
    type: "Heritage",
    image: `${CF}iffa/images/Malaysia/malacca-city.jpg`,
    desc: "Dutch colonial square, Portuguese fortress ruins and a scenic river. One of Southeast Asia's most storied filming backdrops.",
    tags: ["Colonial", "Fortress", "River"],
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
    rebate: "Up to 30%",
    desc: "International productions with qualifying Malaysian spend are eligible for the FINAS Location Incentive rebate.",
    details: [
      "Minimum MYR 1M qualifying spend",
      "Principal photography in Malaysia",
      "FINAS registration required",
    ],
  },
  {
    title: "TV Series & Streaming",
    rebate: "Up to 20%",
    desc: "Drama series, documentaries and episodic content qualify under FINAS and state-level incentive programs.",
    details: [
      "Per-episode qualifying spend",
      "FINAS content classification",
      "State top-up incentives available",
    ],
  },
  {
    title: "Commercials & Branded",
    rebate: "FINAS Incentives",
    desc: "Malaysia's FINAS body offers tailored incentives for commercial and branded content shot on location.",
    details: [
      "No minimum spend (state level)",
      "Fast-track permit processing",
      "Tourism partnership opportunities",
    ],
  },
  {
    title: "Documentary & Co-Production",
    rebate: "Funding + Rebates",
    desc: "FINAS and NFDC co-production frameworks support international documentary and editorial shoots.",
    details: [
      "Content funding available",
      "Access to national archives",
      "Indigenous community consultation support",
    ],
  },
];

export interface ServiceItem {
  name: string;
  desc: string;
}

export interface ServiceSection {
  category: string;
  items: ServiceItem[];
}

export const services: ServiceSection[] = [
  {
    category: "Pre-Production",
    items: [
      { name: "Location Scouting", desc: "Professional scouts across all states with FINAS permit liaison." },
      { name: "Visa & Work Permits", desc: "Specialist agents for cast, crew and equipment importation into Malaysia." },
      { name: "Budget & Rebate Consulting", desc: "FINAS rebate maximisation strategies and co-production structuring." },
    ],
  },
  {
    category: "On-Ground Support",
    items: [
      { name: "Local Crew Hire", desc: "Access to experienced Malaysian crew across all departments." },
      { name: "Equipment Rental", desc: "Camera, grip, lighting and specialised gear through national suppliers." },
      { name: "Logistics & Transport", desc: "Production vehicles, freight and customs clearance support." },
    ],
  },
  {
    category: "Post-Production",
    items: [
      { name: "VFX & Digital Effects", desc: "World-class VFX houses across Kuala Lumpur and Penang." },
      { name: "Sound Design & Mixing", desc: "Purpose-built mixing theatres and experienced sound engineers." },
      { name: "DCP & International Delivery", desc: "Digital cinema package creation and international delivery support." },
    ],
  },
];

export interface WorkflowStep {
  phase: string;
  title: string;
  duration: string;
  desc: string;
  actions: string[];
}

export const workflowSteps: WorkflowStep[] = [
  {
    phase: "01",
    title: "Initial Enquiry",
    duration: "Day 1–3",
    desc: "Submit your project brief to IFFA's Malaysia Production Desk. We review your concept, budget range and shooting requirements.",
    actions: ["Complete enquiry form", "Attach treatment or brief", "Specify target locations"],
  },
  {
    phase: "02",
    title: "Feasibility & FINAS Check",
    duration: "Day 4–10",
    desc: "Our team assesses FINAS rebate eligibility, location availability, permit complexity and crew requirements.",
    actions: ["FINAS eligibility assessment", "State permit pre-assessment", "Preliminary budget modelling"],
  },
  {
    phase: "03",
    title: "Location Scout & Pre-Production",
    duration: "Week 2–6",
    desc: "Dedicated scouts survey shortlisted locations. Permits are lodged with FINAS and local authorities in parallel.",
    actions: ["Scouting reports with photography", "Permit applications lodged", "Local crew shortlisting begins"],
  },
  {
    phase: "04",
    title: "Production",
    duration: "Per Schedule",
    desc: "On-ground production coordinators support the shoot with daily liaison with location managers and local councils.",
    actions: ["On-ground IFFA coordinator", "Daily location liaison", "Safety & compliance oversight"],
  },
  {
    phase: "05",
    title: "Post-Production & Rebate Claim",
    duration: "Post-wrap",
    desc: "Rebate documentation is compiled alongside your post-production workflow. Our team supports the final FINAS claim submission.",
    actions: ["Expenditure audit preparation", "FINAS rebate submission", "Post-production facility introductions"],
  },
];
