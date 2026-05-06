"use client";

import { useEffect, useRef, useState } from "react";

type WordToken = { text: string; highlight: boolean; noLeftSpace?: boolean };

const tokens: WordToken[] = [
  { text: "IFFA", highlight: true },
  { text: ",", highlight: false, noLeftSpace: true },
  ...[
    "is", "where", "creative", "ambition", "is", "recognised,",
    "cinematic", "excellence", "is", "honoured,", "and", "stories",
    "transcend", "borders", "to", "inspire", "the", "world.",
  ].map((w) => ({ text: w, highlight: false })),
];

const TextDivider = () => {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="flex w-full flex-col items-center bg-black px-6 py-24 text-center"
    >
      {/* Top decorative rule */}
      <div className="flex items-center gap-3 mb-10 w-full max-w-xs">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-yellow-600" />
        <div className="w-2 h-2 rotate-45 bg-yellow-500" />
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-yellow-600" />
      </div>

      <div className="max-w-4xl">
        <h3 className="text-2xl italic leading-relaxed text-white md:text-4xl font-serif">
          {tokens.map((token, i) => (
            <span
              key={i}
              className={[
                "inline-block transition-all duration-500",
                token.noLeftSpace ? "mr-[0.3em]" : "mx-[0.15em]",
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
                token.highlight ? "font-bold not-italic text-yellow-500" : "",
              ].join(" ")}
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              {token.text}
            </span>
          ))}
        </h3>
      </div>

      {/* Bottom decorative rule */}
      <div className="flex items-center gap-3 mt-10 w-full max-w-xs">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-yellow-600" />
        <div className="w-2 h-2 rotate-45 bg-yellow-500" />
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-yellow-600" />
      </div>
    </section>
  );
};

export { TextDivider };
export default TextDivider;