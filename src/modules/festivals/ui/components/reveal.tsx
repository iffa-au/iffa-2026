"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fades and lifts its children in once they enter the viewport.
 *
 * Deliberately CSS-only under the hood: the site already loads GSAP for the
 * home carousel, but a scroll reveal this simple does not need it, and a plain
 * transition is what `motion-reduce` can switch off for free.
 *
 * If IntersectionObserver is unavailable the content is shown immediately —
 * the animation is decoration and must never be the reason something is
 * invisible.
 */

type RevealProps = {
  children: React.ReactNode;
  /** Stagger, in ms. Keep under ~250 so a row never feels slow. */
  delay?: number;
  className?: string;
};

export function Reveal({ children, delay = 0, className = "" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      // Deferred rather than set inline: the state has to change after the
      // first paint, or it is just a hydration mismatch waiting to happen.
      const timer = window.setTimeout(() => setIsVisible(true), 0);
      return () => window.clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        setIsVisible(true);
        // One-shot: nothing re-hides on scroll back up.
        observer.disconnect();
      },
      { threshold: 0.08, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none motion-reduce:!translate-y-0 motion-reduce:!opacity-100 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}
