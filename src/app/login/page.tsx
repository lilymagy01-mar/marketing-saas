"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Sparkles, 
  ArrowRight, 
  Mail, 
  Lock, 
  Globe, 
  ShieldCheck,
  Zap,
  CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Button = ({ children, className, onClick, disabled, variant = "primary" }: any) => {
  const baseStyle = "flex items-center justify-center transition-all active:scale-95 disabled:opacity-50";
  const variants: any = {
    primary: "bg-white text-black hover:bg-zinc-100",
    outline: "border border-white/10 bg-white/5 hover:bg-white/10 text-zinc-400",
    rose: "bg-rose-600 text-white hover:bg-rose-500 shadow-xl shadow-rose-600/20"
  };
  return (
    <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Login, 2: Identity Setup

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate Login Handshake
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
    }, 1500);
  };

  const handleStartJourney = () => {
    // Navigate to Dashboard after identity is confirmed
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-4 overflow-hidden relative font-sans">
      {/* Background Cinematic Aura */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-rose-600/20 rounded-full blur-[160px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[140px]" />
      </div>

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div 
            key="login"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, y: -20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-[440px] z-10"
          >
            <div className="flex flex-col items-center justify-center mb-10 space-y-4">
              <div className="w-16 h-16 bg-rose-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-rose-600/30 rotate-3 transition-transform hover:rotate-0">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none text-center">
                Enter the <br/> <span className="text-rose-500">Global System</span>
              </h1>
              <p className="text-zinc-500 text-[10px] font-black tracking-wide uppercase tracking-[0.2em]">SaaS Identity Verification</p>
            </div>

            <div className="bg-zinc-900/40 backdrop-blur-3xl border border-white/10 p-10 rounded-[40px] shadow-2xl space-y-8">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-4">
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 transition-colors group-focus-within:text-rose-500" />
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="business@example.com"
                      className="w-full bg-white/5 border border-white/10 p-5 pl-12 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all font-bold text-sm"
                    />
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 transition-colors group-focus-within:text-rose-500" />
                    <input 
                      type="password" 
                      required
                      placeholder="••••••••"
                      className="w-full bg-white/5 border border-white/10 p-5 pl-12 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all font-bold text-sm"
                    />
                  </div>
                </div>

                <Button 
                  disabled={isLoading}
                  className="w-full py-7 rounded-2xl font-black uppercase tracking-widest text-[10px]"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>Initialize Portal <ArrowRight className="ml-2 w-4 h-4" /></>
                  )}
                </Button>
              </form>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/5"></span>
                </div>
                <div className="relative flex justify-center text-[8px] font-black uppercase tracking-[0.3em] text-zinc-600">
                  <span className="bg-[#0b0b0b] px-4">Social Handshake</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="py-6 rounded-2xl font-bold text-[10px] uppercase">
                   Google
                </Button>
                <Button variant="outline" className="py-6 rounded-2xl font-bold text-[10px] uppercase">
                   Github
                </Button>
              </div>
            </div>

            <p className="text-center mt-10 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
              Security: AES-256 Multi-tenant Vault Enabled
            </p>
          </motion.div>
        ) : (
          <motion.div 
            key="id-setup"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-[500px] z-10 text-center space-y-10"
          >
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 mx-auto">
                <ShieldCheck className="w-4 h-4 text-rose-500" />
                <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest leading-none italic">Identity Verified</span>
              </div>
              <h2 className="text-5xl font-black tracking-tighter uppercase italic leading-none">Welcome to <br/> <span className="text-rose-500">The System</span></h2>
              <p className="text-zinc-400 font-medium max-w-[340px] mx-auto leading-relaxed">
                "이제 사장님만의 고유 식별 번호가 생성되었습니다. 이 번호로 전 세계 SNS와 사장님의 꽃집을 1:1로 매칭합니다."
              </p>
            </div>

            <div className="bg-zinc-900/40 backdrop-blur-3xl border border-white/10 p-10 rounded-[44px] space-y-8">
              <div className="flex items-center gap-6 p-6 bg-white/5 rounded-3xl border border-white/10">
                <div className="w-14 h-14 bg-gradient-to-tr from-rose-600 to-indigo-600 rounded-2xl flex items-center justify-center">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1 italic">Personal User ID</p>
                  <p className="text-xl font-mono font-black tracking-tighter text-white">USER_X_7782_ALPHA</p>
                </div>
                <div className="ml-auto">
                   <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                </div>
              </div>

              <div className="space-y-6">
                 <div className="text-left">
                   <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3 block px-1 italic">Enter Global Store Identity</label>
                   <input 
                     type="text" 
                     placeholder="e.g. Blossom Paris Central"
                     className="w-full bg-white/5 border border-white/10 p-6 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all font-bold text-lg"
                   />
                 </div>
              </div>

              <Button 
                onClick={handleStartJourney}
                variant="rose"
                className="w-full py-8 rounded-3xl font-black uppercase tracking-widest text-xs"
              >
                Launch Global Engine <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
