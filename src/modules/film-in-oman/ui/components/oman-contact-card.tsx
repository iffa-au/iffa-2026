import Link from "next/link";
import { cn } from "@/lib/utils";

export function OmanContactCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-lg bg-black/80 backdrop-blur-sm border border-white/10 p-4 sm:p-5 md:p-6 text-left shadow-2xl",
        className
      )}
    >
      <p className="text-sm text-[#e6ba35] font-semibold mb-3">
        For filming enquiries and production support in Oman, please contact:
      </p>

      <div className="space-y-3 sm:space-y-4">
        <div>
          <h4 className="text-white font-bold text-sm sm:text-base">Oman Film Society</h4>
          <a href="mailto:omanfilmsociety@gmail.com" className="text-[#9e9e9e] text-xs sm:text-sm break-all hover:text-[#C9943A]">
            omanfilmsociety@gmail.com
          </a>
        </div>
        <div>
          <h4 className="text-white font-bold text-sm sm:text-base">Mr. Mohammed bin Abdullah Al Ajmi</h4>
          <p className="text-[#9e9e9e] text-xs sm:text-sm">Chairman, Oman Film Society</p>
          <a href="mailto:alajmifilm@gmail.com" className="text-[#9e9e9e] text-xs sm:text-sm break-all hover:text-[#C9943A]">
            alajmifilm@gmail.com
          </a>
        </div>
        <div>
          <h4 className="text-white font-bold text-sm sm:text-base">Mr. Fahad bin Ramadan Al-Maimani</h4>
          <p className="text-[#9e9e9e] text-xs sm:text-sm">Director of Local and International Relations, Oman Film Society</p>
          <a href="mailto:fahad.almaimani@gmail.com" className="text-[#9e9e9e] text-xs sm:text-sm break-all hover:text-[#C9943A]">
            fahad.almaimani@gmail.com
          </a>
        </div>
      </div>

      <Link
        href="/oman/enquiry"
        className="mt-4 sm:mt-5 inline-block w-full rounded-md bg-[#C9943A] px-4 py-2.5 text-center text-xs font-bold uppercase tracking-wide text-black transition hover:brightness-110"
      >
        Submit Filming Enquiry
      </Link>
    </div>
  );
}
