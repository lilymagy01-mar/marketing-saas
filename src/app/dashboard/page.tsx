"use client";

import { 
  TrendingUp, 
  Users, 
  Share2, 
  Zap, 
  ArrowUpRight, 
  Sparkles, 
  Video, 
  FileText, 
  Hash,
  ChevronRight
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const stats = [
    { label: "Total Reach", value: "1.2M", change: "+12.5%", icon: Users, color: "from-rose-500 to-rose-600" },
    { label: "AI Generated", value: "842", change: "+42%", icon: Sparkles, color: "from-amber-400 to-amber-600" },
    { label: "Conversion Rate", value: "4.8%", change: "+1.2%", icon: TrendingUp, color: "from-indigo-500 to-indigo-600" },
    { label: "Autopilot Saved", value: "128h", change: "+12h", icon: Zap, color: "from-emerald-500 to-emerald-600" },
  ];

  const quickActions = [
    { title: "Generate Shorts", description: "Convert photos to viral video", icon: Video, color: "bg-rose-500", href: "/dashboard/shorts" },
    { title: "AI Blog Post", description: "Write authority content", icon: FileText, color: "bg-indigo-500", href: "/dashboard/blog" },
    { title: "Threads Viral", description: "Engage with local audience", icon: Hash, color: "bg-amber-400", href: "/dashboard/threads" },
  ];

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pt-8">
        <div className="space-y-3">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/50"
          >
            <Sparkles className="w-4 h-4 text-rose-500" />
            <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest leading-none">AI Marketing Engine Active</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl font-black tracking-tighter uppercase italic leading-[0.9]"
          >
            Command Center
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-500 font-medium max-w-xl text-lg leading-relaxed"
          >
            "물리적 한계를 초월하여, 잠자는 동안에도 가동되는 24/7 마케팅 로봇 시스템을 관리합니다."
          </motion.p>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="outline" size="lg">Generate Report</Button>
          <Button variant="primary" size="lg">
            <Sparkles className="w-5 h-5 mr-3 shrink-0" /> Launch Campaign
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={stat.label} className="group hover:border-rose-500/20 transition-all duration-500 relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-5 blur-3xl group-hover:opacity-10 transition-opacity`} />
            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between">
                <div className={`p-4 rounded-2xl bg-gradient-to-tr ${stat.color} text-white shadow-lg`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 dark:bg-green-950/20 rounded-full text-green-600 dark:text-green-500 text-[10px] font-black uppercase tracking-widest">
                  <ArrowUpRight className="w-3 h-3" /> {stat.change}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{stat.label}</p>
                <h3 className="text-4xl font-black tracking-tighter">{stat.value}</h3>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Main Chart Area Mock */}
          <Card className="min-h-[400px] flex flex-col items-center justify-center border-dashed group relative overflow-hidden">
             <div className="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-3xl mb-4 group-hover:scale-110 transition-transform duration-500 shadow-inner">
               <TrendingUp className="w-12 h-12 text-zinc-300 dark:text-zinc-700" />
             </div>
             <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">Real-time Performance Chart Coming Soon</p>
             <p className="text-zinc-500 text-[10px] mt-2 uppercase tracking-tighter">Connecting to Meta Reach API...</p>
          </Card>

          {/* Autopilot Reactor Card - Tactical Mode Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-10 rounded-[48px] bg-gradient-to-br from-zinc-900 via-black to-zinc-900 border border-white/10 relative overflow-hidden group shadow-2xl shadow-cyan-500/10"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-1000">
              <Zap className="w-56 h-56 text-cyan-500" />
            </div>
            
            <div className="relative z-10 space-y-10">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
                      <Zap className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Tactical Reactor</h3>
                      <p className="text-cyan-400/60 text-[10px] font-black uppercase tracking-widest leading-none mt-1">Operational Mode Engine v4.0</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/10">
                  {['Full', 'Hybrid', 'Manual'].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => alert(`${mode} 모드로 전환되었습니다.`)}
                      className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-tighter transition-all duration-300 ${
                        mode === 'Hybrid' 
                        ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/40' 
                        : 'text-zinc-500 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {mode === 'Full' ? '전체 자율' : mode === 'Hybrid' ? '부분 자율' : '커스텀'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-colors group/item">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">Today's Subject</p>
                  <p className="text-xl font-black text-white tracking-tighter uppercase italic leading-none group-hover:text-cyan-400 transition-colors">"벚꽃 이후의 무대, 튤립의 시간"</p>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <p className="text-[10px] font-bold text-cyan-400/80 uppercase">AI Optimized Target</p>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-colors">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">Platform Mix</p>
                  <div className="flex flex-wrap gap-2">
                    {['Shorts', 'Threads', 'Blog'].map(tag => (
                      <span key={tag} className="px-3 py-1 bg-zinc-800 rounded-lg text-[9px] font-black text-zinc-300 uppercase italic tracking-tighter">{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-colors">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">Execution Logic</p>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-zinc-300 uppercase italic">Prime Time: AM 10:00</p>
                    <p className="text-[10px] font-medium text-zinc-500 italic">승인 대기 중: 사령관님의 최종 승인이 필요합니다.</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="flex -space-x-2">
                     {[1,2,3].map(i => (
                       <div key={i} className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-black flex items-center justify-center text-[10px] font-black text-zinc-500">
                         {i === 1 ? 'IG' : i === 2 ? 'TH' : 'YT'}
                       </div>
                     ))}
                   </div>
                   <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">3 Platforms Armed & Ready</p>
                </div>
                <Button variant="primary" className="bg-cyan-500 hover:bg-cyan-400 text-black font-black px-10 rounded-2xl shadow-xl shadow-cyan-500/20">
                  승인 및 사격 개시
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions Panel */}
        <div className="space-y-6">
          <h3 className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-3">
             <ArrowUpRight className="w-6 h-6 text-rose-500" /> Instant Actions
          </h3>
          <div className="space-y-4">
            {quickActions.map((action, i) => (
              <motion.div 
                key={action.title}
                whileHover={{ x: 10, scale: 1.02 }}
                className="group relative flex items-center gap-5 p-6 bg-white dark:bg-zinc-950 rounded-[32px] border border-zinc-100 dark:border-zinc-900 shadow-sm hover:shadow-2xl hover:shadow-rose-500/10 cursor-pointer transition-all duration-300"
              >
                 <div className={`p-4 rounded-2xl ${action.color} text-white shadow-xl shadow-${action.color}/20 group-hover:rotate-12 transition-transform`}>
                   <action.icon className="w-6 h-6" />
                 </div>
                 <div className="flex-1">
                   <h4 className="font-bold text-lg tracking-tight uppercase italic">{action.title}</h4>
                   <p className="text-xs font-medium text-zinc-400">{action.description}</p>
                 </div>
                 <ChevronRight className="w-5 h-5 text-zinc-300 group-hover:text-rose-500 transition-colors" />
              </motion.div>
            ))}
          </div>

          <Card className="bg-gradient-to-br from-zinc-900 to-black text-white p-8 overflow-hidden relative group">
             <div className="relative z-10 space-y-6">
                <div className="p-3 bg-white/10 rounded-2xl w-fit">
                  <Sparkles className="w-6 h-6 text-amber-400" />
                </div>
                <div className="space-y-2">
                   <h4 className="text-2xl font-black tracking-tighter uppercase italic">Weekly Strategy</h4>
                   <p className="text-zinc-400 text-xs font-semibold leading-relaxed">
                     "이번 주는 '졸업식' 시즌 키워드에 130% 집중하세요. AI가 최적화 시나리오를 구성했습니다."
                   </p>
                </div>
                <Button variant="glass" className="w-full">Activate Strategy</Button>
             </div>
             <div className="absolute bottom-0 right-0 p-4 opacity-5 group-hover:scale-150 transition-transform duration-1000">
               <TrendingUp className="w-48 h-48" />
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
