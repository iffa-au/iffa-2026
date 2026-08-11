import { HugeiconsIcon } from "@hugeicons/react";
import { Location01Icon } from "@hugeicons/core-free-icons";

import type { Showtime } from "../../lib/types";
import { SEAT_STATUS_CLASSES, SEAT_STATUS_LABEL } from "../../lib/screening-utils";

export function ShowtimeCard({ showtime }: { showtime: Showtime }) {
  return (
    <div className="flex min-w-[150px] flex-1 flex-col gap-2 rounded-lg border border-white/10 bg-white/5 p-3.5 sm:flex-none">
      <p className="text-base font-semibold leading-none text-white">{showtime.time}</p>

      <p className="inline-flex items-center gap-1.5 text-xs leading-relaxed text-white/60">
        <HugeiconsIcon icon={Location01Icon} size={13} color="currentColor" aria-hidden />
        {showtime.venue}
      </p>

      {/* Seat status is never colour-only — the label carries the meaning. */}
      <span
        className={`w-fit rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] ${
          SEAT_STATUS_CLASSES[showtime.seatStatus]
        }`}
      >
        {SEAT_STATUS_LABEL[showtime.seatStatus]}
      </span>
    </div>
  );
}
