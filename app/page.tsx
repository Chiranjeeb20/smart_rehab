import Link from "next/link";
import HowItWorksCarousel from "./components/HowItWorksCarousel";
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-on-surface overflow-x-hidden selection:bg-primary/30">
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-tertiary/10 blur-[120px]"></div>
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-secondary/10 blur-[100px]"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-50 flex items-center justify-between px-6 md:px-12 py-6 border-b border-white/5 bg-background/50 backdrop-blur-xl sticky top-0">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-3xl">ecg_heart</span>
          <span className="text-xl font-bold tracking-tight text-on-surface">Smart Rehab</span>
        </div>
        
        <div className="hidden md:flex gap-8 text-sm font-medium text-on-surface-variant">
          <a href="#services" className="hover:text-primary transition-colors">Services</a>
          <a href="#how-it-works" className="hover:text-primary transition-colors">How it Works</a>
          <a href="#benefits" className="hover:text-primary transition-colors">Benefits</a>
        </div>

        <Link 
          href="/login" 
          className="bg-primary/10 border border-primary/30 text-primary hover:bg-primary hover:text-on-primary px-6 py-2.5 rounded-full font-semibold transition-all shadow-[0_0_15px_rgba(125,211,252,0.1)] hover:shadow-[0_0_25px_rgba(125,211,252,0.3)] text-sm"
        >
          Sign In
        </Link>
      </nav>

      <main className="relative z-10">
        
        {/* Hero Section */}
        <section className="px-6 md:px-12 pt-24 pb-32 flex flex-col items-center text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-tertiary/30 bg-tertiary/10 text-tertiary text-xs font-bold uppercase tracking-widest mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-tertiary"></span>
            </span>
            Next-Gen Physical Therapy
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
            Accelerate your recovery with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-tertiary">AI-Guided</span> precision.
          </h1>
          
          <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto mb-12 leading-relaxed">
            Connect with top specialists remotely. Our advanced AI camera tracks your posture in real-time, ensuring every exercise is performed safely, correctly, and effectively from the comfort of home.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto justify-center">
            <Link 
              href="/login" 
              className="bg-primary text-on-primary px-8 py-4 rounded-full font-bold text-lg hover:scale-105 hover:bg-primary-fixed transition-all shadow-[0_0_30px_rgba(125,211,252,0.25)] flex items-center justify-center gap-2"
            >
              Get Started Now
              <span className="material-symbols-outlined text-xl">arrow_forward</span>
            </Link>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="px-6 md:px-12 py-24 bg-surface-container-lowest/50 border-y border-white/5 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Comprehensive Therapy Services</h2>
              <p className="text-on-surface-variant max-w-2xl mx-auto">Everything you need to complete your physical therapy journey successfully without stepping into a clinic.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Service 1 */}
              <div className="glass-panel p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300 group shadow-lg">
                <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-primary text-3xl">accessibility_new</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Real-Time AI Posture</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">Our clinical-grade AI analyzes your joints through your device's camera, providing instant visual and audio feedback to correct your form.</p>
              </div>

              {/* Service 2 */}
              <div className="glass-elevated p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300 group shadow-xl border-primary/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                  <span className="material-symbols-outlined text-9xl text-primary">monitoring</span>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-tertiary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-tertiary text-3xl">assignment</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Custom Treatment Plans</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">Doctors build and adjust your daily video-guided exercise routines dynamically based on your ongoing performance data.</p>
              </div>

              {/* Service 3 */}
              <div className="glass-panel p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300 group shadow-lg">
                <div className="w-14 h-14 rounded-2xl bg-error/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-error text-3xl">insert_chart</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Progress Analytics</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">Track your range of motion, adherence rate, and pain levels over time with beautiful, easy-to-understand progress dashboards.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="px-6 md:px-12 py-32 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">How Smart Rehab Works</h2>
              <p className="text-on-surface-variant text-lg mb-12">Three simple steps to bridge the gap between clinical visits and at-home recovery.</p>

              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold font-headline shadow-[0_0_15px_rgba(125,211,252,0.4)]">1</div>
                    <div className="flex-1 w-px bg-white/10 my-2"></div>
                  </div>
                  <div className="pb-4">
                    <h4 className="text-xl font-bold mb-2">Connect & Receive Plan</h4>
                    <p className="text-on-surface-variant text-sm">Sign up and pair with your doctor to receive your personalized daily exercise assignments directly in the app.</p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-tertiary text-on-primary flex items-center justify-center font-bold font-headline shadow-[0_0_15px_rgba(200,160,240,0.4)]">2</div>
                    <div className="flex-1 w-px bg-white/10 my-2"></div>
                  </div>
                  <div className="pb-4">
                    <h4 className="text-xl font-bold mb-2">Execute with AI Guidance</h4>
                    <p className="text-on-surface-variant text-sm">Prop up your phone. The AI camera will overlay your skeletal positioning and count your reps only when form is perfect.</p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-surface-bright text-on-surface flex items-center justify-center font-bold font-headline border border-white/10">3</div>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Recover & Review</h4>
                    <p className="text-on-surface-variant text-sm">Your doctor reviews your analytics dashboard remotely, tweaking your recovery plan to ensure the fastest, safest healing possible.</p>
                  </div>
                </div>
              </div>
            </div>

            <HowItWorksCarousel />
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="px-6 md:px-12 py-24 bg-surface-container-lowest/30 border-t border-white/5 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Why Choose Smart Rehab?</h2>
              <p className="text-on-surface-variant max-w-2xl mx-auto text-lg">Experience the future of physical therapy with our distinct core benefits.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
              {/* Benefit 1 */}
              <div className="glass-panel p-8 rounded-2xl hover:bg-white/5 hover:-translate-y-1 transition-all duration-300 group flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 shrink-0 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-primary text-2xl">sports_gymnastics</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Real-time AI posture correction</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed">Instant form feedback ensures precision for every movement, exactly like having a therapist next to you.</p>
                </div>
              </div>

              {/* Benefit 2 */}
              <div className="glass-panel p-8 rounded-2xl hover:bg-white/5 hover:-translate-y-1 transition-all duration-300 group flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-tertiary/20 shrink-0 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-tertiary text-2xl">note_alt</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Personalized therapy plans</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed">Exercises custom-tailored to your exact injury and progressive capabilities.</p>
                </div>
              </div>

              {/* Benefit 3 */}
              <div className="glass-panel p-8 rounded-2xl hover:bg-white/5 hover:-translate-y-1 transition-all duration-300 group flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/20 shrink-0 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-secondary text-2xl">stethoscope</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Remote doctor monitoring</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed">Submit your daily sessions directly to your clinician for remote review without scheduling a clinic visit.</p>
                </div>
              </div>

              {/* Benefit 4 */}
              <div className="glass-panel p-8 rounded-2xl hover:bg-white/5 hover:-translate-y-1 transition-all duration-300 group flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-error/20 shrink-0 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-error text-2xl">query_stats</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Faster recovery tracking</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed">Visualize your consistency and functional range-of-motion improvements with robust analytics.</p>
                </div>
              </div>

              {/* Benefit 5 */}
              <div className="glass-panel p-8 rounded-2xl hover:bg-white/5 hover:-translate-y-1 transition-all duration-300 group flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-container shrink-0 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-on-primary-container text-2xl">home</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Convenience of home</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed">Completely skip the commute and waiting room. Do your therapy on your own schedule directly from home.</p>
                </div>
              </div>

              {/* Benefit 6 */}
              <div className="glass-panel p-8 rounded-2xl hover:bg-white/5 hover:-translate-y-1 transition-all duration-300 group flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-surface-bright border border-white/10 shrink-0 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-on-surface text-2xl">health_and_safety</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Reduced injury risk</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed">By enforcing joint limits mathematically, the AI prevents you from over-extending and re-injuring yourself.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6 md:px-12 text-center text-sm text-on-surface-variant relative z-10 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <span className="material-symbols-outlined text-primary text-xl">ecg_heart</span>
          <span className="font-bold text-on-surface">Smart Rehab</span>
        </div>
        <p>© 2026 Smart Rehab Systems. All rights reserved.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <a href="#" className="hover:text-primary transition-colors">Privacy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms</a>
        </div>
      </footer>

    </div>
  );
}
