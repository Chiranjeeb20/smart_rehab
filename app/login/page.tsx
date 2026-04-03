"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [role, setRole] = useState<"patient" | "doctor">("patient");
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login redirect based on role
    if (role === "doctor") {
      router.push("/dashboard");
    } else {
      router.push("/patient");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden p-6">
      {/* Background ambient light effects */}
      <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[120px] pointer-events-none transition-colors duration-700 ${role === "doctor" ? "bg-red-500/20" : "bg-primary/20"}`}></div>
      <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-[120px] pointer-events-none transition-colors duration-700 ${role === "doctor" ? "bg-rose-500/20" : "bg-tertiary/20"}`}></div>

      <div className={`glass-elevated w-full max-w-md p-8 rounded-3xl relative z-10 transition-shadow duration-700 ${role === 'doctor' ? 'shadow-[0_0_50px_rgba(244,63,94,0.15)]' : 'shadow-[0_0_50px_rgba(125,211,252,0.1)]'}`}>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-on-surface tracking-tight mb-2">
            Smart Rehab
          </h1>
          <p className="text-sm text-on-surface-variant">
            {isLogin ? "Welcome back to your recovery journey" : "Start your path to recovery today"}
          </p>
        </div>

        {/* Role Selection Toggle */}
        <div className="flex bg-surface-container-high rounded-full p-1 mb-8 relative">
          <div
            className={`absolute top-1 bottom-1 w-[calc(50%-0.25rem)] rounded-full border transition-all duration-300 ease-out ${
              role === "patient" 
                ? "left-1 bg-primary/20 border-primary/30" 
                : "left-[calc(50%+0.125rem)] bg-red-500/20 border-red-500/30"
            }`}
          ></div>
          <button
            type="button"
            onClick={() => setRole("patient")}
            className={`flex-1 py-2 text-sm font-semibold relative z-10 transition-colors cursor-pointer ${
              role === "patient" ? "text-primary" : "text-on-surface-variant"
            }`}
          >
            Patient
          </button>
          <button
            type="button"
            onClick={() => setRole("doctor")}
            className={`flex-1 py-2 text-sm font-semibold relative z-10 transition-colors cursor-pointer ${
              role === "doctor" ? "text-red-400" : "text-on-surface-variant"
            }`}
          >
            Doctor
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider ml-1">
                Full Name
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors text-sm">
                  person
                </span>
                <input
                  type="text"
                  required
                  placeholder={role === "doctor" ? "Dr. Jane Doe" : "John Doe"}
                  className="w-full bg-surface/50 border border-outline-variant rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all text-on-surface"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider ml-1">
              Email Address
            </label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors text-sm">
                mail
              </span>
              <input
                type="email"
                required
                placeholder="hello@example.com"
                className="w-full bg-surface/50 border border-outline-variant rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all text-on-surface"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center ml-1">
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                Password
              </label>
              {isLogin && (
                <a href="#" className="text-xs text-primary hover:underline">
                  Forgot?
                </a>
              )}
            </div>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors text-sm">
                lock
              </span>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full bg-surface/50 border border-outline-variant rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all text-on-surface"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-primary text-on-primary py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-fixed hover:-translate-y-0.5 transition-all shadow-[0_0_20px_rgba(125,211,252,0.3)]"
          >
            {isLogin ? "Sign In" : "Create Account"}
            <span className="material-symbols-outlined text-sm">
              arrow_forward
            </span>
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-on-surface-variant">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary font-semibold hover:underline"
          >
            {isLogin ? "Sign up" : "Log in"}
          </button>
        </div>
      </div>
    </div>
  );
}
