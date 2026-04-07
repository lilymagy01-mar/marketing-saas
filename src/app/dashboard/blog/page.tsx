"use client";

import { useState } from "react";
import { 
  BookOpen, 
  PenTool, 
  Sparkles, 
  TrendingUp, 
  Eye, 
  Share2, 
  FileText, 
  Search, 
  Globe, 
  Zap,
  RotateCcw,
  Copy,
  ChevronRight,
  Target,
  BarChart3
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { CountrySelector } from "@/components/dashboard/country-selector";
import { CountryCode } from "@/lib/ai-engine";

export default function BlogPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState<any>(null);
  const [country, setCountry] = useState<CountryCode>('KR');
  const [isPublishing, setIsPublishing] = useState(false);

  const handleGenerate = async () => {
    if (!topic) return;
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate/copy", {
        method: "POST",
        body: JSON.stringify({ prompt: topic, type: "blog", country }),
      });
      const data = await response.json();
      setResult(data);
      // Artificial delay for high-end feel
      setTimeout(() => setIsGenerating(false), 2000);
    } catch (error) {
      console.error("Blog generation failed", error);
      setIsGenerating(false);
    }
  };

  const handlePublish = async () => {
    if (!result) return;
    setIsPublishing(true);
    try {
      const platform = country === 'CN' ? 'XiaoHongShu (Red)' : 'Naver/Google Blog';
      const response = await fetch("/api/automation/publish", {
        method: "POST",
        body: JSON.stringify({ 
          platform, 
          country, 
          content: result,
          type: 'blog'
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
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/50 w-fit text-amber-600">
          <BookOpen className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-widest leading-none">
            {country === 'CN' ? "XiaoHongShu Catalyst v2.1" : "SEO Blog Alchemist v2.1"}
          </span>
        </div>
        <h1 className="text-6xl font-black tracking-tighter uppercase italic leading-[0.9]">
           {country === 'CN' ? "XiaoHongShu Alchemist" : "AI Blog Alchemy"}
        </h1>
        <p className="text-zinc-500 font-medium max-w-xl text-lg leading-relaxed">
           "사장님의 키워드 한 줄로 검색 순위 1위를 선점하는 최고급 마케팅 서사를 집필합니다."
        </p>
        <div className="mt-4 flex items-center gap-4">
           <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Target Strategy</span>
           <CountrySelector selected={country} onSelect={setCountry} />
        </div>
      </div>

      {/* Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 p-8 bg-zinc-950 text-white border-none rounded-[40px] shadow-2xl relative overflow-hidden group">
          <div className="relative z-10 space-y-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-black italic uppercase tracking-tighter">Target Synthesis</h3>
              <p className="text-zinc-400 text-xs font-bold leading-relaxed uppercase tracking-widest">
                AI에게 블로그의 핵심 주제나 키워드를 알려주세요.
              </p>
            </div>
            
            <div className="space-y-4">
              <textarea 
                placeholder="예: 졸업식 꽃다발 추천, 장미의 꽃말, 화이트데이 선물"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full h-32 bg-zinc-900 border border-zinc-800 rounded-[24px] p-6 text-sm focus:ring-2 focus:ring-amber-500/40 outline-none transition-all placeholder:text-zinc-700 font-bold resize-none"
              />
              <Button 
                onClick={handleGenerate}
                disabled={isGenerating || !topic}
                className="w-full h-20 bg-amber-500 hover:bg-amber-600 text-white shadow-[0_10px_40px_rgba(245,158,11,0.3)] transition-all"
              >
                {isGenerating ? (
                   <span className="flex items-center gap-2">
                     <RotateCcw className="w-5 h-5 animate-spin" /> SYNTHESIZING...
                   </span>
                ) : (
                   <span className="flex items-center gap-2">
                     <Zap className="w-5 h-5 fill-white" /> START AI SYNTHESIS
                   </span>
                )}
              </Button>
            </div>

            <div className="pt-8 border-t border-zinc-800 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Neural Mode</p>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-green-400" />
                  <span className="text-xs font-bold">SEO Optimizer Active</span>
                </div>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Target Platform</p>
                <span className="text-xs font-bold">{country === 'CN' ? "XiaoHongShu (Red)" : "Naver / Google"}</span>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform duration-1000">
             <PenTool className="w-48 h-48" />
          </div>
        </Card>

        {/* Preview / Results Area */}
        <div className="lg:col-span-2 space-y-8">
           <AnimatePresence mode="wait">
             {!result && !isGenerating ? (
               <motion.div 
                 key="empty"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="h-full min-h-[400px] rounded-[40px] border-4 border-dashed border-zinc-100 dark:border-zinc-900 flex flex-center items-center justify-center p-12 text-center flex flex-col gap-6"
               >
                  <div className="p-10 rounded-[32px] bg-zinc-50 dark:bg-zinc-950 shadow-inner">
                    <Search className="w-16 h-16 text-zinc-300 mx-auto" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-black uppercase italic tracking-tighter text-zinc-400">Waiting for Synthesis</h3>
                    <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest leading-relaxed max-w-xs mx-auto">
                      "명품 블로그의 서사가 이곳에서 시작됩니다. 동력을 주입해 주세요."
                    </p>
                  </div>
               </motion.div>
             ) : isGenerating ? (
               <motion.div 
                 key="generating"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="h-full min-h-[400px] rounded-[40px] bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 flex flex-col items-center justify-center p-12 text-center gap-8 relative overflow-hidden"
               >
                  <div className="w-32 h-32 rounded-[32px] bg-amber-500/20 flex items-center justify-center animate-spin-slow">
                    <Sparkles className="w-16 h-16 text-amber-500" />
                  </div>
                  <div className="space-y-3 relative z-10">
                    <h3 className="text-2xl font-black uppercase italic tracking-tighter">AI Alchemist at Work</h3>
                    <div className="flex gap-2 justify-center">
                       {[0,1,2].map(i => (
                         <motion.div 
                           key={i} 
                           animate={{ height: [8, 24, 8] }} 
                           transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                           className="w-1.5 bg-amber-500 rounded-full" 
                         />
                       ))}
                    </div>
                  </div>
               </motion.div>
             ) : (
               <motion.div 
                 key="result"
                 initial={{ opacity: 0, y: 30 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="space-y-8"
               >
                 <Card className="p-12 rounded-[48px] border-none shadow-2xl bg-white dark:bg-zinc-950 relative overflow-hidden group">
                    <div className="relative z-10 space-y-10">
                       <div className="flex items-center justify-between">
                         <div className="px-4 py-1.5 bg-green-500 text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg shadow-green-500/20">
                            SEO Optimized Content
                         </div>
                         <div className="flex gap-2">
                           <Button variant="outline" size="sm" className="rounded-full h-10 px-4">
                             <Copy className="w-4 h-4 mr-2" /> Copy All
                           </Button>
                           <Button 
                             variant="primary" 
                             size="sm" 
                             className={cn("rounded-full h-10 px-4 bg-amber-500 hover:bg-amber-600", isPublishing && "opacity-50")}
                             onClick={handlePublish}
                             disabled={isPublishing}
                           >
                             <Share2 className={cn("w-4 h-4 mr-2", isPublishing && "animate-spin")} /> 
                             {isPublishing ? "PUBLISHING..." : "Publish"}
                           </Button>
                         </div>
                       </div>

                       <div className="space-y-6">
                          <h2 className="text-4xl font-black tracking-tighter leading-tight italic uppercase italic">
                            {result.title || "The Golden Scent: Your Ultimate Flower Guide"}
                          </h2>
                          <div className="prose prose-zinc dark:prose-invert max-w-none">
                             <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed font-medium">
                               {result.hook}
                             </p>
                             <div className="my-8 h-px bg-zinc-100 dark:bg-zinc-900" />
                             <p className="text-zinc-500 dark:text-zinc-500 text-sm leading-relaxed whitespace-pre-wrap">
                               {result.value}
                             </p>
                             <div className="mt-10 p-8 rounded-[32px] bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/50">
                                <p className="text-rose-600 dark:text-rose-400 font-black text-xl italic uppercase italic tracking-tighter">
                                  {result.cta}
                                </p>
                             </div>
                          </div>
                       </div>

                       <div className="flex flex-wrap gap-3">
                         {["#꽃집마케팅", "#졸업식꽃다발", "#꽃말이야기", "#SaaS"].map(tag => (
                           <span key={tag} className="px-4 py-2 bg-zinc-50 dark:bg-zinc-900 rounded-xl text-xs font-bold text-zinc-500">
                             {tag}
                           </span>
                         ))}
                       </div>
                    </div>
                    <div className="absolute -bottom-20 -right-20 p-20 opacity-[0.02] group-hover:scale-110 transition-transform duration-[3000ms]">
                       <Target className="w-96 h-96" />
                    </div>
                 </Card>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="p-8 rounded-[32px] border-zinc-100 dark:border-zinc-900 shadow-xl bg-gradient-to-br from-amber-500/5 to-transparent">
                       <div className="flex items-center gap-4 mb-4">
                          <div className="p-3 bg-amber-500 text-white rounded-xl shadow-lg shadow-amber-500/20">
                             <TrendingUp className="w-5 h-5" />
                          </div>
                          <h4 className="font-black text-xl italic uppercase italic tracking-tighter">Reach Prediction</h4>
                       </div>
                       <div className="space-y-4">
                          <div className="flex justify-between items-end">
                             <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Est. Reach Boost</p>
                             <p className="text-4xl font-black text-amber-500 italic uppercase italic tracking-tighter">+130%</p>
                          </div>
                          <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                             <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: "85%" }}
                               className="h-full bg-amber-500"
                             />
                          </div>
                       </div>
                    </Card>

                    <Card className="p-8 rounded-[32px] border-zinc-100 dark:border-zinc-900 shadow-xl bg-gradient-to-br from-green-500/5 to-transparent">
                       <div className="flex items-center gap-4 mb-4">
                          <div className="p-3 bg-green-500 text-white rounded-xl shadow-lg shadow-green-500/20">
                             <Target className="w-5 h-5" />
                          </div>
                          <h4 className="font-black text-xl italic uppercase italic tracking-tighter">SEO Score</h4>
                       </div>
                       <div className="flex items-center gap-6">
                          <div className="relative w-20 h-20">
                             <svg className="w-20 h-20 -rotate-90">
                               <circle cx="40" cy="40" r="36" className="stroke-zinc-100 dark:stroke-zinc-800 fill-none" strokeWidth="8" />
                               <circle cx="40" cy="40" r="36" className="stroke-green-500 fill-none" strokeWidth="8" strokeDasharray={`${2 * Math.PI * 36}`} strokeDashoffset={`${2 * Math.PI * 36 * (1 - 0.94)}`} strokeLinecap="round" />
                             </svg>
                             <div className="absolute inset-0 flex items-center justify-center font-black text-lg">94</div>
                          </div>
                          <div className="space-y-1">
                             <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Near Perfect Strategy</p>
                             <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Search Engine Ready</p>
                          </div>
                       </div>
                    </Card>
                 </div>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
