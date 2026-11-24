import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

// The site's share image (og:image), served as a 1200x630 JPEG made from
// public/opengraph-image.webp. Link previewers such as WhatsApp handle JPEG more
// reliably than webp, so the webp stays the source and this is what they get.
// Built once at `next build`; replace the webp and redeploy to change it.
// ponytail: one fixed image, no ?url= param, so this can't become an open proxy.
export const dynamic = "force-static";

export async function GET() {
  const webp = await readFile(path.join(process.cwd(), "public", "opengraph-image.webp"));
  const jpeg = await sharp(webp)
    .resize(1200, 630, { fit: "cover" })
    .jpeg({ quality: 80, mozjpeg: true })
    .toBuffer();

  return new Response(new Uint8Array(jpeg), {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
