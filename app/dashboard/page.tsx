
export default function Page() {
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
<div className="px-6 mt-auto">
<div className="flex items-center space-x-3 p-2 rounded-lg bg-white/5">
<img alt="Doctor profile picture" className="w-10 h-10 rounded-full object-cover" data-alt="portrait of a professional male doctor in his 40s wearing a white lab coat with soft studio lighting and blue background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDToXoGkT6VSo6Zf1pTE_ckDGoVthDOIHrCqJAGuufiIH6J3QuXUFYyNo26caBbYolXujDNfvOvUCL_bRDoXmqktEBApTXB7xV9-Mgs1neCcUEnqwVqlFJSKuSm6lJWBQQ4oscNmYAeAEy9w4pOeVVdCz5i49CSozG7PX7T9jF_zeto0sVJVn_KXcZ5RpLTVbbCmY6M_O8SkDBusZ_K5nEcf_tfsxofRH62RgGwCPff1-CZ0v-atwqE_R-IWShXHaJwrUJGjdlPJZQ3"/>
<div className="overflow-hidden">
<p className="text-sm font-medium truncate">Dr. Aris Thorne</p>
<p className="text-[10px] text-slate-400">Chief of Orthopedics</p>
</div>
</div>
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
{/*  Patient Card 1  */}
<div className="glass-panel p-5 rounded-xl hover:shadow-[0_0_30px_rgba(125,211,252,0.1)] transition-all group">
<div className="flex justify-between items-start mb-4">
<img alt="Sarah Jenkins" className="w-12 h-12 rounded-full object-cover border-2 border-sky-300/20" data-alt="portrait of a middle-aged woman with friendly expression in a neutral studio setting with soft natural lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwupnbaE1X9DNfnhPgrohJKTc11ZRawY9iAwAlFNTyHL5uDfDeN7Ev33abEuitH2Ru5AvAH19tj-a-HIKBoni3K4a1rQqpzD1rPMCcmjeaMAsvVvOsN9DJICdjVJHuG5hopdL0ydIjNk7NPl6I7i9kq78eH4aY0k0NmT7Gb2V0Gz0Ru7Plguuj5Y2fgc1Mr4Ko_0iy18rh5TzB9a_rgwa-z11WzH64epTAUufyMZGL4E4iXSR7XB-AK1FOIMyP4LSuA8RwnW2kzLjA"/>
<span className="bg-sky-300/10 text-sky-300 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">ACL Tear</span>
</div>
<h3 className="text-lg font-bold text-on-surface">Sarah Jenkins</h3>
<p className="text-xs text-on-surface-variant mb-6">Last Session: Oct 24, 2023</p>
<div className="space-y-2">
<div className="flex justify-between text-xs font-medium">
<span className="text-on-surface-variant">Compliance</span>
<span className="text-sky-300">92%</span>
</div>
<div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
<div className="bg-sky-300 h-full w-[92%] rounded-full"></div>
</div>
</div>
</div>
{/*  Patient Card 2  */}
<div className="glass-panel p-5 rounded-xl hover:shadow-[0_0_30px_rgba(125,211,252,0.1)] transition-all group">
<div className="flex justify-between items-start mb-4">
<img alt="Marcus Chen" className="w-12 h-12 rounded-full object-cover border-2 border-sky-300/20" data-alt="headshot of a young athletic man with short hair looking confidently at the camera in soft daylight" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWEv-noDOTZrH3PSdhQsBoelH6HL1VfhluFJyYIz2rWqN-Ryw2BZd7Ltw922aG2d2FHQCyZAk6Xz7ZJIYH0L7s22yAAbVVh0O0-IkfldoprZ5fAaxW-lvQXsIdF6QlziiQAlQLhqg6xuHrhHv25Obzltt5Ma_a_PY8Pbh3Z02GpIlm6krmUi_eL8sVAI_p4bKsjf0Zivl53VfcJ4ZPO21CtX64CbvD9PnRf-vVb3oYv1-3w5hJQnjteRp9EgqvduvcYndG72LsQ-Ei"/>
<span className="bg-tertiary/10 text-tertiary text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">Rotator Cuff</span>
</div>
<h3 className="text-lg font-bold text-on-surface">Marcus Chen</h3>
<p className="text-xs text-on-surface-variant mb-6">Last Session: Oct 22, 2023</p>
<div className="space-y-2">
<div className="flex justify-between text-xs font-medium">
<span className="text-on-surface-variant">Compliance</span>
<span className="text-tertiary">88%</span>
</div>
<div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
<div className="bg-tertiary h-full w-[88%] rounded-full"></div>
</div>
</div>
</div>
{/*  Patient Card 3  */}
<div className="glass-panel p-5 rounded-xl hover:shadow-[0_0_30px_rgba(125,211,252,0.1)] transition-all group border-error/20">
<div className="flex justify-between items-start mb-4">
<img alt="Elena Rodriguez" className="w-12 h-12 rounded-full object-cover border-2 border-error/20" data-alt="portrait of a young woman with curly hair smiling gently, warm lighting and soft blue highlights" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVd61dYoHH9Cg6n-AvjgaRtA-3Mb-GWi-nJ5GHMm3yO-GS6qdvj5pZK3SQzAzJUcTqVTy8dql5yDxwRz2xo7SMTQ3YMmIfl4CJVhTTYnKhDHGBzVSDPalr8cIAYXvqDV-0YAIqch8ZXRe95VR30drhckBZo6t-zGk1AaY-WRwVpQShhC93msOG4GKWlqhe1LI5Wdu6F7z-KVrQOeNH_Avu93H9Pc6HECfjzZmDIUrxTDcEHCmvC5n6BEgRHKgYGF-h8lHExhalmMob"/>
<span className="bg-error/10 text-error text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">Spinal Fusion</span>
</div>
<h3 className="text-lg font-bold text-on-surface">Elena Rodriguez</h3>
<p className="text-xs text-on-surface-variant mb-6">Last Session: Oct 15, 2023</p>
<div className="space-y-2">
<div className="flex justify-between text-xs font-medium">
<span className="text-on-surface-variant">Compliance</span>
<span className="text-error">42%</span>
</div>
<div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
<div className="bg-error h-full w-[42%] rounded-full"></div>
</div>
</div>
</div>
{/*  Patient Card 4  */}
<div className="glass-panel p-5 rounded-xl hover:shadow-[0_0_30px_rgba(125,211,252,0.1)] transition-all group">
<div className="flex justify-between items-start mb-4">
<img alt="David Kim" className="w-12 h-12 rounded-full object-cover border-2 border-sky-300/20" data-alt="close up professional headshot of a smiling man with glasses, professional lighting on clean background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCo95xDAQc2tjPhySWB7ggS3o79uEay-t4K1TPm5talfCSE6vZemFhP3wgW1cJ3NWTEg3EGSfd-yqOtQdcgExg4CPv2ZFzExlxcr9bwAFx4QvLiGBOBbez55oo7OqACNHk5FNdQu816rgX9LZ4ZXNMjxOosbxiBxSvs_FVhmb0ZnzLpzjJBrnRj5ozWB_4whyVj_ZiPlHxmH5e6ycPsPq3mfiT0r5um5CfDePBVUBM4PzCXCfzjQ2Nk3_N9lUetYWZRmoVmZo_3p6PV"/>
<span className="bg-sky-300/10 text-sky-300 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">Ankle Fracture</span>
</div>
<h3 className="text-lg font-bold text-on-surface">David Kim</h3>
<p className="text-xs text-on-surface-variant mb-6">Last Session: Oct 25, 2023</p>
<div className="space-y-2">
<div className="flex justify-between text-xs font-medium">
<span className="text-on-surface-variant">Compliance</span>
<span className="text-sky-300">95%</span>
</div>
<div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
<div className="bg-sky-300 h-full w-[95%] rounded-full"></div>
</div>
</div>
</div>
{/*  Add New Placeholder  */}
<button className="border-2 border-dashed border-sky-300/20 rounded-xl flex flex-col items-center justify-center p-6 text-slate-500 hover:border-sky-300/40 hover:text-sky-300 transition-all group">
<span className="material-symbols-outlined text-4xl mb-2 group-hover:scale-110 transition-transform">add_circle</span>
<span className="text-sm font-medium">New Patient File</span>
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
