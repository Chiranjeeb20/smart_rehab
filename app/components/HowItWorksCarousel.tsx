"use client";

import { useState, useEffect } from "react";

const slides = [
  {
    id: 1,
    icon: "event_note",
    title: "Therapy Plan Received",
    subtitle: "New routine unlocked",
    colorClass: "text-primary",
    borderClass: "border-l-primary"
  },
  {
    id: 2,
    icon: "photo_camera_front",
    title: "Perfect Form",
    subtitle: "Hold for 3 seconds...",
    colorClass: "text-tertiary",
    borderClass: "border-l-tertiary"
  },
  {
    id: 3,
    icon: "monitoring",
    title: "Analytics Synced",
    subtitle: "Doctor review pending",
    colorClass: "text-on-surface",
    borderClass: "border-l-surface-bright"
  }
];

export default function HowItWorksCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="lg:w-1/2 w-full">
      <div className="glass-panel p-2 rounded-3xl border border-white/10 shadow-2xl relative group overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-50 rounded-3xl z-0"></div>
        
        {/* Slides Container */}
        <div className="bg-surface-container-highest rounded-2xl aspect-video overflow-hidden relative flex items-center justify-center z-10 w-full overflow-hidden">
          
          {slides.map((slide, index) => (
            <div 
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 flex flex-col items-center justify-center ${index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
            >
              <span className={`material-symbols-outlined text-8xl ${slide.colorClass} opacity-20`}>
                {slide.icon}
              </span>
              
              <div className="absolute inset-x-8 bottom-8 h-32 bg-gradient-to-t from-background to-transparent flex items-end">
                <div className={`glass-panel p-4 rounded-xl flex items-center gap-4 w-full mx-4 mb-4 border-l-4 ${slide.borderClass} transform transition-transform duration-700 ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                  <span className={`material-symbols-outlined ${slide.colorClass}`}>
                    {index === 1 ? 'task_alt' : (index === 0 ? 'download' : 'cloud_sync')}
                  </span>
                  <div>
                    <p className="text-sm font-bold">{slide.title}</p>
                    <p className="text-xs text-on-surface-variant">{slide.subtitle}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}

        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${index === currentSlide ? 'w-6 bg-primary' : 'w-2 bg-white/20'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
