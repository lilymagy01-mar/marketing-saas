"use client";

import { useState } from "react";
import { 
  MessageSquare, 
  Sparkles, 
  TrendingUp, 
  Heart, 
  Repeat, 
  Share2, 
  Zap,
  RotateCcw,
  Copy,
  Plus,
  Rocket,
  ZapOff,
  Smile,
  ArrowRight
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { CountrySelector } from "@/components/dashboard/country-selector";
import { CountryCode } from "@/lib/ai-engine";

export default function ThreadsPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<any>(null);
  const [country, setCountry] = useState<CountryCode>('KR');
  const [isPublishing, setIsPublishing] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate/copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, type: "threads", country }),
      });
      const data = await response.json();
      setResult(data);
      // Premium feeling animation delay
      setTimeout(() => setIsGenerating(false), 2000);
    } catch (error) {
      console.error("Threads generation failed", error);
      setIsGenerating(false);
    }
  };

  const handlePublish = async () => {
    if (!result) return;
    setIsPublishing(true);
    try {
      const platform = country === 'CN' ? 'WeChat Moments' : 'Threads/X (Twitter)';
      const response = await fetch("/api/automation/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          platform, 
          country, 
          content: result,
          type: 'threads'
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
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-50 dark:bg-violet-950/20 border border-violet-100 dark:border-violet-900/50 w-fit text-violet-600">
          <MessageSquare className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-widest leading-none">소셜 기폭제 v3.0</span>
        </div>
        <h1 className="text-6xl font-black tracking-tighter uppercase italic leading-[0.9]">
           {country === 'CN' ? "위챗 모멘트 기폭제" : "쓰레드 기폭제"}
        </h1>
        <p className="text-zinc-500 font-medium max-w-xl text-lg leading-relaxed">
           {country === 'CN' ? '"위챗 모멘트의 친구 기반 네트워크를 공략하여, 사장님의 비즈니스 주변 VIP들의 선호 브랜드로 자리매김합니다."' : '"사장님의 서비스가 MZ세대의 피드를 물들이도록, 감성 충만하고 매력적인 메시지를 창조합니다."'}
        </p>
        <div className="mt-4 flex items-center gap-4">
           <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">타켓 전략</span>
           <CountrySelector selected={country} onSelect={setCountry} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Synthesis Control */}
        <div className="space-y-8">
          <Card className="p-10 bg-zinc-900 text-white border-none rounded-[48px] shadow-2xl relative overflow-hidden group">
            <div className="relative z-10 space-y-10">
               <div className="flex items-center gap-4">
                  <div className="p-4 bg-violet-500 rounded-2xl shadow-xl shadow-violet-500/20">
                    <Rocket className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter">바이럴 프롬프트</h3>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">자동 연금술 모드 가동 중</p>
                  </div>
               </div>

               <div className="space-y-4">
                 <textarea 
                   placeholder="어떤 가치나 분위기를 전하고 싶으신가요? (예: 신제품 런칭 이벤트, 주말 깜짝 할인, 브랜드 스토리)"
                   value={prompt}
                   onChange={(e) => setPrompt(e.target.value)}
                   className="w-full h-40 bg-zinc-800 border border-zinc-700 rounded-[32px] p-8 text-lg focus:ring-4 focus:ring-violet-500/20 outline-none transition-all placeholder:text-zinc-600 font-bold resize-none"
                 />
                 <Button 
                   onClick={handleGenerate}
                   disabled={isGenerating || !prompt}
                   className="w-full h-24 bg-violet-500 hover:bg-violet-600 text-white text-xl font-black shadow-[0_20px_50px_rgba(139,92,246,0.3)] rounded-[32px]"
                 >
                   {isGenerating ? (
                      <span className="flex items-center gap-3">
                        <RotateCcw className="w-6 h-6 animate-spin" /> 합성 중...
                      </span>
                   ) : (
                      <span className="flex items-center gap-3">
                        <Zap className="w-6 h-6 fill-white" /> 트렌드 점화
                      </span>
                   )}
                 </Button>
               </div>

               <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "힙 & MZ", icon: Smile },
                    { label: "감성 충만", icon: Heart },
                    { label: "반짝 세일", icon: Zap }
                  ].map((style) => (
                    <div key={style.label} className="p-4 rounded-3xl bg-zinc-800/50 border border-zinc-700/50 flex flex-col items-center justify-center gap-2 hover:bg-zinc-800 transition-colors cursor-pointer group">
                       <style.icon className="w-5 h-5 text-zinc-500 group-hover:text-violet-400 transition-colors" />
                       <span className="text-[10px] font-black uppercase text-zinc-500 group-hover:text-white transition-colors">{style.label}</span>
                    </div>
                  ))}
               </div>
            </div>
            <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12">
               <Zap className="w-64 h-64 text-violet-500" />
            </div>
          </Card>

          <Card className="p-8 bg-gradient-to-br from-violet-500/5 to-transparent border-zinc-100 dark:border-zinc-900 rounded-[40px]">
             <div className="flex items-center justify-between mb-6">
                <h4 className="font-black text-lg italic uppercase tracking-tighter">AI 트렌드 점수</h4>
                <div className="px-3 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 text-[10px] font-black rounded-full uppercase tracking-widest">글로벌 라이브</div>
             </div>
             <div className="space-y-6">
                <div className="flex items-center gap-6">
                   <div className="text-4xl font-black italic tracking-tighter">98.4</div>
                   <div className="flex-1 space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500">
                         <span>잠재적 도달률</span>
                         <span>우수</span>
                      </div>
                      <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: "98%" }} className="h-full bg-violet-500" />
                      </div>
                   </div>
                </div>
             </div>
          </Card>
        </div>

        {/* Prediction Feed */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {!result && !isGenerating ? (
               <motion.div 
                 key="empty"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="h-full min-h-[500px] border-4 border-dashed border-zinc-100 dark:border-zinc-900 rounded-[48px] flex flex-col items-center justify-center p-12 text-center"
               >
                  <div className="w-24 h-24 bg-zinc-50 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-8 shadow-inner">
                    <MessageSquare className="w-10 h-10 text-zinc-300" />
                  </div>
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter text-zinc-400 mb-2">피드 비활성</h3>
                  <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest max-w-[240px]">
                    동력을 주입하시면 최강의 바이럴 피드가 생성됩니다.
                  </p>
               </motion.div>
            ) : isGenerating ? (
               <motion.div 
                 key="generating"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="h-full min-h-[500px] bg-zinc-50 dark:bg-zinc-900/50 rounded-[48px] border border-zinc-100 dark:border-zinc-800 flex flex-col items-center justify-center p-12 text-center gap-8 overflow-hidden relative"
               >
                  <div className="relative">
                    <div className="w-40 h-40 rounded-full border-4 border-violet-500/20 border-t-violet-500 animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <Sparkles className="w-12 h-12 text-violet-500 animate-pulse" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-black uppercase italic tracking-tighter">상호작용 촉발 중</h3>
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest animate-pulse">소셜 트렌드 및 감정 분석 스캔 중...</p>
                  </div>
               </motion.div>
            ) : (
               <motion.div 
                 key="result"
                 initial={{ opacity: 0, scale: 0.95, y: 30 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 className="space-y-8"
               >
                 <Card className="bg-white dark:bg-zinc-950 border-none shadow-2xl rounded-[48px] p-10 space-y-8">
                    <div className="flex items-center gap-4 border-b border-zinc-100 dark:border-zinc-900 pb-8">
                       <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-rose-500/20">L</div>
                       <div className="flex-1">
                          <h4 className="font-black text-lg italic uppercase tracking-tighter leading-none">Your Business</h4>
                          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">@business_official</p>
                       </div>
                       <Button variant="ghost" size="sm" className="rounded-full h-10 w-10 p-0 text-zinc-400">
                         <Plus className="w-6 h-6" />
                       </Button>
                    </div>

                    <div className="space-y-6">
                       <p className="text-2xl font-black tracking-tight leading-relaxed italic uppercase">
                          {result.title}
                       </p>
                       <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed font-medium">
                          {result.hook}
                       </p>
                       <p className="text-zinc-500 dark:text-zinc-500 text-base leading-relaxed italic tracking-tighter">
                          {result.value}
                       </p>
                       <div className="p-6 bg-violet-50 dark:bg-violet-950/20 border border-violet-100 dark:border-violet-900/50 rounded-3xl">
                          <p className="text-violet-600 dark:text-violet-400 font-black text-lg italic uppercase tracking-tighter">
                            {result.cta}
                          </p>
                       </div>
                    </div>

                    <div className="flex items-center gap-8 pt-6 border-t border-zinc-100 dark:border-zinc-900">
                       <div className="flex items-center gap-2 group cursor-pointer">
                          <Heart className="w-6 h-6 text-zinc-400 group-hover:text-rose-500 transition-colors" />
                          <span className="text-xs font-black text-zinc-500 group-hover:text-zinc-900 transition-colors">2.4k</span>
                       </div>
                       <div className="flex items-center gap-2 group cursor-pointer">
                          <MessageSquare className="w-6 h-6 text-zinc-400 group-hover:text-violet-500 transition-colors" />
                          <span className="text-xs font-black text-zinc-500 group-hover:text-zinc-900 transition-colors">412</span>
                       </div>
                       <div className="flex items-center gap-2 group cursor-pointer">
                          <Repeat className="w-6 h-6 text-zinc-400 group-hover:text-green-500 transition-colors" />
                          <span className="text-xs font-black text-zinc-500 group-hover:text-zinc-900 transition-colors">158</span>
                       </div>
                       <div className="flex-1 flex justify-end">
                          <Share2 className="w-6 h-6 text-zinc-400 hover:text-zinc-900 cursor-pointer transition-colors" />
                       </div>
                    </div>
                 </Card>

                 <div className="flex gap-4">
                    <Button 
                      variant="primary" 
                      size="xl" 
                      className={cn("flex-1 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-[32px] shadow-2xl", isPublishing && "opacity-50")}
                      onClick={handlePublish}
                      disabled={isPublishing}
                    >
                      <Share2 className={cn("w-6 h-6 mr-3", isPublishing && "animate-spin")} /> 
                      {isPublishing ? "배포 중..." : (country === 'CN' ? "위챗에 배포하기" : "SNS에 배포하기")}
                    </Button>
                    <Button variant="outline" size="xl" onClick={() => setResult(null)} className="w-[88px] rounded-[32px] border-zinc-200 dark:border-zinc-800 p-0 flex items-center justify-center">
                       <RotateCcw className="w-8 h-8 text-zinc-400" />
                    </Button>
                 </div>
               </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
