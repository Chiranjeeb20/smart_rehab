"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { DoctorInfo } from "../lib/auth";

interface SpecialistSliderProps {
  doctors: DoctorInfo[];
  onConnect: (doctorCode: string) => void;
  connectedDoctorCode?: string;
}

export default function SpecialistSlider({
  doctors,
  onConnect,
  connectedDoctorCode,
}: SpecialistSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [autoSlide, setAutoSlide] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const scrollNext = useCallback(() => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const cardWidth = container.firstElementChild
      ? (container.firstElementChild as HTMLElement).offsetWidth + 16
      : 280;

    if (
      container.scrollLeft + container.clientWidth >=
      container.scrollWidth - 10
    ) {
      container.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      container.scrollBy({ left: cardWidth, behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    if (autoSlide && doctors.length > 1) {
      intervalRef.current = setInterval(scrollNext, 4000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoSlide, doctors.length, scrollNext]);

  const handleMouseEnter = () => setAutoSlide(false);
  const handleMouseLeave = () => setAutoSlide(true);

  if (doctors.length === 0) return null;

  // Color palette for doctor cards
  const colors = [
    { bg: "bg-sky-500/10", border: "border-sky-500/20", text: "text-sky-400", glow: "bg-sky-500/5", accent: "bg-sky-500" },
    { bg: "bg-violet-500/10", border: "border-violet-500/20", text: "text-violet-400", glow: "bg-violet-500/5", accent: "bg-violet-500" },
    { bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-400", glow: "bg-emerald-500/5", accent: "bg-emerald-500" },
    { bg: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-400", glow: "bg-amber-500/5", accent: "bg-amber-500" },
    { bg: "bg-rose-500/10", border: "border-rose-500/20", text: "text-rose-400", glow: "bg-rose-500/5", accent: "bg-rose-500" },
  ];

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold tracking-tight">
            Connect with Specialists
          </h3>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Find the right doctor for your recovery
          </p>
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={() => {
              if (!scrollRef.current) return;
              const cardWidth = scrollRef.current.firstElementChild
                ? (scrollRef.current.firstElementChild as HTMLElement).offsetWidth + 16
                : 280;
              scrollRef.current.scrollBy({ left: -cardWidth, behavior: "smooth" });
            }}
            className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">chevron_left</span>
          </button>
          <button
            onClick={scrollNext}
            className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">chevron_right</span>
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {doctors.map((doc, i) => {
          const c = colors[i % colors.length];
          const isConnected = connectedDoctorCode === doc.doctorCode;

          return (
            <div
              key={doc.doctorCode}
              className={`snap-start shrink-0 w-[260px] sm:w-[280px] rounded-2xl border ${c.border} ${c.bg} p-5 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300`}
            >
              {/* Glow accent */}
              <div className={`absolute -top-8 -right-8 w-24 h-24 ${c.glow} rounded-full blur-2xl group-hover:w-32 group-hover:h-32 transition-all`}></div>

              <div className="relative z-10 space-y-3">
                {/* Avatar + Name */}
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-full ${c.accent}/20 flex items-center justify-center`}>
                    <span className={`material-symbols-outlined ${c.text} text-xl`} style={{ fontVariationSettings: "'FILL' 1" }}>
                      stethoscope
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-on-surface truncate">{doc.name}</p>
                    <p className={`text-[11px] ${c.text} font-medium`}>{doc.designation}</p>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <span className="material-symbols-outlined text-xs">call</span>
                    <span className="text-xs">{doc.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <span className="material-symbols-outlined text-xs">pin</span>
                    <span className="text-xs font-mono tracking-wider">{doc.doctorCode}</span>
                  </div>
                </div>

                {/* Connect Button */}
                {isConnected ? (
                  <div className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    Connected
                  </div>
                ) : (
                  <button
                    onClick={() => onConnect(doc.doctorCode)}
                    className={`w-full py-2 rounded-lg border ${c.border} ${c.text} text-xs font-semibold hover:bg-white/5 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5`}
                  >
                    <span className="material-symbols-outlined text-sm">link</span>
                    Connect
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
