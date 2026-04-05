"use client";
import { useRouter, usePathname } from "next/navigation";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { label: "Home", icon: "home", path: "/patient" },
    { label: "Exercises", icon: "fitness_center", path: "/patient/exercises" },
    { label: "Progress", icon: "trending_up", path: "/patient/progress" }, // Future
    { label: "Chat", icon: "chat", path: "/patient/chat" }, // Future
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pt-3 pb-8 bg-slate-900/75 backdrop-blur-2xl border-t border-sky-300/15 shadow-[0_-4px_24px_rgba(0,0,0,0.4)] rounded-t-3xl">
      {navItems.map((item) => {
        const isActive = pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => router.push(item.path)}
            className={`flex flex-col items-center justify-center px-3 py-1 active:scale-90 transition-transform ${
              isActive 
                ? "text-sky-300 bg-sky-300/10 rounded-xl" 
                : "text-slate-400 hover:bg-white/5"
            }`}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : undefined }}>
              {item.icon}
            </span>
            <span className="font-inter text-[11px] font-medium mt-1">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
