"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, getGreeting, logoutUser, logPerformance } from "../../lib/auth";
import { DUMMY_EXERCISES, Exercise } from "../../lib/exercises";
import BottomNav from "../../components/BottomNav";
import PoseTracker from "../../components/PoseTracker";

export default function ExercisesPage() {
  const [patientName, setPatientName] = useState("");
  const [greeting, setGreeting] = useState("Good Morning");
  const [filter, setFilter] = useState<"all" | "knee" | "shoulder" | "ankle">("all");
  const [exercises, setExercises] = useState<Exercise[]>(DUMMY_EXERCISES);
  const [assignedIds, setAssignedIds] = useState<string[]>([]);
  const [planType, setPlanType] = useState<"demo" | "ai" | "doctor">("demo");
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Player states
  const [selectedEx, setSelectedEx] = useState<Exercise | null>(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [activeStep, setActiveStep] = useState<"tutorial" | "workout" | "summary">("tutorial");
  
  // Real-time states from PoseTracker
  const [currentRep, setCurrentRep] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [aiMessage, setAiMessage] = useState("Align your body with the guides...");
  const [isAiCorrect, setIsAiCorrect] = useState(true);
  const [liveAccuracy, setLiveAccuracy] = useState(0);
  const [totalAccuracy, setTotalAccuracy] = useState(0);
  const [accuracyPoints, setAccuracyPoints] = useState<number[]>([]);

  const router = useRouter();

  useEffect(() => {
    const session = getCurrentUser();
    if (!session || session.role !== "patient") {
      router.replace("/login");
      return;
    }
    setGreeting(getGreeting());
    if (session.assignedExercises) {
      setAssignedIds(session.assignedExercises);
      setPlanType(session.planType || "demo");
      setUserProfile(session.patientProfile);
    }
    setIsLoaded(true);
  }, [router]);

  const filteredExercises = exercises.filter(
    (ex) => filter === "all" || ex.category === filter
  );

  const handleStartExercise = (ex: Exercise) => {
    setSelectedEx(ex);
    setShowPlayer(true);
    setActiveStep("tutorial");
    setCurrentRep(0);
    setCurrentSet(1);
    setLiveAccuracy(0);
    setTotalAccuracy(0);
    setAccuracyPoints([]);
    setAiMessage("Preparing camera...");
  };

  const handleRepDetected = () => {
    setCurrentRep((prev) => {
      if (!selectedEx) return prev;
      if (prev + 1 >= selectedEx.reps) {
        if (currentSet >= selectedEx.sets) {
          setActiveStep("summary");
          return 0;
        } else {
          setCurrentSet((s) => s + 1);
          return 0;
        }
      }
      return prev + 1;
    });
  };

  const handleFeedback = (msg: string, isCorrect: boolean) => {
    setAiMessage(msg);
    setIsAiCorrect(isCorrect);
  };

  const handleAccuracyUpdate = (score: number) => {
    setLiveAccuracy(score);
    setAccuracyPoints((prev) => [...prev, score]);
    const avg = accuracyPoints.length > 0 
      ? accuracyPoints.reduce((a, b) => a + b, 0) / accuracyPoints.length 
      : score;
    setTotalAccuracy(Math.round(avg));
  };

  const handleClosePlayer = () => {
    if (selectedEx) {
      logPerformance(selectedEx.id, totalAccuracy, true);
    }
    setShowPlayer(false);
    setSelectedEx(null);
    setActiveStep("tutorial");
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B1121]">
        <span className="material-symbols-outlined text-sky-400 text-4xl animate-spin">progress_activity</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1121] text-slate-100 font-inter pb-32">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-[#0B1121]/80 backdrop-blur-xl px-6 py-6 border-b border-white/5">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-slate-400 text-xs font-bold uppercase tracking-widest">{greeting}, {patientName}</h1>
            <p className="text-2xl font-black mt-1">Rehabilitation</p>
          </div>
          <button 
            onClick={() => { logoutUser(); router.push("/login"); }}
            className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all font-bold"
          >
            <span className="material-symbols-outlined">logout</span>
          </button>
        </div>

        {/* CONDITION FILTERS (Only show if no AI routine is assigned yet) */}
        {assignedIds.length === 0 && (
          <div className="flex gap-2 mt-6 overflow-x-auto pb-2 scrollbar-hide">
            {["all", "knee", "shoulder", "ankle"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat as any)}
                className={`px-4 py-2 rounded-full text-xs font-bold capitalize transition-all shrink-0 ${
                  filter === cat 
                    ? "bg-sky-500 text-white shadow-lg shadow-sky-500/20" 
                    : "bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10"
                }`}
              >
                {cat} Rehab
              </button>
            ))}
          </div>
        )}
      </header>

      {/* EXERCISE LIST */}
      <main className="px-6 py-8 space-y-6">
        <div className="mb-6 flex items-center justify-between">
           <div>
              <h2 className="text-sm font-black uppercase tracking-widest text-sky-400">
                {planType === "doctor" ? "Your Clinical Recovery Plan" : 
                 planType === "ai" ? "AI-Powered Therapy Plan" : 
                 "Explore Rehab Exercises"}
              </h2>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-tighter">
                {planType === "ai" ? `Smart movements for ${userProfile?.condition || 'your condition'} relief` : 
                 planType === "demo" ? "Select a therapy focus to begin your recovery" : ""}
              </p>
           </div>
           {planType !== "demo" && (
             <div className="px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30">
               <p className="text-[8px] font-black text-sky-400 uppercase">
                 {planType === "doctor" ? "Clinical" : "Smart AI"}
               </p>
             </div>
           )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {DUMMY_EXERCISES.filter(ex => 
             assignedIds.length > 0 
               ? assignedIds.includes(ex.id) 
               : (filter === "all" || ex.category === filter)
          ).map((ex) => (
            <div key={ex.id} className="glass-card group flex overflow-hidden rounded-2xl border border-white/5 bg-slate-900/40 hover:bg-slate-900/60 transition-all">
              {/* Illustration Area */}
              <div className="w-1/3 aspect-[4/5] bg-sky-500/5 flex items-center justify-center p-4">
                 <div className="w-full h-full rounded-xl bg-sky-500/10 flex items-center justify-center border border-sky-500/20">
                    <span className="material-symbols-outlined text-sky-400/50 text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                       {ex.category === "knee" ? "straighten" : ex.category === "ankle" ? "footprint" : "accessibility"}
                    </span>
                 </div>
              </div>

              {/* Data Area */}
              <div className="flex-1 p-5 flex flex-col justify-between">
                <div>
                   <h3 className="text-lg font-bold leading-tight">{ex.name}</h3>
                   <p className="text-[10px] font-black uppercase tracking-wider text-sky-400/80 mt-1">{ex.category} Therapy</p>
                   
                   <div className="flex items-center gap-3 mt-3 text-slate-400 text-xs">
                      <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-base">repeat</span>{ex.sets} × {ex.reps}</span>
                   </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                   <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${ex.status === "completed" ? "bg-emerald-400" : "bg-slate-500"}`} />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{ex.status.replace("-", " ")}</span>
                   </div>
                   <button 
                     onClick={() => handleStartExercise(ex)}
                     className="w-10 h-10 rounded-xl bg-sky-500 flex items-center justify-center text-white shadow-lg shadow-sky-500/20 active:scale-90 transition-transform cursor-pointer"
                   >
                     <span className="material-symbols-outlined">play_arrow</span>
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* PLAYER MODAL (with PoseTracker) */}
      {showPlayer && selectedEx && (
        <div className="fixed inset-0 z-[100] bg-[#0B1121] flex flex-col pt-safe animate-[fadeIn_0.3s_ease-out]">
          <div className="px-6 py-6 flex justify-between items-center border-b border-white/5">
             <button onClick={handleClosePlayer} className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors">
               <span className="material-symbols-outlined">close</span>
             </button>
             <div className="text-center">
                <h2 className="text-lg font-bold uppercase tracking-tight">{selectedEx.name}</h2>
                <div className="flex items-center justify-center gap-2 mt-0.5">
                   <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                   <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">AI Pose Tracking</span>
                </div>
             </div>
             <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-sky-400">
                {currentSet}/{selectedEx.sets}
             </div>
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col">
             {activeStep === "tutorial" && (
                <div className="px-6 py-8 space-y-8 flex-1 pb-20">
                   <div className="rounded-3xl overflow-hidden aspect-video bg-slate-900 border border-white/10 shadow-2xl relative">
                      <video className="w-full h-full object-cover opacity-70" src={selectedEx.video} autoPlay loop muted playsInline />
                      <div className="absolute inset-0 flex items-center justify-center">
                         <div className="text-center space-y-3 p-6 bg-slate-950/60 backdrop-blur-md rounded-2xl border border-white/10 max-w-[80%]">
                            <p className="text-xs font-bold uppercase tracking-widest text-sky-400">Preparation</p>
                            <p className="text-sm font-medium text-slate-200">Watch the demonstration. Ensure your full body is visible in the frame once you start.</p>
                         </div>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">Instructions</h3>
                      <div className="grid gap-3">
                        {selectedEx.instructions.map((inst, i) => (
                           <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 items-center">
                              <span className="w-6 h-6 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400 text-xs font-bold leading-none">{i+1}</span>
                              <p className="text-slate-300 text-xs font-semibold leading-relaxed">{inst}</p>
                           </div>
                        ))}
                      </div>
                   </div>

                   <button 
                     onClick={() => setActiveStep("workout")}
                     className="w-full py-4 bg-sky-500 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-sky-500/20 active:scale-[0.98] transition-transform flex items-center justify-center gap-2 cursor-pointer"
                   >
                     Initialize AI Tracker
                     <span className="material-symbols-outlined text-sm">rocket_launch</span>
                   </button>
                </div>
             )}

             {activeStep === "workout" && (
                <div className="px-6 py-8 space-y-8 flex-1 flex flex-col animate-[fadeIn_0.4s_ease-out]">
                   {/* REAL AI POSE TRACKER */}
                   <div className="rounded-3xl overflow-hidden flex-1 min-h-[300px] border-2 border-sky-400/20 relative shadow-2xl">
                      <PoseTracker 
                        exerciseType={selectedEx.poseConfig?.type || "flexion"}
                        onRep={handleRepDetected}
                        onFeedback={handleFeedback}
                        onAccuracy={handleAccuracyUpdate}
                      />
                      
                      {/* AI FEEDBACK POPUP */}
                      <div className={`absolute top-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full border-2 backdrop-blur-xl animate-[slideDown_0.3s_ease-out] shadow-2xl flex items-center gap-3 ${
                        isAiCorrect ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300" : "bg-rose-500/20 border-rose-500/50 text-rose-300"
                      }`}>
                         <span className="material-symbols-outlined text-xl">{isAiCorrect ? "check_circle" : "error"}</span>
                         <span className="text-xs font-black tracking-widest uppercase">{aiMessage}</span>
                      </div>

                      {/* Video Ref In-Picture */}
                      <div className="absolute bottom-6 right-6 w-24 aspect-video rounded-xl overflow-hidden border border-white/20 shadow-xl opacity-80 bg-slate-900">
                        <video className="w-full h-full object-cover" src={selectedEx.video} autoPlay loop muted playsInline />
                      </div>
                   </div>

                   {/* LIVE METRICS */}
                   <div className="grid grid-cols-2 gap-4">
                      <div className="glass-card p-4 rounded-3xl bg-slate-900/50 border border-white/5 text-center flex flex-col justify-center">
                         <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">Reps</p>
                         <p className="text-4xl font-black text-sky-400 tabular-nums">{currentRep}<span className="text-lg font-medium text-slate-600">/{selectedEx.reps}</span></p>
                      </div>
                      <div className="glass-card p-4 rounded-3xl bg-slate-900/50 border border-white/5 text-center flex flex-col justify-center">
                         <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">Live Accuracy</p>
                         <div className="flex items-center justify-center gap-1">
                            <p className="text-4xl font-black text-emerald-400 tabular-nums">{liveAccuracy}%</p>
                         </div>
                      </div>
                   </div>

                   <button 
                     onClick={() => setActiveStep("summary")}
                     className="w-full py-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold uppercase tracking-widest text-[10px] rounded-2xl hover:bg-rose-500/20 active:scale-95 transition-all cursor-pointer"
                   >
                      End Exercise Session
                   </button>
                </div>
             )}

             {activeStep === "summary" && (
                <div className="px-6 py-12 space-y-10 animate-[bounceIn_0.6s_ease-out] text-center flex-1">
                   <div className="relative inline-block mx-auto">
                      <div className="w-28 h-28 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-[0_0_50px_rgba(16,185,129,0.5)]">
                         <span className="material-symbols-outlined text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                      </div>
                      <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-sky-500 border-4 border-[#0B1121] flex items-center justify-center text-white text-sm font-bold shadow-xl">
                         <span className="material-symbols-outlined text-base">emoji_events</span>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <h3 className="text-3xl font-black tracking-tight">Well Done!</h3>
                      <p className="text-slate-400 text-sm font-medium">Your knee stability is showing significant progress.</p>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/5">
                         <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Total Accuracy</p>
                         <p className="text-3xl font-black text-emerald-400">{totalAccuracy}%</p>
                      </div>
                      <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/5">
                         <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Completion</p>
                         <p className="text-3xl font-black text-sky-400">100%</p>
                      </div>
                   </div>

                   <div className="p-6 rounded-3xl bg-amber-500/5 border border-amber-500/20 text-left space-y-3">
                      <div className="flex items-center gap-2">
                         <span className="material-symbols-outlined text-amber-500 text-lg">psychology</span>
                         <span className="text-[10px] font-black uppercase text-amber-500 tracking-widest">AI Movement Insight</span>
                      </div>
                      <p className="text-xs text-amber-200/80 leading-relaxed font-medium">
                        Excellent form throughout the set. However, we noticed a slight wobble during the hold phase of Rep 4 & 5. Focus on engaging your core to maintain knee stability next time.
                      </p>
                   </div>

                   <div className="space-y-4 pt-4">
                      <button 
                        onClick={handleClosePlayer}
                        className="w-full py-5 bg-sky-500 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-2xl shadow-sky-500/30 active:scale-[0.98] transition-transform cursor-pointer"
                      >
                         Finish Session
                      </button>
                      <button className="w-full py-2 text-slate-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors cursor-pointer">
                         View Detailed Analytics Report
                      </button>
                   </div>
                </div>
             )}
          </div>
        </div>
      )}

      {/* BOTTOM NAV */}
      <BottomNav />

      {/* KEYFRAME ANIMATIONS */}
      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes slideDown { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.3); }
          50% { opacity: 1; transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
