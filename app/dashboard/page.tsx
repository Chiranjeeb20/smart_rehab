"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, logoutUser, getAllUsers } from "../lib/auth";
import { DUMMY_EXERCISES } from "../lib/exercises";

export default function Page() {
  const [doctorName, setDoctorName] = useState("");
  const [doctorDesignation, setDoctorDesignation] = useState("");
  const [doctorCode, setDoctorCode] = useState("");
  const [codeCopied, setCodeCopied] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [patients, setPatients] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const session = getCurrentUser();
    if (!session || session.role !== "doctor") {
      router.replace("/login");
      return;
    }
    // Add "Dr." prefix if not already present
    const displayName = session.name.startsWith("Dr.")
      ? session.name
      : `Dr. ${session.name}`;
    setDoctorName(displayName);
    setDoctorDesignation(session.designation || "Physician");
    setDoctorCode(session.doctorCode || "");

    // Fetch patients connected to this doctor
    const allUsers = getAllUsers();
    const myPatients = allUsers.filter(u => u.connectedDoctorCode === session.doctorCode);
    setPatients(myPatients);

    setIsLoaded(true);
  }, [router]);

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
    <>
      
{/*  SideNavBar  */}
<aside className="hidden md:flex flex-col h-screen w-64 border-r border-sky-300/10 bg-slate-950/60 backdrop-blur-xl font-inter text-sm antialiased shadow-[0_0_30px_rgba(125,211,252,0.05)] py-6 shrink-0 sticky top-0">
<div className="px-6 mb-10">
<h1 className="text-xl font-semibold tracking-tight text-sky-300">Smart Rehab</h1>
<p className="text-xs text-slate-400 mt-1">Doctor Dashboard</p>
</div>
<nav className="flex-1 space-y-1">
<a className="flex items-center px-6 py-3 space-x-3 text-sky-300 font-semibold border-r-2 border-sky-300 bg-sky-300/5 transition-all duration-300" href="#">
<span className="material-symbols-outlined" data-icon="group">group</span>
<span>Patients</span>
</a>
<a className="flex items-center px-6 py-3 space-x-3 text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all duration-300 active:scale-95" href="#">
<span className="material-symbols-outlined" data-icon="calendar_today">calendar_today</span>
<span>Schedule</span>
</a>
<a className="flex items-center px-6 py-3 space-x-3 text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all duration-300 active:scale-95" href="#">
<span className="material-symbols-outlined" data-icon="analytics">analytics</span>
<span>Analytics</span>
</a>
<a className="flex items-center px-6 py-3 space-x-3 text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all duration-300 active:scale-95" href="#">
<span className="material-symbols-outlined" data-icon="settings">settings</span>
<span>Settings</span>
</a>
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
<div className="flex items-center space-x-3 p-2 rounded-lg bg-white/5">
<img alt="Doctor profile picture" className="w-10 h-10 rounded-full object-cover" data-alt="portrait of a professional male doctor in his 40s wearing a white lab coat with soft studio lighting and blue background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDToXoGkT6VSo6Zf1pTE_ckDGoVthDOIHrCqJAGuufiIH6J3QuXUFYyNo26caBbYolXujDNfvOvUCL_bRDoXmqktEBApTXB7xV9-Mgs1neCcUEnqwVqlFJSKuSm6lJWBQQ4oscNmYAeAEy9w4pOeVVdCz5i49CSozG7PX7T9jF_zeto0sVJVn_KXcZ5RpLTVbbCmY6M_O8SkDBusZ_K5nEcf_tfsxofRH62RgGwCPff1-CZ0v-atwqE_R-IWShXHaJwrUJGjdlPJZQ3"/>
<div className="overflow-hidden flex-1">
<p className="text-sm font-medium truncate">{doctorName}</p>
<p className="text-[10px] text-slate-400">{doctorDesignation}</p>
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
<button className="relative text-slate-400 hover:text-sky-200 transition-opacity duration-200">
<span className="material-symbols-outlined" data-icon="notifications">notifications</span>
<span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full border border-slate-950"></span>
</button>
<button className="text-slate-400 hover:text-sky-200 transition-opacity duration-200">
<span className="material-symbols-outlined" data-icon="account_circle">account_circle</span>
</button>
</div>
</header>
{/*  Main Content  */}
<main className="p-8 space-y-8 pb-24 md:pb-8">
{/*  Header Actions  */}
<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
<div>
<h2 className="text-2xl font-bold tracking-tight text-on-surface">Patients Overview</h2>
<p className="text-on-surface-variant text-sm">Managing 42 active recovery programs</p>
</div>
<div className="flex space-x-3">
<button className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-sky-300/30 text-sky-300 hover:bg-sky-300/10 transition-all font-medium text-sm">
<span className="material-symbols-outlined text-lg">person_add</span>
<span>Add Patient</span>
</button>
<button className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-sky-300 text-on-primary hover:bg-sky-200 transition-all font-semibold text-sm shadow-[0_0_20px_rgba(125,211,252,0.2)]">
<span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "\'FILL\' 1" }}>add_circle</span>
<span>Assign New Exercise</span>
</button>
</div>
</div>
<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
{/*  Main Grid  */}
<div className="lg:col-span-3 space-y-6">
<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
  {patients.length > 0 ? (
    patients.map((p) => (
      <div key={p.id} className="glass-panel p-5 rounded-xl hover:shadow-[0_0_30px_rgba(125,211,252,0.1)] transition-all group border border-white/5 bg-slate-900/40">
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-400 font-black border-2 border-sky-400/20">
             {p.name.charAt(0).toUpperCase()}
          </div>
          <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
            p.patientProfile?.severity === "severe" ? "bg-rose-500/10 text-rose-400" : "bg-sky-300/10 text-sky-300"
          }`}>
            {p.patientProfile?.condition || "General"}
          </span>
        </div>
        <h3 className="text-base font-bold text-on-surface">{p.name}</h3>
        <p className="text-[10px] text-on-surface-variant font-medium tracking-widest uppercase mt-0.5">AI Assigned: {p.assignedExercises?.length || 0} Exercises</p>
        
        <div className="mt-6 space-y-4">
           {/* Exercise List Mini */}
           <div className="space-y-1.5 opacity-60">
              {p.assignedExercises?.slice(0, 2).map((exId: string) => {
                 const ex = DUMMY_EXERCISES.find(e => e.id === exId);
                 return ex ? (
                    <div key={exId} className="flex items-center gap-2 text-[10px] font-medium text-slate-400">
                       <span className="material-symbols-outlined text-xs">check_circle</span>
                       <span className="truncate">{ex.name}</span>
                    </div>
                 ) : null;
              })}
           </div>

           <div className="space-y-2 pt-2 border-t border-white/5">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                <span className="text-on-surface-variant">Avg Accuracy</span>
                <span className="text-emerald-400">
                   {p.performanceHistory?.length 
                     ? Math.round(p.performanceHistory.reduce((a: any, b: any) => a + b.accuracy, 0) / p.performanceHistory.length)
                     : 0}%
                </span>
              </div>
              <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-400 h-full rounded-full transition-all duration-1000" 
                  style={{ width: `${p.performanceHistory?.length ? Math.round(p.performanceHistory.reduce((a: any, b: any) => a + b.accuracy, 0) / p.performanceHistory.length) : 0}%` }}
                />
              </div>
           </div>
        </div>
      </div>
    ))
  ) : (
    <div className="col-span-full border-2 border-dashed border-sky-300/10 rounded-2xl py-20 flex flex-col items-center justify-center text-slate-500 italic">
       <span className="material-symbols-outlined text-4xl mb-3 opacity-30">person_off</span>
       <p className="text-sm">No connected patients found.</p>
       <p className="text-[10px] mt-1 uppercase tracking-widest font-black">Share your code {doctorCode} to begin</p>
    </div>
  )}
  {/*  Add New Placeholder  */}
  <button onClick={() => setCodeCopied(true)} className="border-2 border-dashed border-sky-300/20 rounded-xl flex flex-col items-center justify-center p-6 text-slate-500 hover:border-sky-300/40 hover:text-sky-300 transition-all group cursor-pointer">
    <span className="material-symbols-outlined text-4xl mb-2 group-hover:scale-110 transition-transform">add_circle</span>
    <span className="text-sm font-medium">Add New Patient</span>
  </button>
</div>
</div>
{/*  Alerts Section  */}
<div className="lg:col-span-1 space-y-6">
<div className="glass-elevated p-6 rounded-2xl">
<div className="flex items-center space-x-2 mb-6">
<span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "\'FILL\' 1" }}>warning</span>
<h3 className="font-bold text-on-surface">Critical Alerts</h3>
</div>
<div className="space-y-4">
{/*  Alert 1  */}
<div className="p-4 rounded-xl bg-error-container/20 border border-error/20 flex space-x-3">
<div className="shrink-0 w-8 h-8 rounded-full bg-error/20 flex items-center justify-center text-error">
<span className="material-symbols-outlined text-sm">event_busy</span>
</div>
<div>
<p className="text-xs font-bold text-on-error-container">Missed Sessions (3+)</p>
<p className="text-[11px] text-on-surface-variant mt-1">Elena Rodriguez has not logged into the portal for 9 days.</p>
<button className="mt-2 text-[10px] font-bold text-error uppercase tracking-widest hover:underline">Reach Out</button>
</div>
</div>
{/*  Alert 2  */}
<div className="p-4 rounded-xl bg-tertiary-container/20 border border-tertiary/20 flex space-x-3">
<div className="shrink-0 w-8 h-8 rounded-full bg-tertiary/20 flex items-center justify-center text-tertiary">
<span className="material-symbols-outlined text-sm">insights</span>
</div>
<div>
<p className="text-xs font-bold text-on-tertiary-container">Low Form Accuracy</p>
<p className="text-[11px] text-on-surface-variant mt-1">Marcus Chen's overhead press accuracy dropped to 64% today.</p>
<button className="mt-2 text-[10px] font-bold text-tertiary uppercase tracking-widest hover:underline">Adjust Plan</button>
</div>
</div>
{/*  Alert 3  */}
<div className="p-4 rounded-xl bg-primary-container/20 border border-sky-300/20 flex space-x-3">
<div className="shrink-0 w-8 h-8 rounded-full bg-sky-300/20 flex items-center justify-center text-sky-300">
<span className="material-symbols-outlined text-sm">celebration</span>
</div>
<div>
<p className="text-xs font-bold text-on-primary-container">Goal Achieved</p>
<p className="text-[11px] text-on-surface-variant mt-1">David Kim completed his 4-week mobility streak.</p>
<button className="mt-2 text-[10px] font-bold text-sky-300 uppercase tracking-widest hover:underline">Send Kudos</button>
</div>
</div>
</div>
</div>
{/*  Quick Stats Bento  */}
<div className="grid grid-cols-2 gap-4">
<div className="glass-panel p-4 rounded-xl text-center">
<p className="text-slate-400 text-[10px] uppercase font-bold tracking-tighter">Avg Compliance</p>
<p className="text-2xl font-black text-sky-300">78%</p>
</div>
<div className="glass-panel p-4 rounded-xl text-center">
<p className="text-slate-400 text-[10px] uppercase font-bold tracking-tighter">Active Plans</p>
<p className="text-2xl font-black text-tertiary">34</p>
</div>
</div>
</div>
</div>
</main>
</div>
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

    </>
  );
}
