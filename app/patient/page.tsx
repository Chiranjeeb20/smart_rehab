
export default function Page() {
  return (
    <>
      
<header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md px-6 py-6">
<div className="flex justify-between items-center">
<div>
<h1 className="text-on-surface-variant text-sm font-medium tracking-wide uppercase">Good morning, Alex.</h1>
<p className="text-2xl font-bold text-on-surface mt-1">Let's start your recovery.</p>
</div>
<div className="relative">
<div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20">
<img alt="User Profile" className="w-full h-full object-cover" data-alt="Portrait of a young man with a friendly expression in soft natural lighting against a blurred outdoor background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC09CPZc21DdeGDGo2WQRFmTEyZ4KD_BoWdcX_ip6FYJxglQF_rC3D-TuCBTDrxqFz6C2Ckjpuf_RZRmy5ouxY__2kvpsCGo2-jPbIKYseW3x-_X_qhSfMbbkLnZtxwVwIpcZQ3K2YSqVIu6OI5hBs0O69QMnV0kjxkiiC3IlWjl8LL3RtFdRG0Xje06I_PicNEQ8JEyWbjI-z25LAKoROTs1SEpCDvs3qCcdm9Ss_SK1QlFS9qhfzsyuoMLCRtFDC5tQ9YC5nzPmNB"/>
</div>
<span className="absolute bottom-0 right-0 w-3 h-3 bg-primary rounded-full border-2 border-background"></span>
</div>
</div>
</header>
<main className="px-6 space-y-8">
<section className="grid grid-cols-1 md:grid-cols-2 gap-4">
<div className="glass-card p-6 rounded-xl flex flex-col justify-between relative overflow-hidden group">
<div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors"></div>
<div className="relative z-10">
<h2 className="text-on-surface-variant font-medium text-sm">Daily Goal Completion</h2>
<div className="mt-4 flex items-center justify-between">
<div className="relative w-28 h-28">
<svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
<circle className="stroke-surface-container-highest" cx="18" cy="18" fill="none" r="15.915" strokeWidth="3"></circle>
<circle className="stroke-primary" cx="18" cy="18" fill="none" r="15.915" strokeDasharray="65 100" strokeLinecap="round" strokeWidth="3"></circle>
</svg>
<div className="absolute inset-0 flex items-center justify-center">
<span className="text-xl font-bold text-primary">65%</span>
</div>
</div>
<div className="flex-1 ml-6 space-y-2">
<div className="flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-primary"></span>
<p className="text-sm">4 of 6 Completed</p>
</div>
<div className="flex items-center gap-2 text-on-surface-variant">
<span className="w-2 h-2 rounded-full bg-surface-container-highest"></span>
<p className="text-sm">2 Remaining</p>
</div>
</div>
</div>
</div>
</div>
<div className="glass-card p-6 rounded-xl flex flex-col justify-center space-y-4">
<div className="flex items-center gap-4">
<div className="w-12 h-12 rounded-lg bg-tertiary-container flex items-center justify-center text-tertiary">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "\'FILL\' 1" }}>bolt</span>
</div>
<div>
<p className="text-sm text-on-surface-variant">Current Streak</p>
<p className="text-lg font-bold">12 Days</p>
</div>
</div>
<div className="h-px bg-outline-variant/30"></div>
<div className="flex items-center gap-4">
<div className="w-12 h-12 rounded-lg bg-secondary-container flex items-center justify-center text-secondary">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "\'FILL\' 1" }}>calendar_month</span>
</div>
<div>
<p className="text-sm text-on-surface-variant">Next Session</p>
<p className="text-lg font-bold">Today, 2:00 PM</p>
</div>
</div>
</div>
</section>
<section className="space-y-4">
<div className="flex items-center justify-between">
<h3 className="text-xl font-bold tracking-tight">Today's Task List</h3>
<button className="text-primary text-sm font-medium px-2 py-1">View All</button>
</div>
<div className="space-y-3">
<div className="glass-elevated p-4 rounded-xl flex items-center gap-4 group active:scale-[0.98] transition-transform">
<div className="w-14 h-14 rounded-lg overflow-hidden bg-surface-container flex-shrink-0">
<img alt="Knee Extension Exercise" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" data-alt="Close up of a person performing a controlled leg extension exercise in a modern gym setting with soft lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4gKtkNPv_bbUOBSzpxVYHt1A-h_Z0FTyYeYaLZkCu3JIwCKtCss4ExhREM3ON6IAG7kwK1q-APe06hcRVW_fmE7_hZ8ulSUW95viI5hHwSPfELK2V5lhvzVCpe08BcwbyEbXPHZSjsnhF5It37I0S2GhqOeWiidUBdpTIOWGTTAYZ74obs8aGvcdRTUEDJfTvNfc2vZQkdwoJA0kDwcXfFS08DcvWT5x58Pw3Hscmm9cxmrYgIGOG_BImW9JAlMYf7cKMoVjD_oME"/>
</div>
<div className="flex-1">
<h4 className="font-semibold text-on-surface">Knee Extensions</h4>
<p className="text-sm text-on-surface-variant">3 sets • 12 reps</p>
</div>
<div className="w-8 h-8 rounded-full border-2 border-primary/40 flex items-center justify-center text-primary">
<span className="material-symbols-outlined text-xl">play_arrow</span>
</div>
</div>
<div className="glass-card p-4 rounded-xl flex items-center gap-4 group opacity-70">
<div className="w-14 h-14 rounded-lg overflow-hidden bg-surface-container flex-shrink-0">
<img alt="Wall Slides Exercise" className="w-full h-full object-cover" data-alt="Person demonstrating a wall slide physical therapy exercise against a clean white wall with soft ambient light" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2gMzVo9LTq8eX-mdL-ed58w0UhD2NcXv8H1At9j4BqkJEi0MNGGr7JcJzh9UbFAz95zukuuAV-wlVq0BPj6LHDw-0HP0B0PrN-SsdeZPL-y1ibysE8s_1e2ixXgNZxPIn9p089ZsWhFVUWXHoR6F5Ivnwz_TjMLm5EIducbqaQQPu2xBw8ukW31Kyrb-v3Opzzx6hU3q8my5UpmnaHAJAL10ZVp9gCOv_-vPdK8YsfKAx13au3Axid1D4b92wh104swXl_vLlr-Nx"/>
</div>
<div className="flex-1">
<h4 className="font-semibold text-on-surface line-through">Wall Slides</h4>
<p className="text-sm text-on-surface-variant">2 sets • 10 reps</p>
</div>
<div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary">
<span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "\'FILL\' 1" }}>check</span>
</div>
</div>
<div className="glass-elevated p-4 rounded-xl flex items-center gap-4 group active:scale-[0.98] transition-transform">
<div className="w-14 h-14 rounded-lg overflow-hidden bg-surface-container flex-shrink-0">
<img alt="Ankle Pumps" className="w-full h-full object-cover opacity-80" data-alt="Macro focus on a foot performing ankle pump exercises on a yoga mat with cool blue aesthetic lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdxctbFSmx458nIxNSRAmD62J9NM6gGifGDAaQ8OArSCwlzlOLKIrKaZXdbOSAEiI_oQnkxyyRWkK_zTQhsU1TNRdRhz8mjhbm5GfAL9nOC8uxb-sit7Bj5l8ejtVpM8M264yNIsX7Y7V5hmOYCk6_iUVDsSHW5hXiCff6uWCVF2RLfKtDH0_Cg6ehDSjZYTe-LcoOAQRMELDMMjLlZc-Z8XHXRNa9zFAWg-fsoPq-4s8XAo0NHiZvBeR-OPg9hsPBMuCx7ERojQpm"/>
</div>
<div className="flex-1">
<h4 className="font-semibold text-on-surface">Ankle Pumps</h4>
<p className="text-sm text-on-surface-variant">3 sets • 20 reps</p>
</div>
<div className="w-8 h-8 rounded-full border-2 border-primary/40 flex items-center justify-center text-primary">
<span className="material-symbols-outlined text-xl">play_arrow</span>
</div>
</div>
</div>
</section>
<section className="glass-card rounded-xl p-6 relative overflow-hidden">
<div className="relative z-10 flex flex-col items-center text-center space-y-4">
<div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary">
<span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "\'FILL\' 1" }}>clinical_notes</span>
</div>
<h3 className="text-lg font-bold">Feedback needed</h3>
<p className="text-sm text-on-surface-variant">Your therapist has requested an update on your pain levels from yesterday's session.</p>
<button className="w-full py-3 bg-primary text-on-primary font-bold rounded-lg shadow-lg shadow-primary/20 active:scale-95 transition-transform">
                    Complete Survey
                </button>
