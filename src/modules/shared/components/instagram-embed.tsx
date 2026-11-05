import { getInstagramEmbedUrl } from "@/lib/instagram";
import { cn } from "@/lib/utils";

type InstagramEmbedProps = {
  url?: string;
  title?: string;
  className?: string;
};

/** Renders an Instagram post/reel as an iframe. Renders nothing for non-embeddable URLs. */
export function InstagramEmbed({ url, title = "Instagram post", className }: InstagramEmbedProps) {
  const src = getInstagramEmbedUrl(url);
  if (!src) return null;

  // ponytail: fixed height — Instagram's iframe doesn't report its size without their embed.js;
  // pass a h-[...] class to override, or load embed.js if posts get clipped.
  return (
    <iframe
      src={src}
      title={title}
      className={cn("h-[640px] w-full rounded-xl border border-white/10 bg-white", className)}
      loading="lazy"
      allow="encrypted-media; picture-in-picture; web-share"
      allowFullScreen
    />
  );
}
