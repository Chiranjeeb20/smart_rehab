"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  registerUser,
  getCurrentUser,
} from "../lib/auth";

export default function SignupPage() {
  const [role, setRole] = useState<"patient" | "doctor">("patient");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [designation, setDesignation] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  // If user is already logged in, redirect them
  useEffect(() => {
    const session = getCurrentUser();
    if (session) {
      if (session.role === "doctor") {
        router.replace("/dashboard");
      } else {
        router.replace("/patient");
      }
    }
  }, [router]);

  // Clear errors when switching roles
  useEffect(() => {
    setError("");
    setSuccess("");
  }, [role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    await new Promise((r) => setTimeout(r, 400));

    try {
      if (!fullName || !email || !password) {
        setError("Please fill in all required fields.");
        setIsLoading(false);
        return;
      }
      
      if (role === "doctor" && !designation) {
        setError("Please provide your medical designation.");
        setIsLoading(false);
        return;
      }

      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        setIsLoading(false);
        return;
      }

      const result = registerUser(fullName, email, password, role, designation);

      if (!result.success) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      setSuccess(`Account created! Welcome, ${result.user.name}!`);
      setTimeout(() => {
        window.location.href = result.user.role === "doctor" ? "/dashboard" : "/patient";
      }, 600);
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-y-auto py-12 px-6">
      {/* Background ambient light effects */}
      <div
        className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[120px] pointer-events-none transition-colors duration-700 ${role === "doctor" ? "bg-red-500/20" : "bg-primary/20"}`}
      ></div>
      <div
        className={`absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-[120px] pointer-events-none transition-colors duration-700 ${role === "doctor" ? "bg-rose-500/20" : "bg-tertiary/20"}`}
      ></div>

      <div
        className={`glass-elevated w-full max-w-md p-8 rounded-3xl relative z-10 transition-shadow duration-700 ${role === "doctor" ? "shadow-[0_0_50px_rgba(244,63,94,0.15)]" : "shadow-[0_0_50px_rgba(125,211,252,0.1)]"}`}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-primary text-3xl">
              ecg_heart
            </span>
          </div>
          <h1 className="text-3xl font-bold text-on-surface tracking-tight mb-2">
            Create Account
          </h1>
          <p className="text-sm text-on-surface-variant">
            Start your path to recovery today
          </p>
        </div>

        {/* Role Selection Toggle */}
        <div className="flex bg-surface-container-high rounded-full p-1 mb-6 relative">
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

        {/* Error Notification */}
        {error && (
          <div className="mb-6 flex items-start gap-3 p-4 rounded-2xl bg-red-500 border border-red-400 shadow-lg shadow-red-500/20 animate-[shake_0.3s_ease-in-out]">
            <span className="material-symbols-outlined text-white text-xl shrink-0 mt-0.5">
              report
            </span>
            <p className="text-sm text-white font-bold leading-tight">
              {error}
            </p>
          </div>
        )}

        {/* Success Notification */}
        {success && (
          <div className="mb-6 flex items-start gap-3 p-4 rounded-2xl bg-primary border border-primary-fixed shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-on-primary text-xl shrink-0 mt-0.5">
              check_circle
            </span>
            <p className="text-sm text-on-primary font-bold leading-tight">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
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
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={role === "doctor" ? "Dr. Jane Doe" : "John Doe"}
                className="w-full bg-surface/50 border border-outline-variant rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all text-on-surface"
              />
            </div>
          </div>

          {role === "doctor" && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider ml-1">
                Designation
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-400 transition-colors text-sm">
                  badge
                </span>
                <input
                  type="text"
                  required
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="e.g. Physiotherapist"
                  className="w-full bg-surface/50 border border-outline-variant rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500/50 transition-all text-on-surface"
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hello@example.com"
                className="w-full bg-surface/50 border border-outline-variant rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all text-on-surface"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider ml-1">
              Password
            </label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors text-sm">
                lock
              </span>
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-surface/50 border border-outline-variant rounded-xl py-3 pl-11 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all text-on-surface"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-on-surface transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 bg-primary text-on-primary py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-fixed hover:-translate-y-0.5 transition-all shadow-[0_0_20px_rgba(125,211,252,0.3)] disabled:opacity-60 disabled:pointer-events-none cursor-pointer"
          >
            {isLoading ? (
              <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
            ) : (
              <>
                Create Account
                <span className="material-symbols-outlined text-sm">person_add</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-on-surface-variant">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary font-bold hover:underline py-2 px-1 transition-all active:scale-95"
          >
            Log in
          </Link>
        </div>

        <div className="mt-4 text-center">
          <Link
            href="/"
            className="text-xs text-on-surface-variant hover:text-primary transition-colors inline-flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
