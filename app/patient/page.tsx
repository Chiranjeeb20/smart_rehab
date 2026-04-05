"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getCurrentUser,
  logoutUser,
  getGreeting,
  isConnectedToDoctor,
  getConnectedDoctorInfo,
  getAllDoctors,
  connectToDoctor,
  disconnectFromDoctor,
  type DoctorInfo,
} from "../lib/auth";
import BottomNav from "../components/BottomNav";
import SpecialistSlider from "../components/SpecialistSlider";
import ConditionAssessment from "../components/ConditionAssessment";
import { DUMMY_EXERCISES } from "../lib/exercises";

// =============================================================================
// Patient Home Page — Conditional UI based on doctor connection status
// =============================================================================

export default function PatientHomePage() {
  const [patientName, setPatientName] = useState("");
  const [greeting, setGreeting] = useState("Good Morning");
  const [connected, setConnected] = useState(false);
  const [connectedDoctor, setConnectedDoctor] = useState<DoctorInfo | null>(null);
  const [doctors, setDoctors] = useState<DoctorInfo[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showAssessment, setShowAssessment] = useState(false);
  const [assignedRoutine, setAssignedRoutine] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false);

  // Connect dialog
  const [showConnectDialog, setShowConnectDialog] = useState(false);
  const [connectCode, setConnectCode] = useState("");
  const [connectError, setConnectError] = useState("");
  const [connectSuccess, setConnectSuccess] = useState("");

  const router = useRouter();

  useEffect(() => {
    const session = getCurrentUser();
    if (!session || session.role !== "patient") {
      router.replace("/login");
      return;
    }
    const firstName = session.name.split(" ")[0];
    setPatientName(firstName);
    setGreeting(getGreeting());
    const isConn = isConnectedToDoctor();
    setConnected(isConn);
    setConnectedDoctor(getConnectedDoctorInfo());
    setDoctors(getAllDoctors());
    
    setProfile(session.patientProfile);
    if (isConn && !session.patientProfile) {
      setShowAssessment(true);
    }

    if (session.assignedExercises) {
      const routine = DUMMY_EXERCISES.filter(ex => session.assignedExercises?.includes(ex.id));
      setAssignedRoutine(routine);
    }

    setIsLoaded(true);
  }, [router]);

  const handleLogout = () => {
    logoutUser();
    router.push("/login");
  };

  const handleConnect = (doctorCode: string) => {
    const result = connectToDoctor(doctorCode);
    if (result.success) {
      setConnected(true);
      setConnectedDoctor(getConnectedDoctorInfo());
      const session = getCurrentUser();
      if (session && !session.patientProfile) {
        setShowAssessment(true);
      }
      if (session?.assignedExercises) {
        setAssignedRoutine(DUMMY_EXERCISES.filter(ex => session.assignedExercises?.includes(ex.id)));
      }
      setShowConnectDialog(false);
      setConnectCode("");
    }
  };

  const handleConnectSubmit = () => {
    setConnectError("");
    setConnectSuccess("");
    if (connectCode.length !== 6) {
      setConnectError("Please enter a valid 6-digit doctor code.");
      return;
    }
    const result = connectToDoctor(connectCode);
    if (!result.success) {
      setConnectError(result.error || "Failed to connect.");
    } else {
      setConnectSuccess(`Connected to ${result.doctorName}!`);
      setConnected(true);
      setConnectedDoctor(getConnectedDoctorInfo());
      const session = getCurrentUser();
      if (session && !session.patientProfile) {
        setShowAssessment(true);
      }
      
      const updatedSession = getCurrentUser();
      const info = getConnectedDoctorInfo();
      if (info) {
        setConnectedDoctor(info);
      }
      if (updatedSession?.assignedExercises) {
        setAssignedRoutine(DUMMY_EXERCISES.filter(ex => updatedSession.assignedExercises?.includes(ex.id)));
      }
      setTimeout(() => {
        setShowConnectDialog(false);
        setConnectCode("");
        setConnectSuccess("");
      }, 1200);
    }
  };

  const handleDisconnect = () => {
    disconnectFromDoctor();
    setConnected(false);
    setConnectedDoctor(null);
    setAssignedRoutine([]);
    setShowDisconnectConfirm(false);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="material-symbols-outlined text-primary text-4xl animate-spin">
          progress_activity
        </span>
      </div>
    );
  }

  return (
    <>
      {showAssessment && (
        <ConditionAssessment 
          onComplete={() => {
            setShowAssessment(false);
            const session = getCurrentUser();
            if (session?.assignedExercises) {
               setAssignedRoutine(DUMMY_EXERCISES.filter(ex => session.assignedExercises?.includes(ex.id)));
               setProfile(session.patientProfile);
            }
          }}
          onClose={() => setShowAssessment(false)}
        />
      )}
      {/* ===== HEADER ===== */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl px-6 py-5 border-b border-white/5">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <h1 className="text-on-surface-variant text-sm font-medium tracking-wide uppercase">
                {greeting}, {patientName}.
              </h1>
              {/* Status Badge */}
              {connected ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Under Doctor Care
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  Not Connected
                </span>
              )}
              {connected && (
                <button 
                  onClick={() => setShowDisconnectConfirm(true)}
                  className="text-[10px] font-bold text-rose-400 hover:text-rose-500 hover:underline px-2 py-0.5 rounded cursor-pointer transition-colors"
                >
                  Disconnect
                </button>
              )}
            </div>
            <p className="text-2xl font-bold text-on-surface">
              Let&apos;s start your recovery.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-error/10 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">logout</span>
            </button>
            <div className="relative">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary/30 to-tertiary/30 flex items-center justify-center">
                <span className="text-sm font-bold text-on-surface">
                  {patientName.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${connected ? "bg-emerald-400" : "bg-amber-400"}`}></span>
            </div>
          </div>
        </div>
      </header>

      <main className="px-6 space-y-8 pb-28 pt-4">



        {/* ===== CONDITIONAL CONTENT ===== */}
        {!connected ? (
          /* ============================================================= */
          /* NEW USER — NOT CONNECTED TO DOCTOR                             */
          /* ============================================================= */
          <>
            {/* Onboarding Section */}
            <section className="glass-elevated rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-tertiary/5 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
                  <h3 className="text-lg font-bold text-on-surface">Let&apos;s set up your recovery journey</h3>
                </div>
                <p className="text-sm text-on-surface-variant mb-5">Complete these steps to get started with AI-guided therapy.</p>

                <div className="space-y-3">
                  {/* Step 1 */}
                  <div className="flex items-center gap-4 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-white text-base" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-on-surface">Complete Profile</p>
                      <p className="text-xs text-on-surface-variant">Account created successfully</p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Done</span>
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-center gap-4 p-3 rounded-xl bg-primary/5 border border-primary/15">
                    <div className="w-8 h-8 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-primary">2</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-on-surface">Connect to Doctor</p>
                      <p className="text-xs text-on-surface-variant">Enter your doctor&apos;s 6-digit code</p>
                    </div>
                    <button
                      onClick={() => setShowConnectDialog(true)}
                      className="text-[10px] font-bold text-primary uppercase tracking-wider hover:underline cursor-pointer"
                    >
                      Start
                    </button>
                  </div>

                  {/* Step 3 */}
                  <div className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/5 opacity-50">
                    <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-on-surface-variant">3</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-on-surface-variant">Start First Exercise</p>
                      <p className="text-xs text-on-surface-variant">Begin your AI-guided recovery</p>
                    </div>
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Locked</span>
                  </div>
                </div>
              </div>
            </section>

            {/* CTAs */}
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => setShowConnectDialog(true)}
                className="glass-elevated p-5 rounded-2xl flex items-center gap-4 hover:-translate-y-0.5 transition-all group cursor-pointer active:scale-[0.98] border border-primary/20"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>person_add</span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-on-surface">Connect to Doctor</p>
                  <p className="text-xs text-on-surface-variant">Enter a 6-digit doctor code</p>
                </div>
                <span className="material-symbols-outlined text-primary ml-auto">arrow_forward</span>
              </button>

              <button 
                onClick={() => setShowAssessment(true)}
                className="glass-elevated p-5 rounded-2xl flex items-center gap-4 hover:-translate-y-0.5 transition-all group cursor-pointer active:scale-[0.98] border border-tertiary/20"
              >
                <div className="w-12 h-12 rounded-2xl bg-tertiary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-tertiary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-on-surface">AI Guided Therapy</p>
                  <p className="text-xs text-on-surface-variant">Start without a doctor</p>
                </div>
                <span className="material-symbols-outlined text-tertiary ml-auto">arrow_forward</span>
              </button>
            </section>

            {/* Empty Tasks State */}
            <section className="glass-card rounded-2xl p-8 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-surface-container-highest/50 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-on-surface-variant text-3xl">assignment</span>
              </div>
              <h4 className="font-bold text-on-surface mb-1">No tasks assigned yet</h4>
              <p className="text-sm text-on-surface-variant max-w-xs">
                Connect with a doctor to receive your personalized exercise plan, or try AI Guided Therapy.
              </p>
            </section>
          </>
        ) : (
          /* ============================================================= */
          /* EXISTING USER — CONNECTED TO DOCTOR                            */
          /* ============================================================= */
          <>
            {/* Connected Doctor Banner */}
            {connectedDoctor && (
              <section className="glass-card rounded-2xl p-4 flex items-center gap-4 border border-emerald-500/15">
                <div className="w-11 h-11 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-emerald-400 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>stethoscope</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">Your Doctor</p>
                  <p className="text-sm font-bold text-on-surface truncate">{connectedDoctor.name}</p>
                  <p className="text-[11px] text-on-surface-variant">{connectedDoctor.designation}</p>
                </div>
                <button className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20 transition-all cursor-pointer">
                  Message
                </button>
              </section>
            )}

            <section className="space-y-3">
              <h3 className="text-lg font-bold tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>target</span>
                Today&apos;s Focus
                {profile?.recommendedSpecialist && <span className="text-[10px] font-black uppercase text-sky-400 bg-sky-400/10 px-2 py-0.5 rounded-full ml-1 border border-sky-400/20">{profile.recommendedSpecialist}</span>}
              </h3>
              {profile && !connected && (
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mb-4">
                     Treatment Protocol: {profile.condition} Rehab ({profile.severity})
                  </p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {assignedRoutine.length > 0 ? (
                  assignedRoutine.slice(0, 2).map((ex) => (
                    <div 
                      key={ex.id} 
                      onClick={() => router.push("/patient/exercises")}
                      className="glass-elevated p-4 rounded-xl flex items-center gap-4 group hover:-translate-y-0.5 transition-all cursor-pointer active:scale-[0.98]"
                    >
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${
                        ex.type === "warm-up" ? "bg-amber-500/10 text-amber-400" : "bg-primary/20 text-primary"
                      }`}>
                        <span className="material-symbols-outlined text-2xl">
                          {ex.type === "warm-up" ? "mode_fan" : "fitness_center"}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-on-surface text-sm">{ex.name}</p>
                        <p className="text-xs text-on-surface-variant capitalize">{ex.sets} sets • {ex.reps} reps • {ex.type}</p>
                      </div>
                      <div className="w-8 h-8 rounded-full border-2 border-primary/40 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-all">
                        <span className="material-symbols-outlined text-lg">play_arrow</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 p-4">Loading your AI routine...</p>
                )}
              </div>
            </section>

            {/* Progress Snapshot + Next Session */}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Daily Completion */}
              <div className="glass-card p-5 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-20 h-20 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors"></div>
                <div className="relative z-10">
                  <p className="text-xs text-on-surface-variant font-medium uppercase tracking-wider mb-3">Daily Completion</p>
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <circle className="stroke-surface-container-highest" cx="18" cy="18" fill="none" r="15.915" strokeWidth="3"></circle>
                        <circle className="stroke-primary" cx="18" cy="18" fill="none" r="15.915" strokeDasharray="65 100" strokeLinecap="round" strokeWidth="3"></circle>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold text-primary">65%</span>
                      </div>
                    </div>
                    <div className="text-xs space-y-1 text-on-surface-variant">
                      <p>4 of 6 done</p>
                      <p>2 remaining</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Streak */}
              <div className="glass-card p-5 rounded-2xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-tertiary-container flex items-center justify-center text-tertiary shrink-0">
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">Streak</p>
                  <p className="text-2xl font-bold text-on-surface">12 <span className="text-sm font-medium text-on-surface-variant">Days</span></p>
                </div>
              </div>

              {/* Next Session */}
              <div className="glass-card p-5 rounded-2xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary-container flex items-center justify-center text-secondary shrink-0">
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>calendar_month</span>
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">Next Session</p>
                  <p className="text-sm font-bold text-on-surface">Today, 2:00 PM</p>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                   <h3 className="text-lg font-bold tracking-tight">Clinical Treatment Plan</h3>
                   <p className="text-xs text-slate-500 italic">"Your plan is tailored based on your condition"</p>
                </div>
                <button 
                  onClick={() => router.push("/patient/exercises")}
                  className="text-primary text-xs font-semibold px-2 py-1 hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
                >
                   Exercise HUB
                </button>
              </div>
              <div className="space-y-3">
                {assignedRoutine.map((ex) => (
                  <div 
                    key={ex.id}
                    onClick={() => router.push("/patient/exercises")}
                    className="glass-elevated p-4 rounded-2xl flex items-center gap-4 group cursor-pointer active:scale-[0.98] transition-all border border-white/5 hover:border-sky-500/10 bg-slate-900/40"
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      ex.type === "warm-up" ? "bg-amber-500/15 text-amber-500" : ex.type === "cool-down" ? "bg-emerald-500/15 text-emerald-500" : "bg-sky-500/15 text-sky-400"
                    }`}>
                      <span className="material-symbols-outlined text-xl">
                        {ex.type === "warm-up" ? "mode_fan" : ex.type === "cool-down" ? "eco" : "health_and_safety"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                         <p className="font-bold text-on-surface text-sm">{ex.name}</p>
                         <span className="text-[8px] font-black uppercase text-slate-500 px-1.5 py-0.5 bg-slate-800 rounded">{ex.specialist.split(' ')[0]}</span>
                      </div>
                      <p className="text-[10px] text-on-surface-variant mt-0.5">{ex.sets} sets • {ex.reps} {ex.reps === 1 ? 'hold' : 'reps'} • <span className="capitalize">{ex.type}</span></p>
                    </div>
                    <div className="w-8 h-8 rounded-full border-2 border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary group-hover:scale-110 transition-all">
                      <span className="material-symbols-outlined text-lg">play_arrow</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* ===== SPECIALIST SLIDER (always shown) ===== */}
        <SpecialistSlider
          doctors={doctors}
          onConnect={handleConnect}
          connectedDoctorCode={connectedDoctor?.doctorCode}
        />

        {/* ===== AI INSIGHTS ===== */}
        <section className="space-y-3">
          <h3 className="text-lg font-bold tracking-tight flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            AI Insights
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="glass-card p-4 rounded-xl flex items-start gap-3 border border-emerald-500/10">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-emerald-400 text-lg">trending_up</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-on-surface">Posture improved by 12%</p>
                <p className="text-xs text-on-surface-variant mt-0.5">Your form accuracy has been consistently improving over the past week.</p>
              </div>
            </div>

            <div className="glass-card p-4 rounded-xl flex items-start gap-3 border border-amber-500/10">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-amber-400 text-lg">warning</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-on-surface">You missed yesterday&apos;s session</p>
                <p className="text-xs text-on-surface-variant mt-0.5">Try to stay consistent — your recovery rate is 2x faster with daily sessions.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== TIPS ===== */}
        <section className="space-y-3">
          <h3 className="text-lg font-bold tracking-tight flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
            Recovery Tips
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="glass-card px-4 py-3.5 rounded-xl flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-xl">straighten</span>
              <p className="text-xs font-medium text-on-surface">Maintain proper posture throughout exercises</p>
            </div>
            <div className="glass-card px-4 py-3.5 rounded-xl flex items-center gap-3">
              <span className="material-symbols-outlined text-tertiary text-xl">local_fire_department</span>
              <p className="text-xs font-medium text-on-surface">Warm up 5 minutes before each session</p>
            </div>
            <div className="glass-card px-4 py-3.5 rounded-xl flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary text-xl">water_drop</span>
              <p className="text-xs font-medium text-on-surface">Stay hydrated — drink water between sets</p>
            </div>
          </div>
        </section>
      </main>

      {/* ===== BOTTOM NAV ===== */}
      <BottomNav />

      {/* ===== CONNECT DIALOG (Modal) ===== */}
      {showConnectDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm" onClick={() => setShowConnectDialog(false)}>
          <div
            className="glass-elevated w-full max-w-sm p-6 rounded-3xl shadow-[0_0_60px_rgba(125,211,252,0.1)] animate-[fadeIn_0.2s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center mx-auto mb-3">
                <span className="material-symbols-outlined text-primary text-3xl">link</span>
              </div>
              <h3 className="text-xl font-bold text-on-surface">Connect to Doctor</h3>
              <p className="text-sm text-on-surface-variant mt-1">Enter the 6-digit code shared by your doctor</p>
            </div>

            {connectError && (
              <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-error-container/30 border border-error/30">
                <span className="material-symbols-outlined text-error text-lg">error</span>
                <p className="text-xs text-on-error-container font-medium">{connectError}</p>
              </div>
            )}

            {connectSuccess && (
              <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                <span className="material-symbols-outlined text-emerald-400 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <p className="text-xs text-emerald-400 font-medium">{connectSuccess}</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors text-sm">
                  pin
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  value={connectCode}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    if (val.length <= 6) setConnectCode(val);
                    setConnectError("");
                  }}
                  placeholder="000000"
                  className="w-full bg-surface/50 border border-outline-variant rounded-xl py-3.5 pl-11 pr-4 text-center text-xl font-mono tracking-[0.4em] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all text-on-surface"
                />
              </div>

              <button
                onClick={handleConnectSubmit}
                disabled={connectCode.length !== 6}
                className="w-full py-3 bg-primary text-on-primary rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-fixed transition-all shadow-[0_0_20px_rgba(125,211,252,0.25)] disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
              >
                Connect
                <span className="material-symbols-outlined text-sm">link</span>
              </button>

              <button
                onClick={() => {
                  setShowConnectDialog(false);
                  setConnectCode("");
                  setConnectError("");
                  setConnectSuccess("");
                }}
                className="w-full py-2.5 text-sm text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Disconnect Confirmation Modal */}
      {showDisconnectConfirm && (
        <div className="fixed inset-0 z-[200] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6">
          <div className="glass-card w-full max-w-sm p-8 rounded-3xl border border-rose-500/20 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 mx-auto">
              <span className="material-symbols-outlined text-3xl">link_off</span>
            </div>
            <div>
               <h3 className="text-xl font-bold">Disconnect from Doctor?</h3>
               <p className="text-sm text-slate-400 mt-2">This will clear your current AI treatment plan and routine.</p>
            </div>
            <div className="flex gap-4">
               <button onClick={() => setShowDisconnectConfirm(false)} className="flex-1 py-3 bg-white/5 rounded-xl font-bold">Keep Connection</button>
               <button onClick={handleDisconnect} className="flex-1 py-3 bg-rose-500 text-white rounded-xl font-bold shadow-lg shadow-rose-500/20">Disconnect</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
