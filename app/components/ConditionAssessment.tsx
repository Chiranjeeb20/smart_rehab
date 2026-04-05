"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { updatePatientProfile, generateAIRehabPlan, getAllDoctors } from "../lib/auth";
import { DUMMY_EXERCISES } from "../lib/exercises";

interface ConditionAssessmentProps {
  onComplete: () => void;
  onClose: () => void;
}

export default function ConditionAssessment({ onComplete, onClose }: ConditionAssessmentProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({
    condition: "knee" as any,
    severity: "moderate" as any,
    goal: "mobility" as any,
    symptoms: [] as string[],
    age: 30
  });

  const getRecommendedSpecialist = () => {
    if (["neck", "posture", "back"].includes(profile.condition)) return "Occupational Therapist";
    if (["balance", "coordination", "general"].includes(profile.condition)) return "Neuropsychologist";
    return "Physiotherapist";
  };

  const handleSymptomToggle = (s: string) => {
    setProfile(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(s) 
        ? prev.symptoms.filter(x => x !== s) 
        : [...prev.symptoms, s]
    }));
  };

  const handleFinish = () => {
    updatePatientProfile(profile);
    onComplete();
    router.push("/patient/exercises");
  };

  return (
    <div className="fixed inset-0 z-[200] bg-[#0B1121]/95 backdrop-blur-xl flex items-center justify-center p-6 animate-[fadeIn_0.3s_ease-out]">
      <div className="glass-card w-full max-w-lg p-8 rounded-3xl border border-white/10 shadow-2xl space-y-8 relative overflow-hidden">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
           <div className="h-full bg-sky-500 transition-all duration-500" style={{ width: `${(step / 4) * 100}%` }} />
        </div>

        {step === 1 && (
          <div className="space-y-6 animate-[slideUp_0.4s_ease-out]">
             <div className="text-center space-y-2">
                <h2 className="text-2xl font-black tracking-tight">Identify Body Area</h2>
                <p className="text-slate-400 text-sm">Where are you experiencing issues?</p>
             </div>
             <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "knee", icon: "straighten", label: "Knee" },
                  { id: "shoulder", icon: "accessibility", label: "Shoulder" },
                  { id: "neck", icon: "personal_injury", label: "Neck" },
                  { id: "back", icon: "moving", label: "Spine/Back" },
                  { id: "posture", icon: "man", label: "Posture" },
                  { id: "balance", icon: "waves", label: "Balance" },
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setProfile({ ...profile, condition: c.id as any })}
                    className={`p-4 rounded-2xl border transition-all text-center space-y-2 flex flex-col items-center justify-center ${
                      profile.condition === c.id ? "bg-sky-500/10 border-sky-500 text-sky-400" : "bg-white/5 border-white/5 text-slate-400 hover:border-white/10"
                    }`}
                  >
                    <span className="material-symbols-outlined text-2xl">{c.icon}</span>
                    <p className="text-[10px] font-bold uppercase tracking-widest">{c.label}</p>
                  </button>
                ))}
             </div>
             <button onClick={() => setStep(2)} className="w-full py-4 bg-sky-500 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-sky-500/20 active:scale-95 transition-transform">
                Next: Select Symptoms
             </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-[fadeIn_0.4s_ease-out]">
             <div className="text-center space-y-2">
                <h2 className="text-2xl font-black tracking-tight">Current Symptoms</h2>
                <p className="text-slate-400 text-sm">Select all that apply to your {profile.condition}.</p>
             </div>
             <div className="grid grid-cols-1 gap-2">
                {[
                  "Persistent Sharp Pain",
                  "Stiffness after rest",
                  "Limited range of motion",
                  "Swelling or inflation",
                  "Muscle weakness",
                  "Unstable or 'wobbly' joints"
                ].map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSymptomToggle(s)}
                    className={`w-full p-4 rounded-xl border transition-all text-left flex items-center justify-between ${
                      profile.symptoms.includes(s) ? "bg-emerald-500/10 border-emerald-500 text-emerald-400" : "bg-white/5 border-white/5 text-slate-400"
                    }`}
                  >
                    <span className="text-xs font-semibold">{s}</span>
                    {profile.symptoms.includes(s) && <span className="material-symbols-outlined text-base">check_box</span>}
                  </button>
                ))}
             </div>
             <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="w-1/3 py-4 bg-white/5 text-slate-400 font-bold rounded-2xl">Back</button>
                <button onClick={() => setStep(3)} className="flex-1 py-4 bg-sky-500 text-white font-black uppercase tracking-widest text-xs rounded-2xl">Next: Severity</button>
             </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-[fadeIn_0.4s_ease-out]">
             <div className="text-center space-y-2">
                <h2 className="text-2xl font-black tracking-tight">Severity Level</h2>
                <p className="text-slate-400 text-sm">Estimate your current pain/disability level.</p>
             </div>
              <div className="space-y-4 animate-[fadeIn_0.4s_ease-out]">
                 <div className="space-y-3">
                    {[
                      { id: "mild", label: "Mild", desc: "Slight discomfort, mostly functional" },
                      { id: "moderate", label: "Moderate", desc: "Pain limits complex movements" },
                      { id: "severe", label: "Severe", desc: "Pain during rest or minimal movement" },
                    ].map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setProfile({ ...profile, severity: s.id as any })}
                        className={`w-full p-5 rounded-2xl border transition-all text-left ${
                          profile.severity === s.id ? "bg-rose-500/10 border-rose-500 text-rose-400" : "bg-white/5 border-white/5 text-slate-400"
                        }`}
                      >
                        <p className="text-sm font-black uppercase tracking-widest">{s.label}</p>
                        <p className="text-[10px] text-slate-500 mt-1">{s.desc}</p>
                      </button>
                    ))}
                 </div>
                 
                 <div className="pt-4">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Optional: Describe your problem</label>
                    <textarea 
                      placeholder="E.g. I have trouble lifting weights or sleeping on my side..."
                      onChange={(e) => setProfile({ ...profile, description: e.target.value } as any)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-slate-300 focus:border-sky-500/50 outline-none transition-all h-24 resize-none"
                    />
                 </div>
              </div>
              <div className="flex gap-4">
                 <button onClick={() => setStep(2)} className="w-1/3 py-4 bg-white/5 text-slate-400 font-bold rounded-2xl">Back</button>
                 <button onClick={() => setStep(4)} className="flex-1 py-4 bg-sky-500 text-white font-black uppercase tracking-widest text-xs rounded-2xl">Next: Recommendation</button>
              </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-[fadeIn_0.5s_ease-out] overflow-y-auto max-h-[70vh] pr-2 scrollbar-hide">
             <div className="text-center space-y-2">
                <h2 className="text-2xl font-black tracking-tight">AI Recommendation</h2>
                <p className="text-slate-400 text-sm">"Your plan is tailored based on your condition"</p>
             </div>
             
             {/* SPECIALIST CARD */}
             <div className="p-5 rounded-2xl bg-sky-500/10 border border-sky-500/20">
                <div className="flex items-center gap-3 mb-3">
                   <div className="w-10 h-10 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center">
                      <span className="material-symbols-outlined text-xl">psychiatry</span>
                   </div>
                   <div>
                      <p className="text-[10px] font-black uppercase text-sky-400 opacity-70">Clinical Role</p>
                      <p className="text-lg font-bold text-white">{getRecommendedSpecialist()}</p>
                   </div>
                </div>
                {/* RECOMMENDED DOCTORS */}
                <div className="pt-3 border-t border-sky-500/10">
                   <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2">Recommended Human Specialists</p>
                   <div className="flex gap-2">
                      {getAllDoctors()
                        .filter(d => {
                           const spec = getRecommendedSpecialist().split(' ')[0].toLowerCase();
                           return d.designation.toLowerCase().includes(spec);
                        })
                        .slice(0, 1)
                        .map(d => (
                          <div key={d.doctorCode} className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/5 flex-1">
                             <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-[10px]">{d.name.charAt(0)}</div>
                             <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-bold truncate leading-tight">{d.name}</p>
                                <p className="text-[8px] text-slate-500">{d.designation}</p>
                             </div>
                             <span className="text-[10px] font-black text-sky-400">#{d.doctorCode}</span>
                          </div>
                      ))}
                   </div>
                </div>
             </div>

             {/* PLAN PREVIEW */}
             <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tailored Exercise Routine</h3>
                <div className="grid grid-cols-1 gap-2">
                   {generateAIRehabPlan(profile).plan.map(id => {
                      const exercise = DUMMY_EXERCISES.find(ex => ex.id === id);
                      return exercise ? (
                        <div key={id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 group">
                           <span className="material-symbols-outlined text-sky-400 text-lg">{exercise.type === 'warm-up' ? 'mode_fan' : exercise.type === 'cool-down' ? 'eco' : 'health_and_safety'}</span>
                           <div className="flex-1">
                              <p className="text-xs font-bold">{exercise.name}</p>
                              <p className="text-[9px] text-slate-500 uppercase tracking-tighter">{exercise.sets} Sets • {exercise.reps} {exercise.reps === 1 ? 'Hold' : 'Reps'}</p>
                           </div>
                           <span className="text-[8px] font-black px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-400 uppercase">{exercise.type}</span>
                        </div>
                      ) : null;
                   })}
                </div>
             </div>

             <div className="flex gap-4 pt-4 sticky bottom-0 bg-[#0B1121]/95 py-2">
                <button onClick={() => setStep(3)} className="w-1/4 py-4 bg-white/5 text-slate-400 font-bold rounded-2xl">Back</button>
                <button onClick={handleFinish} className="flex-1 py-4 bg-emerald-500 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-emerald-500/20 active:scale-95 transition-transform">
                   Confirm & Create My Plan
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
