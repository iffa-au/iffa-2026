/**
 * Remote hosts next/image may resize. Shared by `next.config.ts`
 * (`images.remotePatterns`) and `canOptimizeImage`, so the two can't drift:
 * next/image throws at render for a host outside remotePatterns.
 *
 * - CloudFront: current CMS uploads (2026 onward).
 * - The S3 bucket: 2025 posters and landscapes, linked straight from S3. Left
 *   out, every 2025 card downloaded its original (up to ~2.5 MB, 2160×2880).
 *
 * Imported by next.config.ts by relative path, so no `@/` imports in here.
 */
export const OPTIMIZABLE_IMAGE_HOSTS = [
	"dhbdzeb2cbayq.cloudfront.net",
	"iffaimages.s3.ap-southeast-2.amazonaws.com",
	"localhost",
	"malaymail.com",
] as const;
