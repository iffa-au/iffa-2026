import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";

const SERIF = "var(--font-playfair), 'Playfair Display', Georgia, serif";

export function SuccessScreen({
  title,
  onReset,
}: {
  title: string;
  onReset: () => void;
}) {
  return (
    <div
      role="status"
      className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-20 text-center"
    >
      <div className="relative mb-8">
        <div className="absolute inset-0 scale-150 rounded-full bg-[#e6ba35]/15 blur-2xl" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-[#e6ba35]/30 bg-[#e6ba35]/8">
          <CheckCircle2 className="h-10 w-10 text-[#e6ba35]" />
        </div>
      </div>
      <h1 className="mb-3 text-3xl font-bold text-white" style={{ fontFamily: SERIF }}>
        Enquiry received
      </h1>
      <p className="mb-8 max-w-md text-sm leading-relaxed text-[#a9a086]">
        Thanks — we have the details for <span className="text-white">{title}</span>. Our
        distribution team reviews every enquiry and will contact you about next steps.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button
          asChild
          className="h-10 rounded-lg bg-[#e6ba35] px-6 text-xs font-bold uppercase tracking-widest text-black hover:bg-[#d4a82e]"
        >
          <Link href="/">Back to home</Link>
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={onReset}
          className="h-10 rounded-lg border border-[#2a2417] px-6 text-xs font-bold uppercase tracking-widest text-[#e6ba35] hover:bg-[#e6ba35]/10 hover:text-[#e6ba35]"
        >
          Enquire about another film
        </Button>
      </div>
    </div>
  );
}
