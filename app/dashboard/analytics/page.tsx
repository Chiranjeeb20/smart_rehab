"use client";
import { useState, useEffect } from "react";

export default function Page() {
  const [doctorName, setDoctorName] = useState("Dr. Sarah Chen");
  const [doctorDesignation, setDoctorDesignation] = useState("Physiotherapist");

  useEffect(() => {
    const savedName = localStorage.getItem("smart_rehab_doctor_name");
    const savedDesignation = localStorage.getItem("smart_rehab_designation");
    if (savedName) setDoctorName(`Dr. ${savedName}`);
    if (savedDesignation) setDoctorDesignation(savedDesignation);
  }, []);

  return (
    <>
      
{/*  SideNavBar  */}
<aside className="hidden md:flex flex-col h-screen w-64 border-r border-sky-300/10 bg-slate-950/60 backdrop-blur-xl shadow-[0_0_30px_rgba(125,211,252,0.05)] font-inter text-sm antialiased py-6">
<div className="px-6 mb-8">
<h1 className="text-xl font-semibold tracking-tight text-sky-300">Smart Rehab</h1>
<p className="text-slate-400 text-xs mt-1">Doctor Dashboard</p>
</div>
<nav className="flex-1 space-y-1 px-3">
<a className="flex items-center px-3 py-2.5 rounded-lg text-sky-300 font-semibold border-r-2 border-sky-300 bg-sky-300/5 transition-all duration-300" href="#">
<span className="material-symbols-outlined mr-3" data-icon="group">group</span>
<span>Patients</span>
</a>
<a className="flex items-center px-3 py-2.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all duration-300 active:scale-95" href="#">
<span className="material-symbols-outlined mr-3" data-icon="calendar_today">calendar_today</span>
<span>Schedule</span>
</a>
<a className="flex items-center px-3 py-2.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all duration-300 active:scale-95" href="#">
<span className="material-symbols-outlined mr-3" data-icon="analytics">analytics</span>
<span>Analytics</span>
</a>
<a className="flex items-center px-3 py-2.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all duration-300 active:scale-95" href="#">
<span className="material-symbols-outlined mr-3" data-icon="settings">settings</span>
<span>Settings</span>
</a>
</nav>
<div className="px-6 mt-auto flex items-center gap-3">
<img alt="Doctor profile picture" className="w-10 h-10 rounded-full border border-sky-300/20" data-alt="professional portrait of a medical doctor in a modern clinic setting with soft clinical lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_X1yx3tEPmtP1k7n_ERKlaYhmPy-Yo4SK3a2MFLhFW9QuABjk6Pu0vQrO_MAijlIkFeX8RE4Nq-iRSnd6muBodBWQ0WX1SaF5r2sYlYsaeRYLS-CcV4qLJ6en71TB8Jrfz0z47vUuS5xXMoLhHdDUYCvws1_cOkBJ5iYByB6PY65uQiScbG8DYH5I2aLfhwomF5DfAqNmOu9JB_KAZdEa_eozXHNZzFYRKYC1u_f5uX3RTWsWiIN8sQXVVrwQLZU0VWvHV-RoeXRD"/>
<div>
<p className="text-xs font-semibold text-on-surface">{doctorName}</p>
<p className="text-[10px] text-slate-500 uppercase tracking-wider">{doctorDesignation}</p>
</div>
</div>
</aside>
<div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
{/*  TopNavBar  */}
<header className="flex items-center justify-between px-8 w-full h-16 border-b border-sky-300/10 bg-slate-950/60 backdrop-blur-xl font-inter text-sm sticky top-0 z-40">
<div className="flex items-center gap-6">
<div className="md:hidden">
<span className="material-symbols-outlined text-sky-300" data-icon="menu">menu</span>
</div>
<div className="relative w-64">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg" data-icon="search">search</span>
<input className="w-full bg-slate-900/50 border border-sky-300/10 rounded-lg py-1.5 pl-10 pr-4 text-xs focus:ring-1 focus:ring-sky-300 focus:border-sky-300 outline-none transition-all" placeholder="Search patients..." type="text"/>
</div>
</div>
<div className="flex items-center gap-4">
<button className="text-slate-400 hover:text-sky-200 transition-opacity duration-200">
<span className="material-symbols-outlined" data-icon="notifications">notifications</span>
</button>
<button className="text-slate-400 hover:text-sky-200 transition-opacity duration-200">
<span className="material-symbols-outlined" data-icon="account_circle">account_circle</span>
</button>
</div>
</header>
{/*  Main Content Canvas  */}
<main className="flex-1 overflow-y-auto p-8 bg-[#0a0e1a]">
{/*  Breadcrumbs  */}
<div className="mb-6 flex items-center text-xs text-slate-500 font-medium">
<span>Patients</span>
<span className="material-symbols-outlined text-[14px] mx-2" data-icon="chevron_right">chevron_right</span>
<span className="text-sky-300">Analytics Drill-down</span>
</div>
{/*  Patient Header: Bento Section  */}
<div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
<div className="lg:col-span-3 glass-panel p-6 rounded-xl flex flex-col md:flex-row items-center md:items-start gap-8">
<div className="relative">
<img alt="Marcus V." className="w-32 h-32 rounded-2xl object-cover border-2 border-sky-300/20 ice-glow" data-alt="portrait of a 28 year old athletic male patient in casual attire with neutral grey background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7NE9z3zHewKUyLc0wJAl4k1Hng3iemZfya5znE5k2N2E-3iDigLVKiHc9LGNTSiqo1YI9I4GI5Lp5YHuc4NPfp7beBBFOt11bFOT9TyXlGLHL2iCQ2CSaK9H7ZBdLvG7kSTLwRsz04QyuVgwXKGHzQE7c09GL4wHL8Fzq6oJAcHnLBkE0BI656cidXaJGKkr8VfUs1JB5iROYrp7oS2XmUyrlDGwJIrZVuROcYu_ipvvjtJplLgCesrqnH76unrcyBHIQFBuXTEPI"/>
<div className="absolute -bottom-2 -right-2 bg-sky-500 text-on-primary text-[10px] font-bold px-2 py-1 rounded-full uppercase">Active</div>
</div>
<div className="flex-1 space-y-4">
<div>
<h2 className="text-2xl font-bold tracking-tight text-on-surface">Marcus V. Sterling</h2>
<p className="text-sky-300/80 text-sm font-medium">ACL Reconstruction Recovery Phase II</p>
</div>
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
<div className="space-y-1">
<span className="text-[10px] uppercase text-slate-500 tracking-widest">Age</span>
<p className="text-sm font-semibold">28 Years</p>
</div>
<div className="space-y-1">
<span className="text-[10px] uppercase text-slate-500 tracking-widest">Injury</span>
<p className="text-sm font-semibold">Left Knee ACL</p>
</div>
<div className="space-y-1">
<span className="text-[10px] uppercase text-slate-500 tracking-widest">Date of Injury</span>
<p className="text-sm font-semibold">Oct 14, 2023</p>
</div>
<div className="space-y-1">
<span className="text-[10px] uppercase text-slate-500 tracking-widest">Plan Duration</span>
<p className="text-sm font-semibold">12 Weeks</p>
</div>
</div>
</div>
</div>
<div className="glass-panel p-6 rounded-xl flex flex-col justify-between border-sky-300/20">
<div className="flex justify-between items-start">
<span className="text-[10px] uppercase text-slate-500 tracking-widest">Recovery Score</span>
<span className="material-symbols-outlined text-sky-300" data-icon="bolt">bolt</span>
</div>
<div className="text-center py-2">
<span className="text-5xl font-extrabold text-sky-300">84</span>
<span className="text-slate-400 text-sm font-medium">/100</span>
</div>
<div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
<div className="bg-sky-400 h-full w-[84%] shadow-[0_0_8px_rgba(125,211,252,0.4)]"></div>
</div>
<p className="text-[10px] text-center text-slate-500 mt-2">↑ 4% from last week</p>
</div>
</div>
{/*  Charts Section: Two Column Layout  */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
{/*  Line Chart: Exercise Accuracy  */}
<div className="glass-panel p-6 rounded-xl">
<div className="flex items-center justify-between mb-6">
<h3 className="text-sm font-semibold text-on-surface">Exercise Accuracy over time</h3>
<div className="flex gap-2">
<span className="px-2 py-0.5 rounded bg-sky-300/10 text-sky-300 text-[10px] font-bold">LATEST 92%</span>
</div>
</div>
<div className="h-48 flex items-end justify-between gap-1 relative px-2">
{/*  Simulated Line Chart with SVG  */}
<svg className="absolute inset-0 w-full h-full p-4" preserveAspectRatio="none" viewBox="0 0 400 100">
<path d="M0,80 Q50,60 100,70 T200,40 T300,30 T400,20" fill="none" stroke="#7dd3fc" strokeWidth="2"></path>
<circle cx="0" cy="80" fill="#7dd3fc" r="3"></circle>
<circle cx="400" cy="20" fill="#7dd3fc" r="3"></circle>
</svg>
<div className="w-full flex justify-between text-[9px] text-slate-600 mt-2 absolute bottom-0">
<span>WK 1</span><span>WK 2</span><span>WK 3</span><span>WK 4</span><span>WK 5</span><span>WK 6</span>
</div>
</div>
</div>
{/*  Consistency: Heatmap  */}
<div className="glass-panel p-6 rounded-xl">
<div className="flex items-center justify-between mb-6">
<h3 className="text-sm font-semibold text-on-surface">Workout Consistency</h3>
<span className="text-slate-500 text-[10px]">NOV - DEC 2023</span>
</div>
<div className="grid grid-cols-7 gap-2">
{/*  Heatmap Grid  */}
<div className="aspect-square bg-sky-300/40 rounded-sm"></div>
<div className="aspect-square bg-sky-300/10 rounded-sm"></div>
<div className="aspect-square bg-sky-300/60 rounded-sm"></div>
<div className="aspect-square bg-sky-300/80 rounded-sm"></div>
<div className="aspect-square bg-sky-300/20 rounded-sm"></div>
<div className="aspect-square bg-sky-300/90 rounded-sm"></div>
<div className="aspect-square bg-sky-300/10 rounded-sm"></div>
{/*  Next row  */}
<div className="aspect-square bg-sky-300/20 rounded-sm"></div>
<div className="aspect-square bg-sky-300/10 rounded-sm"></div>
<div className="aspect-square bg-sky-300/10 rounded-sm"></div>
<div className="aspect-square bg-sky-300/70 rounded-sm"></div>
<div className="aspect-square bg-sky-300/50 rounded-sm"></div>
<div className="aspect-square bg-sky-300/10 rounded-sm"></div>
<div className="aspect-square bg-sky-300/10 rounded-sm"></div>
{/*  Next row  */}
<div className="aspect-square bg-sky-300/10 rounded-sm"></div>
<div className="aspect-square bg-sky-300/40 rounded-sm"></div>
<div className="aspect-square bg-sky-300/90 rounded-sm"></div>
<div className="aspect-square bg-sky-300/10 rounded-sm"></div>
<div className="aspect-square bg-sky-300/10 rounded-sm"></div>
<div className="aspect-square bg-sky-300/80 rounded-sm"></div>
<div className="aspect-square bg-sky-300/30 rounded-sm"></div>
</div>
</div>
</div>
{/*  Bottom Content: Recent Sessions & Notes  */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
{/*  Recent Sessions List  */}
<div className="lg:col-span-2 glass-panel p-6 rounded-xl">
<h3 className="text-sm font-semibold text-on-surface mb-6">Recent Sessions</h3>
<div className="space-y-3">
<div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors">
<div className="flex items-center gap-4">
<div className="w-10 h-10 rounded-lg bg-sky-300/10 flex items-center justify-center">
<span className="material-symbols-outlined text-sky-300" data-icon="videocam">videocam</span>
</div>
<div>
<h4 className="text-sm font-medium">Lower Limb Stability</h4>
<p className="text-[10px] text-slate-500">Yesterday • 24 mins</p>
</div>
</div>
<div className="flex items-center gap-8">
<div className="text-right">
<span className="text-xs font-bold text-sky-300">92%</span>
<p className="text-[9px] text-slate-500 uppercase tracking-tighter">Score</p>
</div>
<div className="flex gap-2">
<button className="p-2 hover:bg-sky-300/20 rounded-full text-slate-400 hover:text-sky-300 transition-colors">
<span className="material-symbols-outlined text-lg" data-icon="visibility">visibility</span>
</button>
<button className="p-2 hover:bg-tertiary/20 rounded-full text-slate-400 hover:text-tertiary transition-colors">
<span className="material-symbols-outlined text-lg" data-icon="chat_bubble">chat_bubble</span>
</button>
</div>
</div>
</div>
<div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors">
<div className="flex items-center gap-4">
<div className="w-10 h-10 rounded-lg bg-sky-300/10 flex items-center justify-center">
<span className="material-symbols-outlined text-sky-300" data-icon="videocam">videocam</span>
</div>
<div>
<h4 className="text-sm font-medium">Mobility &amp; Flex</h4>
<p className="text-[10px] text-slate-500">Dec 12 • 32 mins</p>
</div>
</div>
<div className="flex items-center gap-8">
<div className="text-right">
<span className="text-xs font-bold text-sky-300">88%</span>
<p className="text-[9px] text-slate-500 uppercase tracking-tighter">Score</p>
</div>
<div className="flex gap-2">
<button className="p-2 hover:bg-sky-300/20 rounded-full text-slate-400 hover:text-sky-300 transition-colors">
<span className="material-symbols-outlined text-lg" data-icon="visibility">visibility</span>
</button>
<button className="p-2 hover:bg-tertiary/20 rounded-full text-slate-400 hover:text-tertiary transition-colors">
<span className="material-symbols-outlined text-lg" data-icon="chat_bubble">chat_bubble</span>
</button>
</div>
</div>
</div>
<div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors">
<div className="flex items-center gap-4">
<div className="w-10 h-10 rounded-lg bg-sky-300/10 flex items-center justify-center">
<span className="material-symbols-outlined text-sky-300" data-icon="videocam">videocam</span>
</div>
<div>
<h4 className="text-sm font-medium">Strength Protocol A</h4>
<p className="text-[10px] text-slate-500">Dec 10 • 45 mins</p>
</div>
</div>
<div className="flex items-center gap-8">
<div className="text-right">
<span className="text-xs font-bold text-sky-300">76%</span>
<p className="text-[9px] text-slate-500 uppercase tracking-tighter text-error">Low</p>
</div>
<div className="flex gap-2">
<button className="p-2 hover:bg-sky-300/20 rounded-full text-slate-400 hover:text-sky-300 transition-colors">
<span className="material-symbols-outlined text-lg" data-icon="visibility">visibility</span>
</button>
<button className="p-2 hover:bg-tertiary/20 rounded-full text-slate-400 hover:text-tertiary transition-colors">
<span className="material-symbols-outlined text-lg" data-icon="chat_bubble">chat_bubble</span>
</button>
</div>
</div>
</div>
</div>
</div>
{/*  Notes Section  */}
<div className="glass-panel-elevated p-6 rounded-xl flex flex-col border-sky-300/20">
<div className="flex items-center gap-2 mb-4">
<span className="material-symbols-outlined text-tertiary" data-icon="edit_note">edit_note</span>
<h3 className="text-sm font-semibold text-on-surface">Clinical Notes</h3>
</div>
<textarea className="flex-1 w-full bg-slate-900/40 border border-white/5 rounded-lg p-4 text-sm text-slate-300 placeholder:text-slate-600 focus:ring-1 focus:ring-tertiary focus:border-tertiary outline-none resize-none transition-all" placeholder="Type recommendations for the patient..."></textarea>
<button className="mt-4 w-full bg-tertiary-container text-tertiary hover:bg-tertiary hover:text-on-tertiary transition-all py-2 rounded-lg text-xs font-bold tracking-wide ice-glow">
                        SAVE RECOMMENDATIONS
                    </button>
</div>
</div>
</main>
</div>
{/*  BottomNavBar (Mobile only)  */}
<nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pt-3 pb-8 bg-slate-900/75 backdrop-blur-2xl border-t border-sky-300/15 font-inter text-[11px] font-medium shadow-[0_-4px_24px_rgba(0,0,0,0.4)]">
<a className="flex flex-col items-center justify-center text-sky-300 bg-sky-300/10 rounded-xl px-3 py-1 transition-transform active:scale-90" href="#">
<span className="material-symbols-outlined" data-icon="home">home</span>
<span>Home</span>
</a>
<a className="flex flex-col items-center justify-center text-slate-400 hover:bg-white/5 transition-transform active:scale-90" href="#">
<span className="material-symbols-outlined" data-icon="fitness_center">fitness_center</span>
<span>Exercises</span>
</a>
<a className="flex flex-col items-center justify-center text-slate-400 hover:bg-white/5 transition-transform active:scale-90" href="#">
<span className="material-symbols-outlined" data-icon="trending_up">trending_up</span>
<span>Progress</span>
</a>
<a className="flex flex-col items-center justify-center text-slate-400 hover:bg-white/5 transition-transform active:scale-90" href="#">
<span className="material-symbols-outlined" data-icon="chat">chat</span>
<span>Chat</span>
</a>
</nav>

    </>
  );
}
