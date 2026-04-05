"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  registerUser,
  loginUser,
  loginWithDoctorCode,
  getCurrentUser,
} from "../lib/auth";

export default function LoginPage() {
  const [role, setRole] = useState<"patient" | "doctor">("patient");
  const [isLogin, setIsLogin] = useState(true);
  const [loginMethod, setLoginMethod] = useState<"email" | "code">("email");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [designation, setDesignation] = useState("");
  const [doctorCode, setDoctorCode] = useState("");

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

  // Clear errors when switching modes or roles
  useEffect(() => {
    setError("");
    setSuccess("");
  }, [isLogin, role, loginMethod]);

  // Reset login method when switching roles
  useEffect(() => {
    setLoginMethod("email");
    setDoctorCode("");
  }, [role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    // Small delay to show loading state
    await new Promise((r) => setTimeout(r, 400));

    if (isLogin) {
      // ---- LOGIN ----
      let result;

      if (role === "doctor" && loginMethod === "code") {
        // Login via Doctor Code
        if (doctorCode.length !== 6) {
          setError("Doctor Code must be exactly 6 digits.");
          setIsLoading(false);
          return;
        }
        result = loginWithDoctorCode(doctorCode, password);
      } else {
        // Login via Email
        result = loginUser(email, password);
      }

      if (!result.success) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      setSuccess(`Welcome back, ${result.user.name}!`);
      await new Promise((r) => setTimeout(r, 600));

      if (result.user.role === "doctor") {
        router.push("/dashboard");
      } else {
        router.push("/patient");
      }
    } else {
      // ---- SIGNUP ----
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
      await new Promise((r) => setTimeout(r, 600));

      if (result.user.role === "doctor") {
        router.push("/dashboard");
      } else {
        router.push("/patient");
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden p-6">
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
            Smart Rehab
          </h1>
          <p className="text-sm text-on-surface-variant">
            {isLogin
              ? "Welcome back to your recovery journey"
              : "Start your path to recovery today"}
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

        {/* Doctor Login Method Toggle (shown only for doctor login) */}
        {isLogin && role === "doctor" && (
          <div className="flex bg-surface-container rounded-lg p-1 mb-6 gap-1">
            <button
              type="button"
              onClick={() => setLoginMethod("email")}
              className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                loginMethod === "email"
                  ? "bg-red-500/15 text-red-400 border border-red-500/30"
                  : "text-on-surface-variant hover:bg-white/5"
              }`}
            >
              <span className="material-symbols-outlined text-sm">mail</span>
              Email Login
            </button>
            <button
              type="button"
              onClick={() => setLoginMethod("code")}
              className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                loginMethod === "code"
                  ? "bg-red-500/15 text-red-400 border border-red-500/30"
                  : "text-on-surface-variant hover:bg-white/5"
              }`}
            >
              <span className="material-symbols-outlined text-sm">pin</span>
              Doctor Code
            </button>
          </div>
        )}

        {/* Error Toast */}
        {error && (
          <div className="mb-5 flex items-center gap-3 p-3.5 rounded-xl bg-error-container/30 border border-error/30 animate-[shake_0.3s_ease-in-out]">
            <span className="material-symbols-outlined text-error text-xl shrink-0">
              error
            </span>
            <p className="text-sm text-on-error-container font-medium">
              {error}
            </p>
          </div>
        )}

        {/* Success Toast */}
        {success && (
          <div className="mb-5 flex items-center gap-3 p-3.5 rounded-xl bg-primary/10 border border-primary/30">
            <span className="material-symbols-outlined text-primary text-xl shrink-0">
              check_circle
            </span>
            <p className="text-sm text-primary font-medium">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name (signup only) */}
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
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={
                    role === "doctor" ? "Dr. Jane Doe" : "John Doe"
                  }
                  className="w-full bg-surface/50 border border-outline-variant rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all text-on-surface"
                />
              </div>
            </div>
          )}

          {/* Designation (doctor signup only) */}
          {!isLogin && role === "doctor" && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider ml-1">
                Designation / Title
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
                  placeholder="Chief of Orthopedics"
                  className="w-full bg-surface/50 border border-outline-variant rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500/50 transition-all text-on-surface"
                />
              </div>
            </div>
          )}

          {/* Doctor Code (doctor login with code method) */}
          {isLogin && role === "doctor" && loginMethod === "code" ? (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider ml-1">
                Doctor Code
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-400 transition-colors text-sm">
                  pin
                </span>
                <input
                  type="text"
                  required
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  value={doctorCode}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    if (val.length <= 6) setDoctorCode(val);
                  }}
                  placeholder="Enter 6-digit code"
                  className="w-full bg-surface/50 border border-outline-variant rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500/50 transition-all text-on-surface tracking-[0.35em] font-mono text-base"
                />
              </div>
              <p className="text-[11px] text-on-surface-variant ml-1">
                Enter the 6-digit code shared by your clinic
              </p>
            </div>
          ) : (
            /* Email (all other cases) */
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
          )}

          {/* Password */}
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
            {!isLogin && (
              <p className="text-[11px] text-on-surface-variant ml-1 mt-1">
                Must be at least 6 characters
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 bg-primary text-on-primary py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-fixed hover:-translate-y-0.5 transition-all shadow-[0_0_20px_rgba(125,211,252,0.3)] disabled:opacity-60 disabled:pointer-events-none cursor-pointer"
          >
            {isLoading ? (
              <>
                <span className="material-symbols-outlined text-sm animate-spin">
                  progress_activity
                </span>
                {isLogin ? "Signing in..." : "Creating account..."}
              </>
            ) : (
              <>
                {isLogin ? "Sign In" : "Create Account"}
                <span className="material-symbols-outlined text-sm">
                  arrow_forward
                </span>
              </>
            )}
          </button>
        </form>

        {/* Toggle Login/Signup */}
        <div className="mt-8 text-center text-sm text-on-surface-variant">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setFullName("");
              setDesignation("");
              setDoctorCode("");
              setError("");
              setSuccess("");
              setLoginMethod("email");
            }}
            className="text-primary font-semibold hover:underline cursor-pointer"
          >
            {isLogin ? "Sign up" : "Log in"}
          </button>
        </div>

        {/* Back to Home */}
        <div className="mt-4 text-center">
          <Link
            href="/"
            className="text-xs text-on-surface-variant hover:text-primary transition-colors inline-flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">
              arrow_back
            </span>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
