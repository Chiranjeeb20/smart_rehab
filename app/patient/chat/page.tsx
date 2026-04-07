"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  getCurrentUser, 
  type User, 
  getConnectedDoctorInfo,
  type DoctorInfo 
} from "../../lib/auth";
import BottomNav from "../../components/BottomNav";

interface Message {
  id: string;
  type: "user" | "ai" | "doctor" | "system";
  text: string;
  timestamp: string;
  attachments?: { type: "image" | "video"; url: string }[];
}

export default function ChatPage() {
  const [user, setUser] = useState<User | null>(null);
  const [doctor, setDoctor] = useState<DoctorInfo | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const session = getCurrentUser() as any;
    if (!session || session.role !== "patient") {
      router.replace("/login");
      return;
    }
    setUser(session);
    const docInfo = getConnectedDoctorInfo();
    setDoctor(docInfo);

    // Initial messages based on context
    const initialMessages: Message[] = [];
    if (docInfo) {
      initialMessages.push({
        id: "msg-1",
        type: "doctor",
        text: `Welcome back, ${session.name.split(" ")[0]}. I've reviewed your latest session data and your progress looks promising! How are you feeling today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    } else {
      initialMessages.push({
        id: "msg-1",
        type: "ai",
        text: `Hi ${session.name.split(" ")[0]}! I'm your AI Rehab Assistant. You can ask me anything about your exercises, recovery tips, or how to use the app.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      initialMessages.push({
        id: "msg-sys-1",
        type: "system",
        text: "Note: You are currently using the AI Assistant. To chat with a human specialist, connect with a doctor in the Home section.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }
    setMessages(initialMessages);
    setIsLoaded(true);
  }, [router]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  if (!isLoaded || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <span className="material-symbols-outlined text-teal-400 text-4xl animate-spin">
          progress_activity
        </span>
      </div>
    );
  }

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      type: "user",
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");

    // Simulate AI or Doctor Reply
    setIsTyping(true);
    setTimeout(() => {
      const replyMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        type: doctor ? "doctor" : "ai",
        text: doctor 
          ? `Thanks for sharing. I'll take a look at it soon. In the meantime, please continue with your "Heel Slides" routine as planned.`
          : getAIResponse(inputText),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, replyMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const getAIResponse = (input: string) => {
    const lowInput = input.toLowerCase();
    if (lowInput.includes("pain")) return "If you're feeling sharp pain during an exercise, stop immediately and rest. Could you tell me which specific joint is hurting?";
    if (lowInput.includes("knee")) return "For knee recovery, consistency is key. Are you feeling any stiffness when performing the heel slides?";
    if (lowInput.includes("posture")) return "Your posture accuracy improved by 12% recently! Try to keep your back against the wall as guided in the video.";
    if (lowInput.includes("hello") || lowInput.includes("hi")) return "Hello! How can I help with your therapy training today?";
    return "That's an interesting question. Remember to maintain proper breathing and form. Is there anything specific about your exercises you'd like to know?";
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col h-screen overflow-hidden">
      {/* ===== HEADER ===== */}
      <header className="fixed top-0 left-0 w-full z-40 bg-slate-950/80 backdrop-blur-2xl border-b border-white/5 py-5 px-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg border ${
              doctor ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400" : "bg-teal-500/20 border-teal-500/30 text-teal-400"
            }`}>
              <span className="material-symbols-outlined text-2xl">
                {doctor ? "stethoscope" : "smart_toy"}
              </span>
            </div>
            <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 border-2 border-slate-950 rounded-full ${
              doctor ? "bg-emerald-400" : "bg-teal-400 animate-pulse"
            }`}></span>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-white truncate">
              {doctor ? doctor.name : "AI Rehab Assistant"}
            </h1>
            <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
              {doctor ? doctor.designation : "Intelligent Recovery Support"}
            </p>
          </div>
          <div className="flex gap-2">
             <button className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
               <span className="material-symbols-outlined text-xl">videocam</span>
             </button>
             <button className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
               <span className="material-symbols-outlined text-xl">info</span>
             </button>
          </div>
        </div>
      </header>

      {/* ===== MESSAGES SECTION ===== */}
      <main className="flex-1 overflow-y-auto px-6 pt-32 pb-32 space-y-6">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex flex-col ${msg.type === "user" ? "items-end" : msg.type === "system" ? "items-center" : "items-start"}`}
          >
            {msg.type === "system" ? (
              <div className="bg-slate-900/50 border border-white/5 rounded-2xl px-5 py-3 text-center max-w-[85%]">
                <p className="text-[11px] text-slate-400 font-medium italic leading-relaxed">
                  {msg.text}
                </p>
              </div>
            ) : (
              <div className={`max-w-[85%] group`}>
                 <div className={`space-y-1 ${msg.type === "user" ? "text-right" : "text-left"}`}>
                    <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest pl-1">
                      {msg.type === "user" ? "You" : msg.type === "doctor" ? doctor?.name.split(" ")[1] : "AI"} • {msg.timestamp}
                    </p>
                    <div className={`px-5 py-4 rounded-[1.5rem] shadow-xl border ${
                      msg.type === "user" 
                        ? "bg-teal-500 text-white rounded-tr-none border-teal-400/30" 
                        : "bg-slate-900 text-slate-200 rounded-tl-none border-white/5"
                    }`}>
                      <p className="text-sm leading-relaxed font-medium">
                        {msg.text}
                      </p>
                    </div>
                 </div>
              </div>
            )}
          </div>
        ))}
        {isTyping && (
           <div className="flex flex-col items-start space-y-2">
              <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest pl-1">
                {doctor ? doctor.name.split(" ")[1] : "AI Assistant"} is typing...
              </p>
              <div className="bg-slate-900 border border-white/5 px-5 py-4 rounded-[1.5rem] rounded-tl-none flex gap-1.5">
                 <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                 <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                 <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce"></div>
              </div>
           </div>
        )}
        <div ref={chatEndRef} />
      </main>

      {/* ===== INPUT SECTION ===== */}
      <div className="fixed bottom-24 left-0 w-full px-6 z-40 bg-gradient-to-t from-slate-950 via-slate-950 to-transparent pt-6">
        <form 
          onSubmit={handleSendMessage}
          className="glass-card flex items-center gap-3 p-3 rounded-[2rem] border border-white/10 bg-slate-900/40 shadow-2xl relative"
        >
          <button 
            type="button" 
            className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center hover:bg-slate-700 transition-colors shrink-0"
            title="Attach Media"
          >
            <span className="material-symbols-outlined">add</span>
          </button>
          
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={doctor ? "Message Dr. " + doctor.name.split(" ")[1] : "How can I help you recover today?"}
            className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder:text-slate-500 py-3 pl-1"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className="w-12 h-12 rounded-full bg-teal-500 text-white flex items-center justify-center shadow-lg shadow-teal-500/20 disabled:bg-slate-800 disabled:text-slate-600 disabled:shadow-none transition-all active:scale-95 shrink-0"
          >
            <span className="material-symbols-outlined">send</span>
          </button>
        </form>
        
        {/* Quick Suggestion Chips */}
        {!doctor && !inputText && (
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
            {["Pain relief tips", "Knee exercise form", "Next session", "How am I doing?"].map((tip) => (
              <button 
                key={tip}
                onClick={() => setInputText(tip)}
                className="whitespace-nowrap px-4 py-2 rounded-full bg-slate-900/50 border border-white/5 text-[10px] font-bold text-teal-400 uppercase tracking-wider hover:bg-teal-500/10 transition-colors"
              >
                {tip}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ===== BOTTOM NAV ===== */}
      <BottomNav />

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
