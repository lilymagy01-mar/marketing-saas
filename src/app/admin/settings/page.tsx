import React from 'react';
import { 
  Zap, 
  ShieldCheck, 
  Database, 
  Globe, 
  Lock,
  RefreshCcw,
  Save,
  Cpu
} from 'lucide-react';

export default function AdminSettings() {
  return (
    <div className="max-w-4xl space-y-8">
      {/* 🔮 Central Infrastructure Vault */}
      <section className="p-8 rounded-3xl bg-[#0f0f12] border border-white/5 space-y-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-indigo-500/10 rounded-2xl">
            <Cpu className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">중앙 인프라 브리지 설정</h2>
            <p className="text-slate-500 text-sm">모든 테넌트(꽃집)에 적용될 전역 자동화 허브를 설정합니다.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Zap className="w-3 h-3 text-amber-500" /> n8n Master Webhook URL
            </label>
            <div className="flex gap-2">
              <input 
                type="text" 
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-indigo-500/50 outline-none transition-all"
                defaultValue="https://n8n.lilymag.ai/webhook/master-marketing-engine"
              />
              <button className="px-4 py-3 bg-white/5 hover:bg-indigo-500/20 text-indigo-400 border border-white/10 rounded-xl transition-all flex items-center gap-2 font-bold text-xs">
                <RefreshCcw className="w-4 h-4" /> 연결 테스트
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Lock className="w-3 h-3 text-emerald-500" /> OpenAI Master API Key
            </label>
            <div className="flex gap-2">
              <input 
                type="password" 
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-indigo-500/50 outline-none transition-all font-mono"
                defaultValue="sk-proj-••••••••••••••••••••••••••••••••••••••••"
              />
              <button className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl transition-all flex items-center gap-2 font-bold text-xs shadow-lg shadow-indigo-500/20">
                <Save className="w-4 h-4" /> 저장
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 📊 Global User Policy */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-3xl bg-[#0f0f12] border border-white/5 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            구독 권한 마스터
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-xs font-medium text-slate-300">무료 사용자 월간 제한</span>
              <span className="text-xs font-bold text-white">5건</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-xs font-medium text-slate-300">프리미엄 사용자 월간 제한</span>
              <span className="text-xs font-bold text-white">무제한</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-xs font-medium text-slate-300">AI 이미지 생성 모듈</span>
              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[10px] font-bold">ON</span>
            </div>
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-[#0f0f12] border border-white/5 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-400" />
            글로벌 리전 제어
          </h3>
          <div className="flex flex-wrap gap-2">
            {['KR', 'US', 'JP', 'VN', 'CN'].map((region) => (
              <div key={region} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold text-white">{region} 활성화</span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-slate-500 pt-2 border-t border-white/5">
            * 리전 비활성화 시 해당 국가의 에이전트 브레인이 즉시 정지됩니다.
          </p>
        </div>
      </section>

      {/* 🗄️ Database Management */}
      <section className="p-8 rounded-3xl bg-[#0a0a0c] border border-red-500/10 space-y-4">
        <h3 className="text-lg font-bold text-red-400 flex items-center gap-2">
          <Database className="w-5 h-5" />
          위험 구역 (System Maintenance)
        </h3>
        <div className="flex gap-4">
          <button className="flex-1 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl text-xs font-bold transition-all">
            만료된 로그 강제 삭제 (Purge)
          </button>
          <button className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 rounded-xl text-xs font-bold transition-all">
            전체 에이전트 콜드 부팅
          </button>
        </div>
      </section>
    </div>
  );
}
