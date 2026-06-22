"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type Option = { value: string; label: string };

type MultiSelectDropdownProps = {
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
};

export function MultiSelectDropdown({
  options,
  value,
  onChange,
  placeholder = "Select options",
  error,
  disabled = false,
}: MultiSelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPosition({
      top: rect.bottom + 6,
      left: rect.left,
      width: rect.width,
    });
  };

  useEffect(() => {
    if (!open) return;
    updatePosition();
    const onScrollOrResize = () => updatePosition();
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (triggerRef.current?.contains(target)) return;
      if (panelRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [open]);

  const toggle = (v: string) =>
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
  const selected = options.filter((o) => value.includes(o.value));

  const panel = open ? (
    <div
      ref={panelRef}
      style={{
        position: "fixed",
        top: position.top,
        left: position.left,
        width: position.width,
        zIndex: 9999,
      }}
      className="rounded-xl border border-[#2a2418] bg-[#0e0d0a] shadow-2xl shadow-black/80 overflow-hidden"
    >
      <div className="max-h-52 overflow-y-auto">
        {options.length === 0 ? (
          <p className="text-[#4a4232] text-xs text-center py-4">Loading…</p>
        ) : (
          options.map((o) => (
            <button
              type="button"
              key={o.value}
              onClick={() => toggle(o.value)}
              className={cn(
                "w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors text-left",
                value.includes(o.value)
                  ? "bg-[#e6ba35]/8 text-[#e6ba35]"
                  : "text-[#9a9278] hover:bg-[#141210] hover:text-white",
              )}
            >
              {o.label}
              {value.includes(o.value) && <Check size={12} className="text-[#e6ba35]" />}
            </button>
          ))
        )}
      </div>
    </div>
  ) : null;

  return (
    <div>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "w-full min-h-[44px] bg-[#0a0908] border rounded-lg px-4 py-2 text-left flex items-center justify-between gap-2 transition-all focus:outline-none",
          open ? "border-[#e6ba35]/50" : "border-[#2a2418] hover:border-[#3d3520]",
          error && "border-red-500/50",
          disabled && "opacity-60 cursor-not-allowed",
        )}
      >
        <div className="flex flex-wrap gap-1.5 flex-1">
          {selected.length === 0 ? (
            <span className="text-[#3d3828] text-sm">{placeholder}</span>
          ) : (
            selected.map((o) => (
              <Badge
                key={o.value}
                className="bg-[#e6ba35]/12 text-[#e6ba35] border border-[#e6ba35]/25 px-2 py-0 text-xs rounded-md gap-1 font-normal"
              >
                {o.label}
                <span
                  role="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggle(o.value);
                  }}
                  className="opacity-50 hover:opacity-100 cursor-pointer"
                >
                  <X size={9} />
                </span>
              </Badge>
            ))
          )}
        </div>
        <ChevronDown
          size={13}
          className={cn("flex-shrink-0 text-[#4a4232] transition-transform", open && "rotate-180")}
        />
      </button>
      {typeof document !== "undefined" && createPortal(panel, document.body)}
      {error && <p className="text-red-400 text-xs mt-1.5">{error}</p>}
    </div>
  );
}
