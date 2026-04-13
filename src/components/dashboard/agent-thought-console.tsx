"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Cpu, Zap, Activity, Info, ShieldCheck, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface AgentLog {
  id: string;
  agent_name: string;
  action_type: string;
  thought_process: string;
  metadata: any;
  created_at: string;
}

const AGENT_ICONS: Record<string, any> = {
  CEO: ShieldCheck,
  Researcher: Search,
  Designer: Cpu,
  Publisher: Zap,
  'Creative Director': Cpu,
};

const AGENT_COLORS: Record<string, string> = {
  CEO: "text-amber-500 bg-amber-500/10",
  Researcher: "text-indigo-500 bg-indigo-500/10",
  Designer: "text-rose-500 bg-rose-500/10",
  Publisher: "text-emerald-500 bg-emerald-500/10",
  'Creative Director': "text-rose-500 bg-rose-500/10",
};

export function AgentThoughtConsole() {
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('agent_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (data) setLogs(data);
      setLoading(false);
    }

    fetchLogs();
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel('agent_logs_realtime')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'agent_logs' 
      }, (payload) => {
        setLogs((prev) => [payload.new as AgentLog, ...prev].slice(0, 10));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="flex flex-col h-full bg-zinc-950 rounded-[32px] overflow-hidden border border-zinc-900 shadow-2xl relative">
       {/* Console Header */}
       <div className="px-6 py-4 bg-zinc-900/50 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
            </div>
            <span className="ml-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <Terminal className="w-3 h-3" /> 에이전트 매트릭스 콘솔 v5.0
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">실시간 동기화</span>
          </div>
       </div>

       {/* Console Body */}
       <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {loading ? (
             <div className="flex items-center justify-center h-full gap-3 text-zinc-600">
                <Activity className="w-5 h-5 animate-pulse" />
                <span className="text-xs font-black uppercase tracking-widest">코텍스 신경망 연결 중...</span>
             </div>
          ) : logs.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-full gap-4 text-zinc-700 opacity-50 italic">
                <Info className="w-12 h-12" />
                <p className="text-xs font-black uppercase tracking-widest">첫 번째 에이전트 신호를 기다리는 중</p>
             </div>
          ) : (
             <AnimatePresence initial={false}>
                {logs.map((log) => {
                   const Icon = AGENT_ICONS[log.agent_name] || Activity;
                   const colors = AGENT_COLORS[log.agent_name] || "text-zinc-500 bg-zinc-500/10";
                   
                   return (
                      <motion.div
                         key={log.id}
                         initial={{ opacity: 0, x: -10, y: -10 }}
                         animate={{ opacity: 1, x: 0, y: 0 }}
                         exit={{ opacity: 0 }}
                         className="flex gap-4 p-4 rounded-2xl bg-zinc-900/30 border border-white/5 hover:border-white/10 transition-colors"
                      >
                         <div className={cn("p-2 rounded-xl h-fit w-fit shrink-0", colors)}>
                            <Icon className="w-4 h-4" />
                         </div>
                         <div className="space-y-1 overflow-hidden">
                            <div className="flex items-center gap-2">
                               <span className={cn("text-[10px] font-black uppercase tracking-widest", log.agent_name === 'CEO' ? 'text-amber-500' : 'text-zinc-400')}>
                                  {log.agent_name === 'CEO' ? '총괄책임자' : log.agent_name === 'Researcher' ? '시장조사원' : log.agent_name === 'Designer' ? '디자이너' : log.agent_name === 'Publisher' ? '배포담당' : log.agent_name}
                               </span>
                               <span className="text-[10px] font-medium text-zinc-600">
                                  {new Date(log.created_at).toLocaleTimeString()}
                               </span>
                            </div>
                            <p className="text-[11px] leading-relaxed text-zinc-300 font-medium">
                               <span className="text-zinc-500 mr-2 opacity-50 italic">[{log.action_type === 'Analysis' ? '분석' : log.action_type === 'Generation' ? '생성' : log.action_type === 'Dispatch' ? '배포' : log.action_type === 'Planning' ? '기획' : log.action_type}]</span>
                               {log.thought_process}
                            </p>
                         </div>
                      </motion.div>
                   );
                })}
             </AnimatePresence>
          )}
       </div>

       {/* Scanline Effect */}
       <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.02),rgba(0,0,16,0.02))] bg-[length:100%_2px,3px_100%] z-20" />
    </div>
  );
}
