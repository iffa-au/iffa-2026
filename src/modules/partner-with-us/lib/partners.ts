const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export const PARTNER_TIERS = ["PRESENTING", "CULTURAL", "SUPPORTING"] as const;
export type PartnerTier = (typeof PARTNER_TIERS)[number];

export type Partner = {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl?: string;
  tier: PartnerTier;
};

type PartnerApiItem = {
  _id?: unknown;
  id?: unknown;
  name?: string;
  logoUrl?: string;
  websiteUrl?: string;
  tier?: string;
};

const isPartnerTier = (value: unknown): value is PartnerTier =>
  typeof value === "string" && (PARTNER_TIERS as readonly string[]).includes(value);

// Same guard the film pages use: a bare domain pasted into an image field
// would otherwise be treated as a relative path and 404 against the app router.
const isValidLogoUrl = (value?: string): value is string =>
  !!value && /^(https?:\/\/|\/)/i.test(value);

const mapPartner = (item: PartnerApiItem): Partner | null => {
  const id = String(item._id ?? item.id ?? "");
  const name = (item.name ?? "").trim();
  if (!id || !name || !isValidLogoUrl(item.logoUrl)) return null;
  return {
    id,
    name,
    logoUrl: item.logoUrl,
    websiteUrl: isValidLogoUrl(item.websiteUrl) ? item.websiteUrl : undefined,
    tier: isPartnerTier(item.tier) ? item.tier : "SUPPORTING",
  };
};

/**
 * Partners are already ordered by tier then position server-side, so the
 * page can render them in the order they arrive.
 */
export const fetchPartners = async (signal?: AbortSignal): Promise<Partner[]> => {
  const base = API_BASE_URL.endsWith("/") ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  const response = await fetch(`${base}/partners`, { signal });
  if (!response.ok) throw new Error(`Failed to fetch partners (${response.status})`);

  const payload: unknown = await response.json();
  const items: PartnerApiItem[] = Array.isArray(payload)
    ? payload
    : Array.isArray((payload as { data?: unknown })?.data)
      ? ((payload as { data: PartnerApiItem[] }).data ?? [])
      : [];

  return items.map(mapPartner).filter((p): p is Partner => p !== null);
};

export const groupByTier = (partners: Partner[]): Record<PartnerTier, Partner[]> => ({
  PRESENTING: partners.filter((p) => p.tier === "PRESENTING"),
  CULTURAL: partners.filter((p) => p.tier === "CULTURAL"),
  SUPPORTING: partners.filter((p) => p.tier === "SUPPORTING"),
});
