
export default function Page() {
  return (
    <>
      
{/*  Camera Preview Fullscreen  */}
<div className="fixed inset-0 z-0 overflow-hidden">
<img alt="Fitness enthusiast performing overhead reach exercise in a bright modern home gym environment" className="w-full h-full object-cover grayscale-[0.2]" data-alt="Young man performing a physical therapy exercise in front of a neutral wall with soft natural window lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDexvJzxWL9kdtX7PfPxroPREN6Ce5UPEaU5smmnjgXqtoZRLL-fYVd3COOgOG6P9cTK4384IvytllvmfD1cbI5Y_xAXv08nxzUMsu7b4SxfJ0xyS8p5W9m2G74ew9XpMTzP62igSJuUstjZZ6oHh4lsttfQowy1LUAYfbMMCYeCI6l7IruFtLCLEmR_Tl0wM6j1XlBb9V9vRorGJ0hNWzJhQ2Kb9fiRMOCqcAmEGBQbDnar_q9c54cXmWV7i1J8qbxc9HX6sINM8dz"/>
{/*  Digital Skeletal Overlay (SVG)  */}
<svg className="absolute inset-0 w-full h-full z-10" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1000 1000">
{/*  Simplified Stick Figure Overlay for AI Tracking Visualization  */}
<g className="opacity-90">
{/*  Spine  */}
<line className="skeletal-line" x1="500" x2="500" y1="350" y2="550"></line>
{/*  Shoulders  */}
<line className="skeletal-line" x1="420" x2="580" y1="370" y2="370"></line>
{/*  Left Arm (The problematic one)  */}
<line className="skeletal-line stroke-error" style={{ filter: 'drop-shadow(0 0 8px #ff6b6b)' }} x1="420" x2="350" y1="370" y2="280"></line>
<line className="skeletal-line stroke-error" style={{ filter: 'drop-shadow(0 0 8px #ff6b6b)' }} x1="350" x2="310" y1="280" y2="200"></line>
{/*  Right Arm  */}
<line className="skeletal-line" x1="580" x2="650" y1="370" y2="280"></line>
<line className="skeletal-line" x1="650" x2="690" y1="280" y2="200"></line>
{/*  Joints  */}
<circle className="skeletal-joint" cx="500" cy="320" r="25"></circle> {/*  Head  */}
<circle className="skeletal-joint" cx="420" cy="370" r="8"></circle> {/*  L Shoulder  */}
<circle className="skeletal-joint" cx="580" cy="370" r="8"></circle> {/*  R Shoulder  */}
<circle className="skeletal-joint fill-error" cx="350" cy="280" r="8"></circle> {/*  L Elbow  */}
<circle className="skeletal-joint" cx="650" cy="280" r="8"></circle> {/*  R Elbow  */}
</g>
{/*  Angle Indicator  */}
<path d="M 420 370 L 350 370 A 70 70 0 0 0 350 280" fill="none" stroke="#ff6b6b" strokeDasharray="4" strokeWidth="2"></path>
<text fill="#ff6b6b" fontFamily="Inter" fontSize="16" fontWeight="bold" x="310" y="340">80° (Needs 90°)</text>
</svg>
{/*  Subtle scanning effect lines  */}
<div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5 pointer-events-none"></div>
</div>
{/*  UI Overlays  */}
<div className="relative z-20 h-screen flex flex-col justify-between p-6 md:p-10 pointer-events-none">
{/*  Top Section: Status Banner  */}
<div className="w-full flex justify-center pointer-events-auto">
<div className="glass-panel rounded-2xl px-8 py-4 flex items-center gap-4 border-l-4 border-l-error shadow-2xl max-w-lg w-full">
<div className="bg-error/20 p-2 rounded-full flex items-center justify-center">
<span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "\'FILL\' 1" }}>warning</span>
</div>
<div className="flex flex-col">
<span className="text-xs uppercase tracking-widest font-bold text-on-surface-variant">Real-time Feedback</span>
<span className="text-lg font-semibold text-on-surface">Raise your left arm 10�� higher</span>
</div>
</div>
</div>
{/*  Middle Section: Reps and Progress  */}
<div className="w-full flex flex-col items-center gap-6">
{/*  Rep Counter Card  */}
<div className="glass-panel rounded-3xl p-6 flex flex-col items-center gap-2 pointer-events-auto shadow-[0_0_40px_rgba(0,0,0,0.3)]">
<span className="text-sm font-medium text-primary uppercase tracking-[0.2em]">Repetitions</span>
<div className="flex items-baseline gap-1">
<span className="text-7xl font-extrabold text-on-surface tracking-tighter">8</span>
<span className="text-2xl font-semibold text-on-surface-variant">/ 12</span>
</div>
{/*  Progress Bar  */}
<div className="w-48 h-2 bg-surface-container-highest rounded-full mt-4 overflow-hidden">
<div className="h-full bg-primary shadow-[0_0_15px_rgba(125,211,252,0.5)] rounded-full" style={{ width: '66.6%' }}></div>
</div>
</div>
{/*  Side Metrics (AI Analytics)  */}
<div className="flex gap-4 pointer-events-auto">
<div className="glass-panel px-4 py-2 rounded-full flex items-center gap-2">
<span className="material-symbols-outlined text-tertiary text-sm">timer</span>
<span className="text-xs font-semibold text-on-surface">02:14</span>
</div>
<div className="glass-panel px-4 py-2 rounded-full flex items-center gap-2">
<span className="material-symbols-outlined text-primary text-sm">bolt</span>
<span className="text-xs font-semibold text-on-surface">Form: 92%</span>
</div>
</div>
</div>
{/*  Bottom Section: Controls  */}
<div className="w-full flex justify-between items-end pointer-events-auto">
{/*  Exit Button  */}
<button className="glass-panel h-16 w-16 md:h-20 md:w-20 rounded-full flex items-center justify-center text-on-surface hover:bg-error/20 hover:border-error/50 transition-all duration-300 active:scale-90 group">
<span className="material-symbols-outlined text-3xl group-hover:text-error transition-colors">close</span>
<span className="sr-only">Exit</span>
</button>
{/*  Exercise Info Center  */}
<div className="hidden md:flex glass-panel px-6 py-3 rounded-2xl flex-col items-center mb-2">
<span className="text-[10px] uppercase font-bold text-primary tracking-widest">Active Routine</span>
<span className="text-sm font-semibold">Bilateral Shoulder Flexion</span>
</div>
{/*  Pause Button  */}
<button className="glass-panel h-16 w-16 md:h-20 md:w-20 rounded-full flex items-center justify-center text-on-surface bg-primary/10 border-primary/30 hover:bg-primary/20 transition-all duration-300 active:scale-90 group shadow-lg">
<span className="material-symbols-outlined text-3xl text-primary" style={{ fontVariationSettings: "\'FILL\' 1" }}>pause</span>
<span className="sr-only">Pause</span>
</button>
</div>
</div>
{/*  Subtle Vignette and Grid Overlay  */}
<div className="fixed inset-0 pointer-events-none border-[12px] border-surface/20 z-30"></div>
<div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(10,14,26,0.4)_100%)] z-10"></div>
{/*  Calibration Corners  */}
<div className="fixed top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-primary/40 pointer-events-none z-30"></div>
<div className="fixed top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-primary/40 pointer-events-none z-30"></div>
<div className="fixed bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-primary/40 pointer-events-none z-30"></div>
<div className="fixed bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-primary/40 pointer-events-none z-30"></div>

    </>
  );
}
