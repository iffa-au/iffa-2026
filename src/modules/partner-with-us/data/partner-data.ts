import type { PartnerTier } from "../lib/partners";

/**
 * Tier descriptions are marketing copy, so they stay in the codebase.
 * The partner records themselves (logo, name, website, tier) are managed
 * from the CMS — see lib/partners.ts.
 */
export const partnershipTiers: {
  tier: PartnerTier;
  title: string;
  description: string;
}[] = [
  {
    tier: "PRESENTING",
    title: "Presenting Partner",
    description:
      "The Presenting Partner holds the highest distinction at the Annual Excellence Awards. Beyond brand exposure across international media and elite audiences, this partnership is a statement of leadership, prestige, and innovation. It is a strategic investment that drives business impact, opens doors to global networks, and positions the partner as a key influencer in shaping culture, commerce, and creativity on a world stage.",
  },
  {
    tier: "CULTURAL",
    title: "Cultural Partner",
    description:
      "The Cultural Partner connects the Awards to the wider world of creativity and storytelling. By supporting artistic excellence, heritage, and diversity, they enhance the event's prestige and contribute to Australia's cultural influence globally. This partnership offers high-value visibility and association with a celebration that resonates with audiences, industry leaders, and international stakeholders alike.",
  },
  {
    tier: "SUPPORTING",
    title: "Supporting Partners",
    description:
      "Supporting Partners form the foundation of the Annual Excellence Awards. Their involvement ensures a world-class event that attracts global attention, generates media coverage, and provides meaningful opportunities for brand alignment with innovation and excellence. Through this partnership, they gain visibility, credibility, and association with an event that elevates both industry and nation on an international scale.",
  },
];

export const partnerBenefits = [
  {
    title: "Global Visibility",
    description:
      "High-impact presence at a marquee event attended by international guests, celebrities, and media, amplified across live and digital platforms.",
  },
  {
    title: "Premium Brand Association",
    description:
      "Align your organisation with cinematic excellence, prestige, and cultural influence in front of an elite international audience.",
  },
  {
    title: "Cross-Border Opportunity",
    description:
      "Access foreign investment and collaboration opportunities as IFFA unites world cinema, international brands, and influential leaders.",
  },
  {
    title: "Measurable Impact",
    description:
      "Partnerships are designed to deliver tangible ROI — strengthening brand recognition and consumer trust while supporting Australia's creative economy.",
  },
];
