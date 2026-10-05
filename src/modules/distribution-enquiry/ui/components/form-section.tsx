import type { ReactNode } from "react";

/** One titled card of the form. Same frame as the film enquiry's sections. */
export function FormSection({
  title,
  desc,
  children,
}: {
  title: string;
  desc?: string;
  children: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-[#2a2417] bg-[#17140d] shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
      <div className="border-b border-[#2a2417] px-5 py-5 md:px-7">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        {desc && <p className="mt-1 text-[13px] text-[#8a8168]">{desc}</p>}
      </div>
      <div className="p-5 md:p-7">{children}</div>
    </section>
  );
}
