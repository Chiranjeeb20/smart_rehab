"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, logoutUser, getAllUsers } from "../lib/auth";
import { DUMMY_EXERCISES } from "../lib/exercises";

export default function Page() {
  const [doctorName, setDoctorName] = useState("");
  const [doctorDesignation, setDoctorDesignation] = useState("");
  const [doctorCode, setDoctorCode] = useState("");
  const [doctorEmail, setDoctorEmail] = useState("jane.doe@smartrehab.com");
  const [doctorPhone, setDoctorPhone] = useState("+1 (555) 012-3456");
  const [doctorAvatar, setDoctorAvatar] = useState("https://api.dicebear.com/7.x/avataaars/svg?seed=Felix");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [codeCopied, setCodeCopied] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<"patients" | "schedule" | "analytics" | "settings">("patients");
  const [hasNewPatient, setHasNewPatient] = useState(false);
  const [lastCount, setLastCount] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadDashboardData = () => {
      const session = getCurrentUser();
      if (!session || session.role !== "doctor") {
        router.replace("/login");
        return;
      }

      // Check for saved profile overrides in localStorage
      const savedProfile = localStorage.getItem(`profile_${session.id}`);
      if (savedProfile) {
         const profile = JSON.parse(savedProfile);
         setDoctorName(profile.name);
         setDoctorDesignation(profile.designation);
         setDoctorEmail(profile.email);
         setDoctorPhone(profile.phone);
         setDoctorAvatar(profile.avatar);
      } else {
         const displayName = session.name.startsWith("Dr.") ? session.name : `Dr. ${session.name}`;
         setDoctorName(displayName);
         setDoctorDesignation(session.designation || "Physician");
      }

      const freshSession = getCurrentUser();
      const currentDoctorCode = freshSession?.doctorCode || session.doctorCode || "";
      setDoctorCode(currentDoctorCode);
      
      const allUsers = getAllUsers();
      // Filter for patients connected to THIS doctor's unique code
      const myPatients = allUsers.filter(u => 
        u.role === "patient" && u.connectedDoctorCode === currentDoctorCode
      );
      
      // Trigger notification if patient count increased
      setLastCount(prev => {
        if (prev !== null && myPatients.length > prev) {
          setHasNewPatient(true);
        }
        return myPatients.length;
      });
      
      setPatients(myPatients);
      setIsLoaded(true);
    };

    loadDashboardData();

    // Listen for storage changes from other tabs (e.g. when patient connects)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "smart_rehab_users" || e.key === "smart_rehab_session") {
        loadDashboardData();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    
    // Also poll every 3 seconds as a fallback for some browser behaviors
    const pollInterval = setInterval(loadDashboardData, 3000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(pollInterval);
    };
  }, [router]);

  const handleSaveChanges = () => {
    setSaveStatus("saving");
    const session = getCurrentUser();
    if (!session) return;
    
    const profile = {
      name: doctorName,
      designation: doctorDesignation,
      email: doctorEmail,
      phone: doctorPhone,
      avatar: doctorAvatar
    };
    
    localStorage.setItem(`profile_${session.id}`, JSON.stringify(profile));
    
    setTimeout(() => {
       setSaveStatus("saved");
       setTimeout(() => setSaveStatus("idle"), 2000);
    }, 800);
  };

  // Helper to calculate streak
  const calculateStreak = (history: any[]) => {
    if (!history || history.length === 0) return 0;
    // Simple mock logic for streak if real date logic isn't fully implemented in DB
    return 5; 
  };

  // Helper for last activity
  const getLastActivity = (history: any[]) => {
    if (!history || history.length === 0) return "No activity";
    const lastDate = new Date(history[history.length - 1].date);
    return lastDate.toLocaleDateString();
  };

  const handleLogout = () => {
    logoutUser();
    router.push("/login");
  };

  const handleCopyCode = async () => {
    if (!doctorCode) return;
    try {
      await navigator.clipboard.writeText(doctorCode);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = doctorCode;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="material-symbols-outlined text-primary text-4xl animate-spin">progress_activity</span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-200">
      
{/*  SideNavBar  */}
<aside className="hidden md:flex flex-col h-screen w-64 border-r border-sky-300/10 bg-slate-950/60 backdrop-blur-xl font-inter text-sm antialiased shadow-[0_0_30px_rgba(125,211,252,0.05)] py-6 shrink-0 sticky top-0">
<div className="px-6 mb-10">
<h1 className="text-xl font-semibold tracking-tight text-sky-300">Smart Rehab</h1>
<p className="text-xs text-slate-400 mt-1">Doctor Dashboard</p>
</div>
<nav className="flex-1 space-y-1">
<button 
  onClick={() => setActiveTab("patients")}
  className={`w-full flex items-center px-6 py-3 space-x-3 transition-all duration-300 ${activeTab === 'patients' ? 'text-sky-300 font-semibold border-r-2 border-sky-300 bg-sky-300/5' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 active:scale-95 cursor-pointer'}`}
>
  <span className="material-symbols-outlined" data-icon="group">group</span>
  <span>Patients</span>
</button>
<button 
  onClick={() => setActiveTab("schedule")}
  className={`w-full flex items-center px-6 py-3 space-x-3 transition-all duration-300 ${activeTab === 'schedule' ? 'text-sky-300 font-semibold border-r-2 border-sky-300 bg-sky-300/5' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 active:scale-95 cursor-pointer'}`}
>
  <span className="material-symbols-outlined" data-icon="calendar_today">calendar_today</span>
  <span>Schedule</span>
</button>
<button 
  onClick={() => setActiveTab("analytics")}
  className={`w-full flex items-center px-6 py-3 space-x-3 transition-all duration-300 ${activeTab === 'analytics' ? 'text-sky-300 font-semibold border-r-2 border-sky-300 bg-sky-300/5' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 active:scale-95 cursor-pointer'}`}
>
  <span className="material-symbols-outlined" data-icon="analytics">analytics</span>
  <span>Analytics</span>
</button>
<button 
  onClick={() => setActiveTab("settings")}
  className={`w-full flex items-center px-6 py-3 space-x-3 transition-all duration-300 ${activeTab === 'settings' ? 'text-sky-300 font-semibold border-r-2 border-sky-300 bg-sky-300/5' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 active:scale-95 cursor-pointer'}`}
>
  <span className="material-symbols-outlined" data-icon="settings">settings</span>
  <span>Settings</span>
</button>
</nav>
{/* Doctor Code Card */}
{doctorCode && (
<div className="px-6 my-4">
<div className="p-3 rounded-xl bg-sky-300/5 border border-sky-300/15">
<div className="flex items-center gap-2 mb-2">
<span className="material-symbols-outlined text-sky-300 text-sm">pin</span>
<span className="text-[10px] font-bold text-sky-300 uppercase tracking-widest">Your Doctor Code</span>
</div>
<div className="flex items-center justify-between">
<span className="font-mono text-xl font-bold text-on-surface tracking-[0.3em]">{doctorCode}</span>
<button
  onClick={handleCopyCode}
  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-300/10 hover:bg-sky-300/20 text-sky-300 transition-all text-[11px] font-semibold cursor-pointer active:scale-95"
  title="Copy code to clipboard"
>
  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
    {codeCopied ? "check" : "content_copy"}
  </span>
  {codeCopied ? "Copied!" : "Copy"}
</button>
</div>
<p className="text-[10px] text-slate-500 mt-2">Share this code with patients to connect</p>
</div>
</div>
)}
<div className="px-6 mt-auto space-y-3">
<div className="flex items-center space-x-3 p-2 rounded-xl bg-white/[0.03] border border-white/5">
<div className="w-10 h-10 rounded-full border-2 border-sky-400/20 overflow-hidden shrink-0">
<img alt="Doctor profile" className="w-full h-full object-cover" src={doctorAvatar}/>
</div>
<div className="overflow-hidden flex-1 px-1">
<p className="text-sm font-bold truncate text-white uppercase tracking-tight">{doctorName}</p>
<p className="text-[9px] text-slate-500 truncate font-black tracking-widest uppercase">{doctorDesignation}</p>
</div>
</div>
<button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:text-error hover:bg-error/10 transition-all text-xs font-medium cursor-pointer">
<span className="material-symbols-outlined text-base">logout</span>
Sign Out
</button>
</div>
</aside>
<div className="flex-1 flex flex-col min-w-0">
{/*  TopNavBar  */}
<header className="flex items-center justify-between px-8 w-full bg-slate-950/60 backdrop-blur-xl border-b border-sky-300/10 h-16 sticky top-0 z-40">
<div className="flex items-center flex-1 max-w-xl">
<div className="relative w-full group">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg group-focus-within:text-sky-300 transition-colors">search</span>
<input className="w-full bg-slate-900/50 border border-sky-300/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300/30 focus:border-sky-300/50 transition-all" placeholder="Search patients, injuries, or sessions..." type="text"/>
</div>
</div>
<div className="flex items-center space-x-6 ml-4">
<button 
  onClick={() => {
    setHasNewPatient(false);
    setActiveTab("patients");
  }}
  className="relative text-slate-400 hover:text-sky-200 transition-opacity duration-200 cursor-pointer"
>
<span className="material-symbols-outlined" data-icon="notifications">notifications</span>
{hasNewPatient && (
  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-slate-950 animate-pulse"></span>
)}
</button>
<button 
  onClick={() => setActiveTab("settings")}
  className="flex items-center space-x-3 text-slate-400 hover:text-sky-200 transition-all group p-1.5 rounded-xl hover:bg-white/5 cursor-pointer"
>
 <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/10 group-hover:border-sky-300/30 transition-colors bg-slate-900 shadow-lg">
  <img alt="Profile" className="w-full h-full object-cover" src={doctorAvatar}/>
 </div>
 <span className="material-symbols-outlined text-base group-hover:rotate-180 transition-transform duration-300">expand_more</span>
</button>
</div>
</header>
{/*  Main Content  */}
<main className="p-8 space-y-8 pb-24 md:pb-8">
  {activeTab === "patients" && (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-[fadeIn_0.5s_ease-out]">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-on-surface">Patients Overview</h2>
          <p className="text-on-surface-variant text-sm">Managing {patients.length} active recovery programs</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-sky-300 text-on-primary hover:bg-sky-200 transition-all font-semibold text-sm shadow-[0_0_20px_rgba(125,211,252,0.2)]">
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>add_circle</span>
            <span>Assign New Exercise</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {patients.length > 0 ? (
              // ... existing patient mapping ...
              patients.map((p) => (
                <div key={p.id} className="glass-panel p-6 rounded-2xl hover:shadow-[0_0_40px_rgba(125,211,252,0.15)] transition-all group border border-white/5 bg-slate-950/40 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-5">
                    <div className="w-14 h-14 rounded-2xl bg-sky-500/10 flex items-center justify-center text-sky-400 font-black border border-sky-400/20 text-xl shadow-lg ring-4 ring-sky-300/5 group-hover:scale-110 transition-transform duration-500">
                       {p.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest border ${
                        p.patientProfile?.severity === "severe" ? "bg-rose-500/10 text-rose-400 border-rose-500/20" : "bg-sky-500/10 text-sky-300 border-sky-500/20"
                      }`}>
                        {p.patientProfile?.condition || "General"}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-on-surface group-hover:text-sky-300 transition-colors">{p.name}</h3>
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
                         <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Streak</p>
                         <div className="flex items-center gap-1.5 font-bold text-white text-sm">
                           <span className="material-symbols-outlined text-orange-400 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                           {calculateStreak(p.performanceHistory || [])} Days
                         </div>
                      </div>
                      <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
                         <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Activity</p>
                         <div className="flex items-center gap-1.5 font-bold text-white text-xs">
                           <span className="material-symbols-outlined text-sky-400 text-sm">event</span>
                           {getLastActivity(p.performanceHistory || [])}
                         </div>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedPatient(p)}
                    className="mt-6 w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white text-[11px] font-black uppercase tracking-widest hover:bg-sky-300 hover:text-slate-950 transition-all active:scale-[0.98] cursor-pointer"
                  >
                    View Full Detail
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-full border-2 border-dashed border-sky-300/10 rounded-3xl py-32 flex flex-col items-center justify-center text-slate-500 bg-slate-900/10">
                 <div className="w-20 h-20 rounded-full bg-sky-300/5 flex items-center justify-center mb-6 ring-8 ring-sky-300/5">
                    <span className="material-symbols-outlined text-5xl opacity-40">person_search</span>
                 </div>
                 <p className="text-xl font-bold text-white mb-2">No connected patients found</p>
                 <p className="text-sm opacity-60 text-center max-w-xs">Share your unique doctor code <span className="text-sky-300 font-mono font-bold tracking-widest mx-1">{doctorCode}</span> with patients to begin tracking their recovery.</p>
                 <button onClick={handleCopyCode} className="mt-8 px-6 py-2.5 rounded-full bg-sky-300/10 border border-sky-300/30 text-sky-300 text-xs font-bold uppercase tracking-widest hover:bg-sky-300 hover:text-slate-950 transition-all">
                    Copy Code
                 </button>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="glass-elevated p-6 rounded-2xl border border-white/5 bg-slate-900/40">
            <div className="flex items-center space-x-2 mb-6 border-b border-white/5 pb-4">
              <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
              <h3 className="font-bold text-on-surface">Critical Recovery Alerts</h3>
            </div>
            <div className="space-y-4">
               {patients.length > 0 ? (
                 <>
                   <div className="p-4 rounded-xl bg-error-container/20 border border-error/20 flex space-x-3">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-error/20 flex items-center justify-center text-error"><span className="material-symbols-outlined text-sm">event_busy</span></div>
                    <div>
                      <p className="text-xs font-bold text-on-error-container">Missed Sessions (3+)</p>
                      <p className="text-[10px] text-on-surface-variant mt-1">Elena Rodriguez requires immediate follow-up.</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-tertiary-container/20 border border-tertiary/20 flex space-x-3">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-tertiary/20 flex items-center justify-center text-tertiary"><span className="material-symbols-outlined text-sm">insights</span></div>
                    <div>
                      <p className="text-xs font-bold text-on-tertiary-container">Drop in Form Accuracy</p>
                      <p className="text-[10px] text-on-surface-variant mt-1">Marcus Chen's posture dipped below 65%.</p>
                    </div>
                  </div>
                 </>
               ) : (
                 <div className="py-10 text-center space-y-2 opacity-30">
                    <span className="material-symbols-outlined text-4xl">notifications_off</span>
                    <p className="text-[10px] uppercase font-black tracking-widest">No Active Alerts</p>
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>
    </>
  )}

  {activeTab === "schedule" && (
    <div className="animate-[fadeIn_0.5s_ease-out] space-y-8">
       <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Rehab Schedule</h2>
            <p className="text-sm text-slate-400">Monitoring upcoming therapy and exercise sessions</p>
          </div>
          {patients.length > 0 && (
            <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-300 text-slate-950 font-bold text-sm hover:bg-sky-200 transition-all shadow-lg shadow-sky-400/20 active:scale-95">
               <span className="material-symbols-outlined">add_circle</span>
               Schedule Session
            </button>
          )}
       </div>

       {patients.length === 0 ? (
          <div className="min-h-[500px] flex flex-col items-center justify-center rounded-[32px] border-2 border-dashed border-white/5 bg-slate-900/20 p-12 text-center group">
             <div className="w-24 h-24 rounded-3xl bg-slate-800 border border-white/5 flex items-center justify-center mb-8 rotate-3 group-hover:rotate-0 transition-transform duration-500 ring-8 ring-white/[0.02]">
                <span className="material-symbols-outlined text-6xl text-slate-600">calendar_add_on</span>
             </div>
             <h3 className="text-2xl font-bold text-white mb-3">No schedules yet</h3>
             <p className="text-slate-400 max-w-md mb-10 leading-relaxed italic">Your calendar is currently clear. Once patients connect using your clinic code, you can start scheduling therapy sessions and remote monitoring checkpoints.</p>
             <button 
                onClick={handleCopyCode}
                className="flex items-center gap-3 px-8 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-sky-300 hover:text-slate-950 hover:border-transparent transition-all cursor-pointer group/btn"
             >
                <span className="material-symbols-outlined text-lg group-hover/btn:scale-110 transition-transform">share</span>
                Share Doctor Code
             </button>
          </div>
       ) : (
          <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
             <div className="md:col-span-5 space-y-6">
                {/* Mock Calendar Grid */}
                <div className="glass-panel p-8 rounded-[32px] border border-white/5 bg-slate-900/40">
                   <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-4">
                         <h4 className="text-xl font-bold text-white">April 2026</h4>
                         <div className="flex rounded-lg overflow-hidden border border-white/10">
                            <button className="p-1 px-3 hover:bg-white/5 text-slate-400 hover:text-white transition-colors"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
                            <button className="p-1 px-3 hover:bg-white/5 text-slate-400 hover:text-white transition-colors border-l border-white/10"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
                         </div>
                      </div>
                      <div className="flex p-1 bg-slate-950/50 rounded-xl border border-white/5">
                         <button className="px-4 py-1.5 rounded-lg bg-sky-300 text-slate-950 text-[10px] font-black uppercase tracking-widest">Week</button>
                         <button className="px-4 py-1.5 rounded-lg text-slate-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">Month</button>
                      </div>
                   </div>
                   <div className="grid grid-cols-7 gap-4">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                         <div key={day} className="text-center text-[11px] font-black uppercase text-slate-600 tracking-widest mb-4">{day}</div>
                      ))}
                      {/* Placeholder Week Slots */}
                      {Array.from({ length: 7 }).map((_, i) => (
                         <div key={i} className={`min-h-[200px] border border-white/5 rounded-2xl p-2 transition-colors ${i === 2 ? 'bg-sky-300/[0.03] border-sky-300/20' : 'bg-white/[0.01]'}`}>
                           <div className={`text-xs font-bold mb-3 p-1 rounded-md text-center ${i === 2 ? 'text-sky-300' : 'text-slate-500'}`}>{13 + i}</div>
                           <div className="space-y-2">
                             {i % 2 === 0 && (
                                <div className="p-2 rounded-lg bg-sky-400/10 border border-sky-400/20 text-[9px] font-bold text-sky-300 leading-tight">
                                   9:00 AM<br/><span className="text-white">Alex Johnson</span>
                                </div>
                             )}
                             {i === 2 && (
                                <div className="p-2 rounded-lg bg-emerald-400/10 border border-emerald-400/20 text-[9px] font-bold text-emerald-300 leading-tight">
                                   2:30 PM<br/><span className="text-white">Sarah Miller</span>
                                </div>
                             )}
                           </div>
                         </div>
                      ))}
                   </div>
                </div>
             </div>
             
             <div className="md:col-span-2 space-y-6">
                <div className="glass-panel p-6 rounded-[32px] border border-white/5 bg-slate-950/40">
                   <h4 className="text-xs font-black uppercase text-slate-500 tracking-[0.3em] mb-6 flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">schedule</span>
                      Upcoming Today
                   </h4>
                   <div className="space-y-4">
                      {patients.slice(0, 3).map((p, idx) => (
                         <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/[0.08] transition-all group cursor-pointer">
                            <div className="flex justify-between items-start mb-2">
                               <p className="text-xs font-bold text-white group-hover:text-sky-300">{p.name}</p>
                               <span className="text-[10px] font-black text-slate-500 uppercase">10:30 AM</span>
                            </div>
                            <p className="text-[9px] text-slate-400 font-medium uppercase tracking-widest">Upper Body Rehab Session</p>
                            <div className="mt-3 flex gap-2">
                               <button className="flex-1 py-1.5 rounded-lg bg-sky-500/10 border border-sky-500/10 text-[9px] font-black text-sky-400 uppercase tracking-widest hover:bg-sky-500 hover:text-slate-950 transition-all">Start</button>
                               <button className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500"><span className="material-symbols-outlined text-sm">edit</span></button>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
       )}
    </div>
  )}

  {activeTab === "analytics" && (
    <div className="animate-[fadeIn_0.5s_ease-out] space-y-8">
       <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Clinical Analytics</h2>
            <p className="text-sm text-slate-400">Recovery performance and exercise effectiveness insights</p>
          </div>
       </div>

       {patients.length === 0 ? (
          <div className="min-h-[500px] flex flex-col items-center justify-center rounded-[32px] border-2 border-dashed border-white/5 bg-slate-900/20 p-12 text-center group">
             <div className="w-24 h-24 rounded-3xl bg-slate-800 border border-white/5 flex items-center justify-center mb-8 rotate-3 group-hover:rotate-0 transition-transform duration-500 ring-8 ring-white/[0.02]">
                <span className="material-symbols-outlined text-6xl text-slate-600">analytics</span>
             </div>
             <h3 className="text-2xl font-bold text-white mb-3">No analytics data available</h3>
             <p className="text-slate-400 max-w-md mb-10 leading-relaxed italic">Once your connected patients complete sessions, deep clinical insights including accuracy trends, form stability, and recovery progression will be visualized here.</p>
             <button disabled className="flex items-center gap-3 px-8 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white/30 font-bold text-sm cursor-not-allowed">
                Connecting Patient Required
             </button>
          </div>
       ) : (
          <div className="space-y-8">
             {/* 1. Overview Cards */}
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-slate-900/40 text-center">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Total Patients</p>
                   <p className="text-4xl font-black text-white">{patients.length}</p>
                </div>
                <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-slate-900/40 text-center">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Avg. Recovery</p>
                   <p className="text-4xl font-black text-emerald-400">68%</p>
                </div>
                <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-slate-900/40 text-center">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Avg. Accuracy</p>
                   <p className="text-4xl font-black text-sky-400">82%</p>
                </div>
                <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-slate-900/40 text-center">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Compliance</p>
                   <p className="text-4xl font-black text-orange-400">74%</p>
                </div>
             </div>

             {/* 2. Charts Section */}
             <div className="grid grid-cols-2 gap-8">
                <div className="glass-panel p-8 rounded-[32px] border border-white/5 bg-slate-950/40">
                   <h4 className="text-xs font-black uppercase text-slate-500 tracking-[0.3em] mb-8">Posture Accuracy Trends</h4>
                   <div className="h-48 w-full border-l border-b border-white/10 relative mt-4">
                      {/* Simple SVG Chart Representation */}
                      <svg viewBox="0 0 400 100" className="w-full h-full preserve-3d">
                        <path d="M 0 80 Q 50 60 100 70 T 200 40 T 300 30 T 400 50" fill="none" stroke="#38bdf8" strokeWidth="2" />
                        <circle cx="100" cy="70" r="3" fill="#38bdf8" />
                        <circle cx="200" cy="40" r="3" fill="#38bdf8" />
                        <circle cx="300" cy="30" r="3" fill="#38bdf8" />
                      </svg>
                      <div className="flex justify-between mt-4 text-[9px] font-black uppercase text-slate-500 tracking-widest">
                         <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                      </div>
                   </div>
                </div>
                <div className="glass-panel p-8 rounded-[32px] border border-white/5 bg-slate-950/40">
                   <h4 className="text-xs font-black uppercase text-slate-500 tracking-[0.3em] mb-8">Exercise Completion Rate</h4>
                   <div className="flex items-end h-48 gap-4 px-4">
                      {[60, 45, 90, 75, 40, 85].map((h, i) => (
                         <div key={i} className="flex-1 bg-sky-500/20 rounded-t-lg transition-all hover:bg-sky-500/40 relative group" style={{ height: `${h}%` }}>
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 border border-white/10 px-2 py-1 rounded text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">{h}%</div>
                         </div>
                      ))}
                   </div>
                   <div className="flex justify-between mt-4 text-[9px] font-black uppercase text-slate-500 tracking-widest">
                      <span>Arms</span><span>Legs</span><span>Core</span><span>Neck</span><span>Back</span><span>Hip</span>
                   </div>
                </div>
             </div>

             {/* 3. Deep Insights Bento */}
             <div className="grid grid-cols-3 gap-8">
                <div className="col-span-1 glass-panel p-6 rounded-[32px] border border-white/5 bg-slate-900/20">
                   <h4 className="text-xs font-black uppercase text-slate-500 tracking-[0.2em] mb-6">Top Performing</h4>
                   <div className="space-y-4">
                      {patients.slice(0, 3).map((p, i) => (
                         <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02]">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-full bg-emerald-400/10 text-emerald-400 flex items-center justify-center text-[10px] font-black">{p.name.charAt(0)}</div>
                               <p className="text-xs font-bold text-white">{p.name}</p>
                            </div>
                            <span className="text-[10px] font-black text-emerald-400">98% Acc.</span>
                         </div>
                      ))}
                   </div>
                </div>
                <div className="col-span-2 glass-panel p-8 rounded-[32px] border border-sky-400/10 bg-sky-400/[0.02] relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8 opacity-10">
                      <span className="material-symbols-outlined text-8xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                   </div>
                   <h4 className="text-xs font-black uppercase text-sky-400 tracking-[0.3em] mb-6">AI Clinical Prediction</h4>
                   <div className="space-y-4 max-w-xl">
                      <p className="text-sm text-slate-300 leading-relaxed italic border-l-2 border-sky-400/30 pl-4 py-1">"Connected patients show a <span className="text-white font-bold">24% higher recovery rate</span> when completing sessions before noon. Suggest modifying routine for David Kim to morning slots based on active form stability data."</p>
                   </div>
                </div>
             </div>
          </div>
       )}
    </div>
  )}
  {activeTab === "settings" && (
    <div className="animate-[fadeIn_0.5s_ease-out] space-y-10 pb-20">
       <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight">Clinical Settings</h2>
            <p className="text-sm text-slate-400 mt-1">Manage your specialist profile, clinic connection codes, and application preferences</p>
          </div>
          <button 
             onClick={handleSaveChanges}
             className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95 ${
                saveStatus === 'saved' ? 'bg-emerald-400 text-slate-950 shadow-emerald-400/20' : 
                saveStatus === 'saving' ? 'bg-sky-200 text-slate-950 animate-pulse' :
                'bg-sky-300 text-slate-950 hover:bg-sky-200 shadow-sky-400/20'
             }`}
          >
             {saveStatus === 'saved' ? 'Saved Successfully' : saveStatus === 'saving' ? 'Saving...' : 'Save All Changes'}
          </button>
       </div>

       <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column: Profile & Security */}
          <div className="xl:col-span-2 space-y-8">
             {/* 1. Profile Settings */}
             <section className="glass-panel p-8 rounded-[32px] border border-white/5 bg-slate-900/40 space-y-8">
                <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                   <span className="material-symbols-outlined text-sky-400 text-2xl">account_circle</span>
                   <h3 className="text-lg font-bold text-white">Profile Information</h3>
                </div>
                <div className="flex flex-col md:flex-row gap-10 items-start">
                   <div className="flex flex-col items-center gap-4">
                      <div className="relative group">
                         <img alt="Doctor" className="w-40 h-40 rounded-3xl object-cover border-2 border-sky-400/20 shadow-2xl transition-transform duration-500 group-hover:scale-105 bg-slate-950" src={doctorAvatar}/>
                         <div className="absolute inset-0 bg-slate-950/40 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-3xl">photo_camera</span>
                         </div>
                      </div>
                      <div className="flex gap-2">
                         <button 
                            onClick={() => setDoctorAvatar("https://api.dicebear.com/7.x/avataaars/svg?seed=Felix")}
                            className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all ${doctorAvatar.includes('Felix') ? 'bg-sky-400 border-transparent text-slate-950 shadow-lg' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'}`}
                            title="Male Avatar"
                         >
                            <span className="material-symbols-outlined text-sm">man</span>
                         </button>
                         <button 
                            onClick={() => setDoctorAvatar("https://api.dicebear.com/7.x/avataaars/svg?seed=Anya")}
                            className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all ${doctorAvatar.includes('Anya') ? 'bg-sky-400 border-transparent text-slate-950 shadow-lg' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'}`}
                            title="Female Avatar"
                         >
                            <span className="material-symbols-outlined text-sm">woman</span>
                         </button>
                         <input 
                           type="file" 
                           id="avatarUpload" 
                           className="hidden" 
                           accept="image/*"
                           onChange={(e) => {
                             const file = e.target.files?.[0];
                             if (file) {
                               const reader = new FileReader();
                               reader.onloadend = () => {
                                 setDoctorAvatar(reader.result as string);
                               };
                               reader.readAsDataURL(file);
                             }
                           }}
                         />
                         <button 
                            onClick={() => document.getElementById('avatarUpload')?.click()}
                            className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-slate-400 flex items-center justify-center hover:text-white transition-all cursor-pointer"
                            title="Upload Custom Photo"
                         >
                            <span className="material-symbols-outlined text-sm">upload</span>
                         </button>
                      </div>
                   </div>
                   <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                         <input 
                            type="text" 
                            value={doctorName} 
                            onChange={(e) => setDoctorName(e.target.value)}
                            className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-sky-300/50 outline-none transition-all focus:bg-slate-900"
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Specialization</label>
                         <input 
                            type="text" 
                            value={doctorDesignation} 
                            onChange={(e) => setDoctorDesignation(e.target.value)}
                            className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-sky-300/50 outline-none transition-all focus:bg-slate-900"
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                         <input 
                            type="email" 
                            value={doctorEmail} 
                            onChange={(e) => setDoctorEmail(e.target.value)}
                            className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-sky-300/50 outline-none transition-all focus:bg-slate-900"
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Phone Number</label>
                         <input 
                            type="tel" 
                            value={doctorPhone} 
                            onChange={(e) => setDoctorPhone(e.target.value)}
                            className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-sky-300/50 outline-none transition-all focus:bg-slate-900"
                         />
                      </div>
                   </div>
                </div>
             </section>

             {/* 2. Notification Preferences */}
             <section className="glass-panel p-8 rounded-[32px] border border-white/5 bg-slate-900/40 space-y-8">
                <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                   <span className="material-symbols-outlined text-sky-400 text-2xl">notifications</span>
                   <h3 className="text-lg font-bold text-white">Smart Notifications</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                   {[
                      { label: "New Patient Connection", sub: "Alert when a patient uses your clinic code", key: "new" },
                      { label: "Direct Messages", sub: "Instant notifications for patient chat inquiries", key: "msg" },
                      { label: "Missed Sessions", sub: "Alert when a patient skips 2+ assigned routines", key: "missed" },
                      { label: "Critical Performance Dip", sub: "Alert if posture accuracy drops below 60%", key: "low" }
                   ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-2">
                         <div>
                            <p className="text-sm font-bold text-white">{item.label}</p>
                            <p className="text-[10px] text-slate-500 font-medium uppercase mt-1 tracking-tight">{item.sub}</p>
                         </div>
                         <div className="w-12 h-6 rounded-full bg-sky-300/20 border border-sky-300/30 relative cursor-pointer px-1 flex items-center">
                            <div className="w-4 h-4 rounded-full bg-sky-300 shadow-[0_0_10px_rgba(125,211,252,0.5)] translate-x-6"></div>
                         </div>
                      </div>
                   ))}
                </div>
             </section>

             {/* 3. Therapy & Patient Management */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section className="glass-panel p-8 rounded-[32px] border border-white/5 bg-slate-900/40 space-y-6">
                   <h4 className="text-xs font-black uppercase text-slate-500 tracking-[.3em] flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">settings_accessibility</span>
                    Patient Management
                   </h4>
                   <div className="space-y-4">
                      <div className="flex items-center justify-between bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                         <span className="text-xs font-bold text-white">Auto-accept connections</span>
                         <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-white/20 bg-slate-800 text-sky-500"/>
                      </div>
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Connected Patients: {patients.length} / 50</p>
                   </div>
                </section>

                <section className="glass-panel p-8 rounded-[32px] border border-white/5 bg-slate-900/40 space-y-6">
                   <h4 className="text-xs font-black uppercase text-slate-500 tracking-[.3em] flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">timer</span>
                    Therapy Preferences
                   </h4>
                   <div className="space-y-4">
                      <div className="flex items-center justify-between bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                         <span className="text-xs font-bold text-white">Default Session Duration</span>
                         <select className="bg-slate-900 border-none text-xs font-bold text-sky-300 focus:ring-0 cursor-pointer">
                            <option>30 Mins</option>
                            <option selected>45 Mins</option>
                            <option>60 Mins</option>
                         </select>
                      </div>
                   </div>
                </section>
             </div>
          </div>

          {/* Right Column: Doctor Code, Data, App Prefs */}
          <div className="space-y-8">
             {/* 4. Doctor Code Hub */}
             <section className="glass-panel p-8 rounded-[32px] border border-sky-400/20 bg-sky-400/[0.03] space-y-6">
                <h4 className="text-xs font-black uppercase text-sky-400 tracking-[0.3em] flex items-center gap-2">
                   <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>pin</span>
                   Specialist Identity
                </h4>
                <div className="p-6 rounded-3xl bg-slate-950 border border-sky-400/10 text-center space-y-4 shadow-inner">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Connection Code</p>
                   <p className="text-5xl font-black text-white tracking-[0.3em] font-mono">{doctorCode}</p>
                   <div className="flex gap-2 pt-2">
                      <button onClick={handleCopyCode} className="flex-1 py-3 rounded-xl bg-sky-300 text-slate-950 text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all">Copy Code</button>
                      <button className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Regenerate</button>
                   </div>
                </div>
             </section>

             {/* 5. Security & Account */}
             <section className="glass-panel p-8 rounded-[32px] border border-white/5 bg-slate-900/40 space-y-6">
                <h4 className="text-xs font-black uppercase text-slate-500 tracking-[0.3em] flex items-center gap-2">
                   <span className="material-symbols-outlined text-sm">security</span>
                   Security
                </h4>
                <div className="space-y-3">
                   <button className="w-full text-left p-4 rounded-xl hover:bg-white/5 transition-all flex items-center justify-between group">
                      <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">Update Password</span>
                      <span className="material-symbols-outlined text-sm text-slate-600">chevron_right</span>
                   </button>
                   <button className="w-full text-left p-4 rounded-xl hover:bg-white/5 transition-all flex items-center justify-between group border border-white/[0.03]">
                      <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">Session Lock</span>
                      <div className="w-10 h-5 rounded-full bg-emerald-500/20 px-1 flex items-center border border-emerald-500/30">
                         <div className="w-3 h-3 rounded-full bg-emerald-400 translate-x-5"></div>
                      </div>
                   </button>
                   <button className="w-full p-3 mt-2 rounded-xl text-error text-[10px] font-black uppercase tracking-widest border border-error/20 hover:bg-error/10 transition-all">Logout from all devices</button>
                </div>
             </section>

             {/* 6. Data & App Preferences */}
             <section className="glass-panel p-8 rounded-[32px] border border-white/5 bg-slate-900/40 space-y-6">
                <h4 className="text-xs font-black uppercase text-slate-500 tracking-[0.3em] flex items-center gap-2">
                   <span className="material-symbols-outlined text-sm">folder_shared</span>
                   System
                </h4>
                <div className="space-y-4">
                   <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 group hover:border-sky-300/30 cursor-pointer transition-all">
                      <div className="flex items-center gap-3">
                         <span className="material-symbols-outlined text-sky-400 text-lg">download</span>
                         <span className="text-xs font-bold text-white">Export Clinical Reports</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-bold">CSV/PDF</span>
                   </div>
                   <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                      <div className="flex items-center gap-3">
                         <span className="material-symbols-outlined text-slate-400 text-lg">dark_mode</span>
                         <span className="text-xs font-bold text-white">Appearance</span>
                      </div>
                      <span className="text-[10px] font-black text-sky-300 uppercase tracking-widest">Dark Mode</span>
                   </div>
                </div>
             </section>

             {/* 7. Support */}
             <div className="flex gap-4">
                <button className="flex-1 flex flex-col items-center gap-2 p-6 rounded-[24px] bg-slate-900/40 border border-white/5 hover:bg-white/5 transition-all text-slate-400 hover:text-white">
                   <span className="material-symbols-outlined">help_center</span>
                   <span className="text-[10px] font-black uppercase tracking-widest">Help Center</span>
                </button>
                <button className="flex-1 flex flex-col items-center gap-2 p-6 rounded-[24px] bg-slate-900/40 border border-white/5 hover:bg-white/5 transition-all text-slate-400 hover:text-white">
                   <span className="material-symbols-outlined">support_agent</span>
                   <span className="text-[10px] font-black uppercase tracking-widest">Support</span>
                </button>
             </div>
          </div>
       </div>
    </div>
  )}
</main>

</div>
      {/* ===== PATIENT DETAIL MODAL ===== */}
      {selectedPatient && (
        <div className="fixed inset-0 z-[100] flex items-center justify-end bg-slate-950/60 backdrop-blur-md animate-[fadeIn_0.3s_ease-out]">
           <div 
             className="w-full max-w-2xl h-full bg-slate-950 border-l border-white/5 shadow-[-20px_0_60px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col animate-[slideInRight_0.4s_ease-out]"
           >
              {/* Modal Header */}
              <header className="p-8 border-b border-white/5 flex items-center justify-between bg-slate-900/20">
                 <div className="flex items-center gap-5">
                    <button 
                      onClick={() => setSelectedPatient(null)}
                      className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-lg">close</span>
                    </button>
                    <div>
                       <h2 className="text-2xl font-bold text-white">{selectedPatient.name}</h2>
                       <p className="text-xs text-slate-500 uppercase font-black tracking-widest mt-0.5">Clinical Profile: {selectedPatient.patientProfile?.condition} Rehab</p>
                    </div>
                 </div>
                 <div className="flex gap-3">
                    <button className="px-4 py-2 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold uppercase tracking-wider hover:bg-sky-500/20 transition-all cursor-pointer">
                       Download Report
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-emerald-500 text-slate-950 text-xs font-bold uppercase tracking-wider hover:bg-emerald-400 transition-all cursor-pointer shadow-lg shadow-emerald-500/20">
                       Save Changes
                    </button>
                 </div>
              </header>

              <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                 {/* 1. Recovery Analytics */}
                 <section className="space-y-4">
                    <h3 className="text-xs font-black uppercase text-slate-500 tracking-[0.3em] flex items-center gap-2">
                       <span className="material-symbols-outlined text-sm">analytics</span>
                       Recovery Metrics
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                       <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-white/[0.02]">
                          <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Avg. Accuracy</p>
                          <p className="text-3xl font-black text-emerald-400">
                             {selectedPatient.performanceHistory?.length 
                               ? Math.round(selectedPatient.performanceHistory.reduce((a: any, b: any) => a + b.accuracy, 0) / selectedPatient.performanceHistory.length)
                               : 82}%
                          </p>
                       </div>
                       <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-white/[0.02]">
                          <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Compliance Rate</p>
                          <p className="text-3xl font-black text-sky-400">92%</p>
                       </div>
                       <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-white/[0.02]">
                          <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Recovery Goal</p>
                          <p className="text-3xl font-black text-tertiary">65%</p>
                       </div>
                    </div>
                 </section>

                 {/* 2. AI Recovery Insights */}
                 <section className="space-y-4">
                    <h3 className="text-xs font-black uppercase text-slate-500 tracking-[0.3em] flex items-center gap-2">
                       <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                       AI Intelligence
                    </h3>
                    <div className="glass-panel p-6 rounded-2xl border border-sky-400/20 bg-sky-400/5 space-y-4">
                        <div className="flex gap-4">
                           <span className="material-symbols-outlined text-sky-400">trending_up</span>
                           <p className="text-sm text-slate-300 leading-relaxed">
                             Patient is responding well to <span className="text-white font-bold">Physiotherapy Path</span>. Form accuracy on "Heel Slides" increased by 15% this week.
                           </p>
                        </div>
                        <div className="flex gap-4">
                           <span className="material-symbols-outlined text-amber-400">warning</span>
                           <p className="text-sm text-slate-300 leading-relaxed">
                             Observed difficulty in <span className="text-white font-bold">Neck Tilts</span>. Range of motion seems restricted in the final 10 degrees.
                           </p>
                        </div>
                    </div>
                 </section>

                 {/* 3. Modify Exercise Plan */}
                 <section className="space-y-6">
                    <div className="flex items-center justify-between">
                       <h3 className="text-xs font-black uppercase text-slate-500 tracking-[0.3em] flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm">fitness_center</span>
                          Exercise Library & Routine
                       </h3>
                       <button className="text-[10px] font-bold text-sky-300 uppercase underline cursor-pointer">Manage All</button>
                    </div>
                    <div className="space-y-3">
                       {DUMMY_EXERCISES.slice(0, 5).map((ex) => (
                          <div key={ex.id} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/[0.08] transition-colors group">
                             <div className="w-10 h-10 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400 group-hover:text-sky-300 transition-colors">
                                <span className="material-symbols-outlined">{ex.illustration}</span>
                             </div>
                             <div className="flex-1">
                                <p className="text-sm font-bold text-white">{ex.name}</p>
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest">{ex.type} • {ex.sets}x{ex.reps}</p>
                             </div>
                             <input 
                               type="checkbox" 
                               defaultChecked={selectedPatient.assignedExercises?.includes(ex.id)}
                               className="w-5 h-5 rounded border-white/20 bg-slate-800 text-sky-500 focus:ring-sky-500/20"
                             />
                          </div>
                       ))}
                    </div>
                 </section>

                 {/* 4. Clinical Notes */}
                 <section className="space-y-4">
                    <h3 className="text-xs font-black uppercase text-slate-500 tracking-[0.3em] flex items-center gap-2">
                       <span className="material-symbols-outlined text-sm">edit_note</span>
                       Specialist Clinical Notes
                    </h3>
                    <textarea 
                      className="w-full bg-slate-900/50 border border-white/10 rounded-2xl p-5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-300/30 transition-all min-h-[150px]"
                      placeholder="Add observations about range of motion, pain levels, or plan adjustments..."
                    />
                 </section>
              </div>

              {/* Modal Footer */}
              <footer className="p-8 border-t border-white/5 bg-slate-900/10">
                 <button 
                   onClick={() => setSelectedPatient(null)}
                   className="w-full py-4 text-xs font-bold text-slate-500 uppercase tracking-[0.4em] hover:text-white transition-colors cursor-pointer"
                 >
                    Close Profile
                 </button>
              </footer>
           </div>
        </div>
      )}

{/*  BottomNavBar (Mobile Only)  */}
<nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pt-3 pb-8 bg-slate-900/75 backdrop-blur-2xl border-t border-sky-300/15 shadow-[0_-4px_24px_rgba(0,0,0,0.4)] rounded-t-3xl">
<a className="flex flex-col items-center justify-center text-slate-400" href="#">
<span className="material-symbols-outlined" data-icon="home">home</span>
<span className="font-inter text-[11px] font-medium mt-1">Home</span>
</a>
<a className="flex flex-col items-center justify-center text-sky-300 bg-sky-300/10 rounded-xl px-3 py-1" href="#">
<span className="material-symbols-outlined" data-icon="fitness_center">fitness_center</span>
<span className="font-inter text-[11px] font-medium mt-1">Exercises</span>
</a>
<a className="flex flex-col items-center justify-center text-slate-400" href="#">
<span className="material-symbols-outlined" data-icon="trending_up">trending_up</span>
<span className="font-inter text-[11px] font-medium mt-1">Progress</span>
</a>
<a className="flex flex-col items-center justify-center text-slate-400" href="#">
<span className="material-symbols-outlined" data-icon="chat">chat</span>
<span className="font-inter text-[11px] font-medium mt-1">Chat</span>
</a>
</nav>

<style jsx global>{`
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slideInRight {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
  }
  .custom-scrollbar::-webkit-scrollbar {
    width: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(125, 211, 252, 0.1);
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(125, 211, 252, 0.2);
  }
`}</style>
    </div>
  );
}
