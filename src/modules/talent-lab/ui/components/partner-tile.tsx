/**
 * A partner placeholder tile.
 *
 * The `LOGO` panel is `aria-hidden` decoration; the organisation name below it
 * is the real content. No partner logo files exist, and none will exist until
 * an agreement is signed — the partners page says so explicitly, and this
 * component is built so nothing here can imply otherwise.
 */
export function PartnerTile({
  organisation,
  note,
}: {
  organisation: string;
  /** e.g. "Placeholder · not confirmed". Stated on the tile, never implied. */
  note?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3.5 rounded-xl border border-white/10 bg-white/5 p-5 text-center">
      <div
        aria-hidden="true"
        className="flex h-11 w-full items-center justify-center rounded-sm bg-[repeating-linear-gradient(112deg,rgba(255,255,255,0.05)_0_2px,transparent_2px_9px),rgba(255,255,255,0.04)] font-mono text-[9px] tracking-[0.16em] text-white/40"
      >
        LOGO
      </div>

      <p className="font-mono text-[9px] uppercase leading-relaxed tracking-[0.14em] text-white/70">
        {organisation}
      </p>

      {note && (
        <p className="font-mono text-[8.5px] uppercase leading-relaxed tracking-[0.14em] text-white/35">
          {note}
        </p>
      )}
    </div>
  );
}
