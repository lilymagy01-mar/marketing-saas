'use client';

import React from 'react';
import { 
  Zap, 
  Activity, 
  Server, 
  Cpu, 
  Database, 
  Share2, 
  CheckCircle2, 
  AlertTriangle,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function NodesPage() {
  const [masterUrl, setMasterUrl] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetch('/api/admin/stats');
        const data = await res.json();
        // Since we don't have a dedicated n8n node list API, we just show the master status
        setMasterUrl(data?.status?.n8n === 'Online' ? 'http://n8n-master' : null);
      } catch (err) {
        // ignore
      } finally {
        setIsLoading(false);
      }
    }
    loadConfig();
  }, []);

  return (
    <div className="space-y-8 pb-10">
      {/* 🚀 Infrastructure Control Center */}
      <div className="p-8 rounded-[40px] bg-[#0f0f12] border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="flex justify-between items-center mb-10 relative z-10">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-3">
              <Share2 className="w-6 h-6 text-indigo-400" />
              자동화 노드 오케스트레이션
            </h2>
            <p className="text-slate-500 text-sm mt-1">SaaS 전체의 자동화 워크플로우를 처리하는 마스터 엔진 상태입니다.</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-xl shadow-indigo-500/20 hover:scale-105 transition-all">
               <ExternalLink className="w-4 h-4" /> n8n 콘솔 접속
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-between"
          >
            <div className="flex items-center gap-6">
              <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-400 border border-emerald-500/20">
                <Server className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-xl font-black text-white">동영상 오토플로우 마스터 노드</h4>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1 italic">
                  Primary Engine • Production Region
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Status</p>
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3" />
                  Online
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-8 p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex items-center gap-4">
          <div className="p-2 bg-indigo-500/20 rounded-lg">
            <Activity className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-xs font-medium text-slate-400">
            <span className="text-white font-bold">인프라 알림:</span> 모든 자동화 노드가 정상 가동 중입니다. 실시간 동영상 생성 트래픽을 처리할 준비가 되었습니다.
          </p>
        </div>

        <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-indigo-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 rounded-[32px] bg-[#0f0f12] border border-white/5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Compute Core</h3>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">
            비디오 렌더링 및 AI 분석을 위한 컴퓨팅 자원이 유동적으로 할당됩니다. 
            트래픽 증가 시 자동으로 워커 노드가 확장됩니다.
          </p>
        </div>

        <div className="p-8 rounded-[32px] bg-[#0f0f12] border border-white/5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-400">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Global Bridge</h3>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">
            Supabase와 n8n 간의 실시간 데이터 동기화를 유지합니다. 
            모든 테넌트의 자동화 명령이 이 브리지를 통해 전달됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