</div>
<div className="absolute -bottom-12 -right-12 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
</section>
</main>
<nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pt-3 pb-8 bg-slate-900/75 backdrop-blur-2xl border-t border-sky-300/15 shadow-[0_-4px_24px_rgba(0,0,0,0.4)] rounded-t-3xl">
<a className="flex flex-col items-center justify-center text-sky-300 bg-sky-300/10 rounded-xl px-3 py-1 active:scale-90 transition-transform" href="#">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "\'FILL\' 1" }}>home</span>
<span className="font-inter text-[11px] font-medium mt-1">Home</span>
</a>
<a className="flex flex-col items-center justify-center text-slate-400 hover:bg-white/5 active:scale-90 transition-transform px-3 py-1" href="#">
<span className="material-symbols-outlined">fitness_center</span>
<span className="font-inter text-[11px] font-medium mt-1">Exercises</span>
</a>
<a className="flex flex-col items-center justify-center text-slate-400 hover:bg-white/5 active:scale-90 transition-transform px-3 py-1" href="#">
<span className="material-symbols-outlined">trending_up</span>
<span className="font-inter text-[11px] font-medium mt-1">Progress</span>
</a>
<a className="flex flex-col items-center justify-center text-slate-400 hover:bg-white/5 active:scale-90 transition-transform px-3 py-1" href="#">
<span className="material-symbols-outlined">chat</span>
<span className="font-inter text-[11px] font-medium mt-1">Chat</span>
</a>
</nav>

    </>
  );
}
