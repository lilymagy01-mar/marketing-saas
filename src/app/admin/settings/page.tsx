'use client';

import React, { useEffect, useState } from 'react';
import { 
  Zap, 
  ShieldCheck, 
  Database, 
  Globe, 
  Lock,
  Save,
  Cpu,
  Loader2,
  Camera,
  Play,
  Briefcase,
  Smartphone,
  Share2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminSettings() {
  const [snsConfig, setSnsConfig] = useState<any>({
    meta: { id: '', secret: '' },
    google: { id: '', secret: '' },
    naver: { id: '', secret: '' },
    tiktok: { key: '', secret: '' },
    twitter: { id: '', secret: '' }
  });
  
  const [config, setConfig] = useState<any>({
    n8n_master_url: '',
    openai_master_key: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchConfig() {
      try {
        const { data, error } = await supabase
          .from('platform_config')
          .select('*');
        
        if (error && error.code !== 'PGRST205') {
          console.warn('platform_config load skipped:', error.message);
        }

        if (data) {
          const newConfig = { ...config };
          const newSns = { ...snsConfig };
          
          data.forEach(item => {
            if (item.key === 'n8n_master_url') newConfig.n8n_master_url = item.value?.url || '';
            if (item.key === 'openai_master_key') newConfig.openai_master_key = item.value?.key || '';
            
            // SNS Auth Configs
            if (item.key === 'auth_meta') newSns.meta = item.value || { id: '', secret: '' };
            if (item.key === 'auth_google') newSns.google = item.value || { id: '', secret: '' };
            if (item.key === 'auth_naver') newSns.naver = item.value || { id: '', secret: '' };
            if (item.key === 'auth_tiktok') newSns.tiktok = item.value || { key: '', secret: '' };
            if (item.key === 'auth_twitter') newSns.twitter = item.value || { id: '', secret: '' };
          });
          
          setConfig(newConfig);
          setSnsConfig(newSns);
        }
      } catch (err) {
        // ignore
      } finally {
        setIsLoading(false);
      }
    }
    fetchConfig();
  }, []);

  const handleSave = async (key: string, value: any) => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('platform_config')
        .upsert({ 
          key, 
          value: (key === 'n8n_master_url' || key === 'openai_master_key') 
            ? (key === 'n8n_master_url' ? { url: value } : { key: value })
            : value,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      alert("✅ 설정이 저장되었습니다.");
    } catch (err) {
      console.error("Save failed:", err);
      alert("저장에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-20 text-slate-500">인프라 설정 로드 중...</div>;
  }

  return (
    <div className="max-w-5xl space-y-10 pb-20">
      {/* 🚀 Central Infrastructure */}
      <section className="p-8 rounded-[40px] bg-[#0f0f12] border border-white/5 space-y-8 shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
            <Cpu className="w-8 h-8 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">중앙 사령부 서버 가동</h2>
            <p className="text-slate-500 text-sm font-medium">플랫폼 전체의 뇌(AI)와 엔진(n8n)을 제어합니다.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
              <Zap className="w-3 h-3 text-amber-500" /> n8n Master Flow URL
            </label>
            <div className="flex gap-2 p-2 bg-white/[0.02] border border-white/5 rounded-2xl focus-within:border-indigo-500/50 transition-all">
              <input 
                type="text" 
                className="flex-1 bg-transparent border-none px-3 py-2 text-white text-sm outline-none"
                value={config.n8n_master_url}
                onChange={(e) => setConfig({...config, n8n_master_url: e.target.value})}
              />
              <button 
                onClick={() => handleSave('n8n_master_url', config.n8n_master_url)}
                className="px-6 py-2 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 rounded-xl text-[10px] font-black uppercase transition-all"
              >
                Sync
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
              <Lock className="w-3 h-3 text-emerald-500" /> OpenAI Neural Master Key
            </label>
            <div className="flex gap-2 p-2 bg-white/[0.02] border border-white/5 rounded-2xl focus-within:border-indigo-500/50 transition-all">
              <input 
                type="password" 
                className="flex-1 bg-transparent border-none px-3 py-2 text-white text-sm outline-none font-mono"
                value={config.openai_master_key}
                onChange={(e) => setConfig({...config, openai_master_key: e.target.value})}
              />
              <button 
                onClick={() => handleSave('openai_master_key', config.openai_master_key)}
                className="px-6 py-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-xl text-[10px] font-black uppercase transition-all"
              >
                Store
              </button>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-[100px]" />
      </section>

      {/* 🔐 SNS Master API Vault */}
      <section className="space-y-6">
        <h3 className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-4 text-white">
          <ShieldCheck className="w-8 h-8 text-rose-500" /> SNS 마스터 API 설정
        </h3>
        <p className="text-slate-500 text-sm font-medium">테넌트용 SNS 연결 기능을 활성화하기 위한 마스터 애플리케이션 키입니다.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Meta / Instagram */}
          <div className="p-8 rounded-[32px] bg-[#0f0f12] border border-white/5 space-y-6 group hover:border-pink-500/20 transition-all">
             <div className="flex items-center gap-3">
                <div className="p-3 bg-pink-500/10 rounded-2xl text-pink-500 group-hover:scale-110 transition-transform">
                  <Camera className="w-6 h-6" />
                </div>
                <h4 className="font-black text-white uppercase italic tracking-tighter">Meta (FB/IG) API</h4>
             </div>
             <div className="space-y-4">
               <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block px-1">App ID</label>
                  <input 
                    type="text" 
                    className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-white text-xs outline-none"
                    value={snsConfig.meta.id}
                    onChange={(e) => setSnsConfig({...snsConfig, meta: {...snsConfig.meta, id: e.target.value}})}
                  />
               </div>
               <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block px-1">App Secret</label>
                  <input 
                    type="password" 
                    className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-white text-xs outline-none"
                    value={snsConfig.meta.secret}
                    onChange={(e) => setSnsConfig({...snsConfig, meta: {...snsConfig.meta, secret: e.target.value}})}
                  />
               </div>
               <button 
                onClick={() => handleSave('auth_meta', snsConfig.meta)}
                className="w-full py-4 bg-pink-500/10 hover:bg-pink-500/20 text-pink-500 border border-pink-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
               >
                 배포 API 동기화
               </button>
             </div>
          </div>

          {/* Google / YouTube */}
          <div className="p-8 rounded-[32px] bg-[#0f0f12] border border-white/5 space-y-6 group hover:border-red-500/20 transition-all">
             <div className="flex items-center gap-3">
                <div className="p-3 bg-red-500/10 rounded-2xl text-red-500 group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6" />
                </div>
                <h4 className="font-black text-white uppercase italic tracking-tighter">Google (YT) Auth</h4>
             </div>
             <div className="space-y-4">
               <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block px-1">Client ID</label>
                  <input 
                    type="text" 
                    className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-white text-xs outline-none"
                    value={snsConfig.google.id}
                    onChange={(e) => setSnsConfig({...snsConfig, google: {...snsConfig.google, id: e.target.value}})}
                  />
               </div>
               <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block px-1">Client Secret</label>
                  <input 
                    type="password" 
                    className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-white text-xs outline-none"
                    value={snsConfig.google.secret}
                    onChange={(e) => setSnsConfig({...snsConfig, google: {...snsConfig.google, secret: e.target.value}})}
                  />
               </div>
               <button 
                onClick={() => handleSave('auth_google', snsConfig.google)}
                className="w-full py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
               >
                 구글 엔지니어링 승인
               </button>
             </div>
          </div>

          {/* Naver */}
          <div className="p-8 rounded-[32px] bg-[#0f0f12] border border-white/5 space-y-6 group hover:border-emerald-500/20 transition-all">
             <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500 group-hover:scale-110 transition-transform">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h4 className="font-black text-white uppercase italic tracking-tighter">Naver Open API</h4>
             </div>
             <div className="space-y-4">
               <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block px-1">Client ID</label>
                  <input 
                    type="text" 
                    className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-white text-xs outline-none"
                    value={snsConfig.naver.id}
                    onChange={(e) => setSnsConfig({...snsConfig, naver: {...snsConfig.naver, id: e.target.value}})}
                  />
               </div>
               <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block px-1">Client Secret</label>
                  <input 
                    type="password" 
                    className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-white text-xs outline-none"
                    value={snsConfig.naver.secret}
                    onChange={(e) => setSnsConfig({...snsConfig, naver: {...snsConfig.naver, secret: e.target.value}})}
                  />
               </div>
               <button 
                onClick={() => handleSave('auth_naver', snsConfig.naver)}
                className="w-full py-4 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
               >
                 네이버 브릿지 저장
               </button>
             </div>
          </div>

          {/* TikTok */}
          <div className="p-8 rounded-[32px] bg-[#0f0f12] border border-white/5 space-y-6 group hover:border-[#25F4EE]/20 transition-all">
             <div className="flex items-center gap-3">
                <div className="p-3 bg-[#25F4EE]/10 rounded-2xl text-[#25F4EE] group-hover:scale-110 transition-transform">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h4 className="font-black text-white uppercase italic tracking-tighter">TikTok Auth Kit</h4>
             </div>
             <div className="space-y-4">
               <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block px-1">Client Key</label>
                  <input 
                    type="text" 
                    className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-white text-xs outline-none"
                    value={snsConfig.tiktok.key}
                    onChange={(e) => setSnsConfig({...snsConfig, tiktok: {...snsConfig.tiktok, key: e.target.value}})}
                  />
               </div>
               <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block px-1">Client Secret</label>
                  <input 
                    type="password" 
                    className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-white text-xs outline-none"
                    value={snsConfig.tiktok.secret}
                    onChange={(e) => setSnsConfig({...snsConfig, tiktok: {...snsConfig.tiktok, secret: e.target.value}})}
                  />
               </div>
               <button 
                onClick={() => handleSave('auth_tiktok', snsConfig.tiktok)}
                className="w-full py-4 bg-[#25F4EE]/10 hover:bg-[#25F4EE]/20 text-[#25F4EE] border border-[#25F4EE]/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
               >
                 틱톡 글로벌 동기화
               </button>
             </div>
          </div>

          {/* Twitter / X */}
          <div className="p-8 rounded-[32px] bg-[#0f0f12] border border-white/5 space-y-6 group hover:border-blue-400/20 transition-all">
             <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-400/10 rounded-2xl text-blue-400 group-hover:scale-110 transition-transform">
                  <Share2 className="w-6 h-6" />
                </div>
                <h4 className="font-black text-white uppercase italic tracking-tighter">X (Twitter) Auth</h4>
             </div>
             <div className="space-y-4">
               <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block px-1">Client ID</label>
                  <input 
                    type="text" 
                    className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-white text-xs outline-none"
                    value={snsConfig.twitter.id}
                    onChange={(e) => setSnsConfig({...snsConfig, twitter: {...snsConfig.twitter, id: e.target.value}})}
                  />
               </div>
               <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block px-1">Client Secret</label>
                  <input 
                    type="password" 
                    className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-white text-xs outline-none"
                    value={snsConfig.twitter.secret}
                    onChange={(e) => setSnsConfig({...snsConfig, twitter: {...snsConfig.twitter, secret: e.target.value}})}
                  />
               </div>
               <button 
                onClick={() => handleSave('auth_twitter', snsConfig.twitter)}
                className="w-full py-4 bg-blue-400/10 hover:bg-blue-400/20 text-blue-400 border border-blue-400/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
               >
                 X 플랫폼 데이터 승인
               </button>
             </div>
          </div>
        </div>
      </section>

      {/* 📊 Global User Policy */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
        <div className="p-8 rounded-[40px] bg-[#0f0f12] border border-white/5 space-y-4 shadow-xl">
          <h3 className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-2 text-white">
            <ShieldCheck className="w-6 h-6 text-indigo-400" />
            구독 권한 마스터
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">무료 사용자 제한</span>
              <span className="text-xl font-black text-white italic">5건 <span className="text-[10px] font-medium text-slate-500 NOT-italic uppercase">/ Month</span></span>
            </div>
            <div className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">프리미엄 제한</span>
              <span className="text-xl font-black text-indigo-400 italic">UNLIMITED</span>
            </div>
          </div>
        </div>

        <div className="p-8 rounded-[40px] bg-[#0a0a0c] border border-red-500/10 space-y-4 shadow-xl">
           <h3 className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-2 text-red-400">
            <Database className="w-6 h-6" />
            Maintenance
          </h3>
          <div className="flex gap-4">
            <button className="flex-1 py-4 bg-red-400/5 hover:bg-red-400/10 text-red-400 border border-red-400/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
              Purge Logs
            </button>
            <button className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-slate-400 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
              Reboot Engine
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
