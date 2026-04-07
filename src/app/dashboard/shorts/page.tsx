"use client";

import { useState } from "react";
import { 
  Video, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  Play, 
  Music, 
  Type,
  LayoutTemplate,
  Star,
  Zap,
  ArrowRight,
  RotateCcw,
  Download,
  Share2,
  TrendingUp
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { CountrySelector } from "@/components/dashboard/country-selector";
import { CountryCode } from "@/lib/ai-engine";

export default function ShortsPage() {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [scenario, setScenario] = useState<any>(null);
  const [country, setCountry] = useState<CountryCode>('KR');
  const [isPublishing, setIsPublishing] = useState(false);

  const steps = [
    { id: 1, label: "Asset Intake", icon: Upload },
    { id: 2, label: "Neural Selection", icon: Star },
    { id: 3, label: "Final Synthesis", icon: Sparkles }
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate/shorts", {
        method: "POST",
        body: JSON.stringify({ 
          prompt: prompt || "A beautiful flower bouquet for a graduation ceremony.",
          country 
        }),
      });
      const data = await response.json();
      setScenario(data);
      // Wait a bit to show the animation
      setTimeout(() => {
        setIsGenerating(false);
        setStep(4);
      }, 2000);
    } catch (error) {
      console.error("AI Generation failed", error);
      setIsGenerating(false);
    }
  };

  const handlePublish = async () => {
    if (!scenario) return;
    setIsPublishing(true);
    try {
      const platform = country === 'CN' ? 'Douyin' : 'YouTube Shorts';
      const response = await fetch("/api/automation/publish", {
        method: "POST",
        body: JSON.stringify({ 
          platform, 
          country, 
          content: scenario,
          type: 'shorts'
        }),
      });
      const data = await response.json();
      if (data.status === 'success') {
        alert(`${platform} 배포 완료! URL: ${data.postUrl}`);
      }
      setIsPublishing(false);
    } catch (error) {
      console.error("Publish failed", error);
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-12 pt-8">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/50 w-fit text-rose-500">
          <Video className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-widest leading-none">AI Video Engine v4.0 Active</span>
        </div>
        <h1 className="text-6xl font-black tracking-tighter uppercase italic leading-[0.9]">
           {country === 'CN' ? "Douyin Viral Synth" : "AI Shorts Synth"}
        </h1>
        <p className="text-zinc-500 font-medium max-w-xl text-lg leading-relaxed">
           "단 한 장의 꽃 사진으로, 수만 명의 시선을 사로잡는 하이엔드 바이럴 영상을 창조합니다."
        </p>
        <div className="mt-4 flex items-center gap-4">
           <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Target Strategy</span>
           <CountrySelector selected={country} onSelect={setCountry} />
        </div>
      </div>

      {step <= 3 && (
        <div className="flex items-center justify-center gap-4 py-8">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center gap-4 group">
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 border-2",
                step >= s.id 
                  ? "bg-rose-500 border-rose-500 text-white shadow-xl shadow-rose-500/30 font-black" 
                  : "bg-white dark:bg-zinc-950 border-zinc-100 dark:border-zinc-800 text-zinc-300"
              )}>
                 <s.icon className="w-6 h-6" />
              </div>
              {i < steps.length - 1 && (
                <div className={cn(
                  "w-20 h-1 rounded-full transition-colors duration-500",
                  step > s.id ? "bg-rose-500" : "bg-zinc-100 dark:bg-zinc-800"
                )} />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Main Interface */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <Card className="flex flex-col items-center justify-center min-h-[400px] border-dashed group cursor-pointer hover:border-rose-500/50 transition-all duration-500 p-0">
              <div className="p-8 rounded-[40px] bg-zinc-50 dark:bg-zinc-900 group-hover:scale-110 transition-transform duration-500 shadow-inner ring-1 ring-zinc-100 dark:ring-zinc-800">
                <Upload className="w-16 h-16 text-rose-500 animate-bounce" />
              </div>
              <div className="text-center mt-8 space-y-3 px-8">
                <h3 className="text-2xl font-black tracking-tight uppercase italic">{country === 'CN' ? "Upload Master for Douyin" : "Upload Master Image"}</h3>
                <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">
                   {country === 'CN' ? "AI will analyze Douyin trends and hot audio waves." : "AI will analyze colors, emotions, and trends."}
                </p>
                <div className="mt-6 w-full max-w-xs mx-auto">
                    <input 
                        type="text" 
                        placeholder="짧은 설명을 적어주세요 (예: 빨간 장미 졸업 꽃다발)"
                        onChange={(e) => setPrompt(e.target.value)}
                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-rose-500/40 outline-none transition-all placeholder:text-zinc-600 font-bold"
                    />
                </div>
              </div>
              <Button onClick={() => setStep(2)} variant="primary" size="lg" className="mt-8 rounded-2xl">
                  Analyze & Proceed
              </Button>
            </Card>

            <div className="space-y-6">
               <Card className="bg-gradient-to-br from-rose-500/5 to-rose-500/10 border-rose-500/20">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-rose-500 text-white rounded-xl shadow-lg shadow-rose-500/20">
                      <Star className="w-5 h-5" />
                    </div>
                    <h3 className="font-black text-xl uppercase italic tracking-tighter">AI Analysis Insights</h3>
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-400 font-medium text-sm leading-relaxed">
                     "현재 시스템은 '로즈 골드' 톤과 '자연광'이 포함된 이미지를 선호합니다. 이 이미지를 사용하면 도달률이 142% 상승할 것으로 예측됩니다."
                  </p>
               </Card>
               <div className="p-10 bg-zinc-900 text-white rounded-[40px] shadow-2xl relative overflow-hidden group">
                  <div className="relative z-10 space-y-6">
                    <Zap className="w-12 h-12 text-amber-400 fill-amber-400" />
                    <h3 className="text-3xl font-black italic uppercase italic tracking-tighter">Instant Autopilot</h3>
                    <p className="text-zinc-400 text-xs font-bold leading-relaxed italic italic tracking-tighter">"130% 스위트 스팟 알고리즘 가동 중."</p>
                  </div>
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Sparkles className="w-32 h-32" />
                  </div>
               </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="group relative overflow-hidden border-none shadow-2xl hover:shadow-rose-500/20 transition-all duration-700 cursor-pointer p-0 rounded-[40px]">
                   <div className="aspect-[9/16] bg-zinc-200 dark:bg-zinc-900 group-hover:scale-110 transition-transform duration-[2000ms] relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-8 left-8 right-8 space-y-3">
                         <div className="px-4 py-1.5 bg-rose-500 text-white text-[10px] font-black w-fit rounded-full uppercase tracking-widest shadow-xl">Template 0{i}</div>
                         <h4 className="text-white text-xl font-bold italic uppercase tracking-tighter">Urban Flora v4</h4>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <div className="w-20 h-20 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full flex items-center justify-center shadow-2xl">
                           <Play className="w-8 h-8 text-white fill-white" />
                         </div>
                      </div>
                   </div>
                </Card>
              ))}
            </div>
            <div className="flex justify-between items-center bg-white dark:bg-zinc-950 p-8 rounded-[40px] border border-zinc-100 dark:border-zinc-900 shadow-2xl">
              <span className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Select a neural template to continue synthesis</span>
              <div className="flex gap-4">
                 <Button variant="outline" onClick={() => setStep(1)} size="lg">Back</Button>
                 <Button variant="primary" onClick={() => setStep(3)} size="lg">Confirm Neural Structure</Button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center min-h-[600px] space-y-12 text-center"
          >
             {!isGenerating ? (
               <div className="space-y-8 max-w-2xl">
                  <div className="relative">
                    <div className="p-12 rounded-[48px] bg-white dark:bg-zinc-900 shadow-2xl shadow-rose-500/10 relative z-10 border border-zinc-100 dark:border-zinc-800">
                      <Zap className="w-16 h-16 text-rose-500 mx-auto animate-pulse" />
                      <h3 className="text-4xl font-black mt-8 tracking-tighter uppercase italic">Ready for Synthesis</h3>
                      <p className="text-zinc-500 font-medium mt-4">"최첨단 AI가 당신의 꽃집을 위한 130% 스위트 스팟 영상을 생성할 준비를 마쳤습니다. 기하급수적 노출을 시작하시겠습니까?"</p>
                    </div>
                  </div>
                  <Button onClick={handleGenerate} size="xl" className="w-full h-24 text-2xl shadow-[0_20px_50px_rgba(244,63,94,0.3)]">
                    <Sparkles className="w-8 h-8 mr-4 shrink-0" /> START NEURAL SYNTHESIS
                  </Button>
               </div>
             ) : (
               <div className="space-y-8 animate-pulse">
                  <div className="w-48 h-48 rounded-[48px] bg-gradient-to-tr from-rose-500 to-amber-500 animate-spin-slow flex items-center justify-center text-white mx-auto">
                    <Sparkles className="w-24 h-24" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-black tracking-tighter uppercase italic">Neural Synthesis in Progress</h3>
                    <p className="text-zinc-500 font-black uppercase tracking-widest text-xs">Processing layers, temporal coherence, and audiowave matching...</p>
                  </div>
               </div>
             )}
          </motion.div>
        )}

        {step === 4 && scenario && (
            <motion.div 
                key="step4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-10"
            >
                {/* Result Preview */}
                <div className="relative group overflow-hidden rounded-[48px] border-none shadow-2xl aspect-[9/16] bg-zinc-900">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative">
                            <div className="absolute -inset-10 bg-rose-500/20 blur-[60px] animate-pulse" />
                            <Play className="w-24 h-24 text-white fill-white relative z-10" />
                        </div>
                    </div>
                    <div className="absolute bottom-12 left-12 right-12 space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500 text-white border border-rose-400/50 w-fit">
                            <Sparkles className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">AI Masterpiece</span>
                        </div>
                        <h2 className="text-4xl font-extrabold text-white leading-tight italic uppercase tracking-tighter uppercase italic">{scenario.hook}</h2>
                        <div className="flex gap-4">
                            <Button variant="glass" size="lg" className="flex-1">
                                <Download className="w-5 h-5 mr-3" /> Save for {country === 'CN' ? "Douyin" : "Mobile"}
                            </Button>
                            <Button 
                                variant="glass" 
                                size="lg" 
                                className="flex-1"
                                onClick={handlePublish}
                                disabled={isPublishing}
                            >
                                <Share2 className={cn("w-5 h-5 mr-3", isPublishing && "animate-spin")} /> 
                                {isPublishing ? "PUBLISHING..." : (country === 'CN' ? "Auto Post to Douyin" : "Auto Post")}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Scenario Details */}
                <div className="space-y-8">
                    <Card className="bg-gradient-to-tr from-zinc-900 to-black text-white border-none p-10 rounded-[48px] overflow-hidden relative group">
                        <div className="relative z-10 space-y-8">
                            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-green-500 text-white font-black text-xs uppercase tracking-widest">
                                <TrendingUp className="w-4 h-4" /> Reach Potential: {scenario.estimatedReachBoost}
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-4xl font-black italic italic tracking-tighter uppercase italic tracking-tighter text-amber-400">The Script</h3>
                                <p className="text-zinc-400 text-sm font-medium leading-relaxed italic italic tracking-tighter">
                                    "{scenario.script}"
                                </p>
                            </div>
                            <div className="space-y-6 pt-6 border-t border-white/10">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Viral Hook</p>
                                    <p className="font-bold text-lg">{scenario.hook}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Emotional Value</p>
                                    <p className="font-medium text-zinc-300 text-sm">{scenario.value}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Direct CTA</p>
                                    <p className="font-black text-rose-400 text-sm">{scenario.cta}</p>
                                </div>
                            </div>
                            <Button onClick={() => setStep(3)} variant="outline" className="w-full border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-white">
                                <RotateCcw className="w-4 h-4 mr-3" /> Re-Generate Strategy
                            </Button>
                        </div>
                        <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:rotate-12 transition-transform duration-1000">
                            <Sparkles className="w-48 h-48" />
                        </div>
                    </Card>

                    <Card className="p-10 border-none bg-zinc-50 dark:bg-zinc-900 rounded-[40px] shadow-inner">
                         <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl">
                                <Music className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-black text-xl italic uppercase italic tracking-tighter italic tracking-tighter">AI Audio Engine</h4>
                                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Mood: Emotional Piano & Lo-Fi Beats</p>
                            </div>
                         </div>
                         <div className="w-full h-2 bg-rose-500/10 rounded-full overflow-hidden">
                             <div className="w-2/3 h-full bg-rose-500 rounded-full animate-pulse" />
                         </div>
                    </Card>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
