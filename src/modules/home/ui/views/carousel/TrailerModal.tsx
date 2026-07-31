"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Play, X } from "lucide-react";

type TrailerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  embedUrl: string | null;
  title: string;
};

const EXIT_ANIMATION_MS = 200;

const TrailerModal = ({ isOpen, onClose, embedUrl, title }: TrailerModalProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Mount immediately, then flip to visible a frame later so the
  // opacity/scale transition actually has something to animate from.
  useEffect(() => {
    if (!isOpen) return;

    setIsMounted(true);
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => setIsVisible(true))
    );
    return () => cancelAnimationFrame(raf);
  }, [isOpen]);

  // On close, play the exit transition before unmounting.
  useEffect(() => {
    if (isOpen || !isMounted) return;

    setIsVisible(false);
    const timeout = window.setTimeout(() => setIsMounted(false), EXIT_ANIMATION_MS);
    return () => window.clearTimeout(timeout);
  }, [isOpen, isMounted]);

  useEffect(() => {
    if (!isMounted) return;

    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMounted, onClose]);

  useEffect(() => {
    if (isVisible) closeButtonRef.current?.focus();
  }, [isVisible]);

  if (!isMounted || typeof document === "undefined") return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} trailer`}
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm transition-opacity duration-200 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div
        className={`relative w-full max-w-3xl overflow-hidden rounded-xl border border-white/10 bg-zinc-950 shadow-2xl transition-all duration-200 ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          aria-label="Close trailer"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-yellow-500 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="aspect-video w-full bg-black">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={`${title} trailer`}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-white/50">
              <Play className="h-10 w-10" />
              <p className="text-sm">Trailer coming soon.</p>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-base font-bold text-white">{title}</h3>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default TrailerModal;
