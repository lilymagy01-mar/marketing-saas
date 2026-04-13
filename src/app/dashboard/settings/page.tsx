"use client";

import { useState, useEffect } from "react";
import { 
  Sparkles,
  Database,
  Lock,
  Share2,
  Link2,
  CheckCircle2,
  Globe,
  Key,
  RefreshCw,
  Shield,
  Smartphone,
  ArrowRight,
  Play,
  Camera,
  Briefcase,
  Loader2,
  MessageSquare,
  Cpu,
  Zap
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedGuide, setSelectedGuide] = useState<string | null>(null);
  
  const [settings, setSettings] = useState({
    shopName: "",
    persona: "Elegant & Premium",
    industry: "flower",
    targetAudience: "",
    brandVoice: "friendly",
    autoPilot: true,
    isAdmin: false
  });

  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);

  // 1. Initial Data Fetching from Supabase
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      setUserId(user.id);

      // Fetch Shop Settings
      const { data: shopSettings } = await supabase
        .from('shop_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (shopSettings) {
        setSettings({
          shopName: shopSettings.store_persona || "", // Overloading for now
          persona: shopSettings.store_persona || "Elegant & Premium",
          targetAudience: "", 
          autoPilot: shopSettings.auto_pilot_enabled,
        });
      }

      // Fetch Connected Platforms
      const { data: creds } = await supabase
        .from('user_credentials')
        .select('provider')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (creds) {
        setConnectedPlatforms(creds.map(c => c.provider));
      }

      // Fetch profile & shop settings for deep context
      const [{ data: shopData }, { data: profileData }] = await Promise.all([
        supabase.from('shop_settings').select('*').eq('user_id', user.id).single(),
        supabase.from('profiles').select('*').eq('id', user.id).single()
      ]);

      setSettings({
        shopName: shopData?.shop_name || '',
        persona: shopData?.store_persona || 'Elegant',
        autoPilot: !!shopData?.auto_pilot_enabled,
        industry: profileData?.industry || 'flower',
        targetAudience: profileData?.target_audience || 'general customers',
        brandVoice: profileData?.brand_voice || 'friendly',
        isAdmin: !!profileData?.is_admin
      });

      setIsLoading(false);
    }

    loadData();
    
    // Handle URL success/error params
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get("success")) {
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  const saveToSystem = async () => {
    if (!userId) {
      alert("Please login first.");
      return;
    }

    setIsSaving(true);
    
    try {
      const [shopUpdate, profileUpdate] = await Promise.all([
        supabase.from('shop_settings').upsert({
          user_id: userId,
          store_persona: settings.persona,
          auto_pilot_enabled: settings.autoPilot,
          shop_name: settings.shopName,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' }),
        supabase.from('profiles').update({
          industry: settings.industry,
          target_audience: settings.targetAudience,
          brand_voice: settings.brandVoice,
          is_admin: settings.isAdmin
        }).eq('id', userId)
      ]);

      if (shopUpdate.error) throw shopUpdate.error;
      if (profileUpdate.error) throw profileUpdate.error;

      setIsSaving(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch (error: any) {
      console.error("Save error:", error);
      alert(`Save failed: ${error.message}`);
      setIsSaving(false);
    }
  };

  const snsVaultItems = [
    { 
      id: 'instagram', name: 'Instagram', icon: Camera, color: "text-pink-500", bg: "bg-pink-500/10", solid: "bg-pink-500",
      guide: "📍 [인스타그램/페이스북 통합 작전 가이드]\n\n1. developers.facebook.com 접속 후 로그인\n2. [내 앱] -> [앱 만들기] 클릭\n3. [비즈니스] 유형 선택\n4. Instagram Basic Display 또는 Graph API 설정\n5. 아래 'Connect' 버튼을 눌러 인증을 완료하세요."
    },
    { 
      id: 'youtube', name: 'YouTube', icon: Play, color: "text-red-500", bg: "bg-red-500/10", solid: "bg-red-600",
      guide: "📍 [유튜브 영상 사격 가이드]\n\n1. Google Cloud Console에서 YouTube Data API v3 활성화\n2. OAuth 동의 화면 구성\n3. 아래 'Connect' 버튼을 통해 구글 계정 인증을 완료하세요."
    },
    { 
      id: 'naver', name: 'Naver Blog', icon: Briefcase, color: "text-green-600", bg: "bg-green-600/10", solid: "bg-green-600",
      guide: "📍 [네이버 블로그 통합 가이드]\n\n1. Naver Developers에서 블로그 API 신청\n2. 아래 'Connect' 버튼을 눌러 네이버 로그인을 완료하세요."
    },
    { 
      id: 'tiktok', name: 'TikTok', icon: Smartphone, color: "text-zinc-900 dark:text-white", bg: "bg-zinc-950/10", solid: "bg-zinc-950",
      guide: "📍 [틱톡 숏폼 장악 가이드]\n\n1. TikTok Developer Portal에서 App 생성\n2. Login Kit 및 Content Posting API 활성화\n3. 아래 'Connect' 버튼을 눌러 인증을 완료하세요."
    },
    { 
      id: 'twitter', name: 'X (Twitter)', icon: Share2, color: "text-indigo-400", bg: "bg-indigo-400/10", solid: "bg-zinc-900",
      guide: "📍 [X 글로벌 확산 가이드]\n\n1. Twitter Developer Portal에서 Project 생성\n2. OAuth 2.0 User Auth 설정 (Read/Write 권한)\n3. 아래 'Connect' 버튼을 눌러 연결하세요."
    },
    { 
      id: 'blogger', name: 'Google Blogger', icon: Globe, color: "text-orange-500", bg: "bg-orange-500/10", solid: "bg-orange-500",
      guide: "📍 [구글 블로거 SEO 가이드]\n\n1. Google Cloud Console에서 Blogger API 활성화\n2. 아래 'Connect' 버튼을 눌러 구글 계정을 연결하세요."
    },
    { 
      id: 'threads', name: 'Threads', icon: MessageSquare, color: "text-zinc-800 dark:text-zinc-200", bg: "bg-zinc-800/10", solid: "bg-zinc-800",
      guide: "📍 [스레드 감성 전략 가이드]\n\n1. 아래 'Connect' 버튼을 눌러 스레드 계정 접근 권한을 승인하세요."
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
        <p className="text-sm font-black uppercase tracking-widest text-zinc-500">Accessing Vault...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pt-8 pb-20 max-w-[1400px] mx-auto px-4">
      {/* Guide Modal Overlay */}
      <AnimatePresence>
        {selectedGuide && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            onClick={() => setSelectedGuide(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-[40px] p-10 shadow-2xl space-y-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-4">
                 <div className="p-4 bg-indigo-500 text-white rounded-2xl shadow-xl shadow-indigo-500/20">
                    <Shield className="w-6 h-6" />
                 </div>
                 <div>
                    <h4 className="text-xl font-black uppercase italic tracking-tighter text-zinc-900 dark:text-white">배포 가이드</h4>
                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">비즈니스를 글로벌 웹에 연결하세요</p>
                 </div>
              </div>
              
              <div className="p-8 bg-zinc-50 dark:bg-zinc-950 rounded-3xl border border-zinc-100 dark:border-zinc-800">
                <pre className="text-sm font-medium leading-relaxed whitespace-pre-wrap text-zinc-600 dark:text-zinc-300 font-sans">
                  {selectedGuide}
                </pre>
              </div>

              <Button 
                onClick={() => setSelectedGuide(null)}
                className="w-full py-6 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] transition-transform"
              >
                확인했습니다, 브릿지로 돌아가기
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-fit">
            <Globe className="w-4 h-4 text-indigo-500" />
            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest leading-none">글로벌 인프라 v4.0</span>
          </div>
          <h1 className="text-6xl font-black tracking-tighter uppercase italic leading-[0.9] text-zinc-900 dark:text-white">
             마케팅 금고
          </h1>
          <p className="text-zinc-500 text-lg font-medium max-w-xl">
             사장님의 마케팅 자산을 안전하게 보관하고, 전 세계 SNS로 사격할 채비를 마치는 곳입니다.
          </p>
        </div>

        <div className="flex items-center gap-4">
           <Button 
             variant="outline" 
             className="px-8 py-6 rounded-2xl border-zinc-200 dark:border-zinc-800 text-zinc-500 font-black uppercase tracking-widest text-[10px]"
             onClick={() => window.location.reload()}
           >
             <RefreshCw className="w-4 h-4 mr-2" /> 데이터 동기화
           </Button>
           <Button 
             onClick={saveToSystem}
             disabled={isSaving}
             className="px-10 py-6 rounded-2xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-indigo-500/10 hover:scale-[1.05] transition-all"
           >
             {isSaving ? (
               <Loader2 className="w-4 h-4 animate-spin mr-2" />
             ) : (
               <Database className="w-4 h-4 mr-2" />
             )}
             {isSaved ? "보안 저장 완료" : "변경사항 저장"}
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-10 gap-10">
        {/* Left Column: SNS Assets */}
        <div className="xl:col-span-6 space-y-10">
          <h3 className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-4 text-zinc-900 dark:text-white">
             <Lock className="w-8 h-8 text-rose-500" /> SNS 인증 정보 보관소
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {snsVaultItems.map((sns) => (
              <Card key={sns.id} className="p-6 bg-white dark:bg-zinc-950 border-none shadow-xl rounded-[32px] hover:shadow-2xl transition-all group">
                 <div className="flex items-center gap-4 mb-6">
                    <div className={cn("p-4 rounded-2xl transition-transform group-hover:rotate-6", sns.bg)}>
                       <sns.icon className={cn("w-6 h-6", sns.color)} />
                    </div>
                    <div>
                       <h4 className="font-black text-lg italic uppercase tracking-tighter text-zinc-900 dark:text-white leading-none">{sns.name}</h4>
                       <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">상태: {connectedPlatforms.includes(sns.id) ? '보안 활성' : '연결 필요'}</p>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                       <button 
                         onClick={() => setSelectedGuide(sns.guide)}
                         className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 hover:text-indigo-500 hover:bg-indigo-500/10 transition-all"
                       >
                         <Shield className="w-3.5 h-3.5" />
                       </button>
                       <div className={`w-2 h-2 rounded-full ${connectedPlatforms.includes(sns.id) ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-200 dark:bg-zinc-800'}`} />
                    </div>
                 </div>
                 <div className="relative mt-2">
                    <div className="flex flex-col gap-3">
                       {connectedPlatforms.includes(sns.id) ? (
                          <div className="flex items-center justify-between p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                             <div className="flex items-center gap-3">
                                 <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                <span className="text-xs font-black uppercase text-emerald-600 tracking-widest italic">연결 활성</span>
                             </div>
                             <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={async () => {
                                  if (confirm(`${sns.name} 연결을 해제하시겠습니까?`)) {
                                    await supabase.from('user_credentials').delete().eq('user_id', userId).eq('provider', sns.id);
                                    setConnectedPlatforms(connectedPlatforms.filter(p => p !== sns.id));
                                  }
                                }}
                                className="text-[10px] font-black uppercase text-rose-500 hover:bg-rose-500/10"
                             >
                                연결 해제
                             </Button>
                          </div>
                       ) : (
                          <Button 
                             onClick={() => {
                               window.location.href = `/api/auth/connect/${sns.id}?user_id=${userId}`;
                             }}
                             className={cn(
                               "w-full py-6 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] text-white border-none",
                               (sns as any).solid
                             )}
                          >
                            <Link2 className="w-4 h-4 mr-2" /> {sns.name} 계정 연결하기
                          </Button>
                       )}
                    </div>
                 </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Column: Identity & Bridge */}
        <div className="xl:col-span-4 space-y-10">
          <h3 className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-4 text-zinc-900 dark:text-white">
             <Sparkles className="w-8 h-8 text-amber-500" /> 브랜드 정체성
          </h3>
          <Card className="p-8 bg-white dark:bg-zinc-950 border-none shadow-2xl rounded-[40px] space-y-8">
             <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3 block">지점 명칭</label>
                    <input 
                      type="text" 
                      value={settings.shopName}
                      onChange={(e) => setSettings({...settings, shopName: e.target.value})}
                      placeholder="e.g. My Global Branch #1"
                      className="w-full p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-zinc-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-inner"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3 block">핵심 업종</label>
                    <select 
                      value={settings.industry}
                      onChange={(e) => setSettings({...settings, industry: e.target.value})}
                      className="w-full p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-zinc-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-inner appearance-none cursor-pointer"
                    >
                      <option value="flower">🌸 프리미엄 꽃집</option>
                      <option value="saas">🚀 IT/SaaS 솔루션</option>
                      <option value="cafe">☕ 카페/디저트</option>
                      <option value="restaurant">🍱 일반 음식점</option>
                      <option value="fashion">👗 패션/뷰티</option>
                      <option value="realestate">🏠 부동산/자산관리</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3 block">주 타겟 고객</label>
                  <input 
                    type="text" 
                    value={settings.targetAudience}
                    onChange={(e) => setSettings({...settings, targetAudience: e.target.value})}
                    placeholder="예: 2030 직장인 여성, 자영업자 사장님 등"
                    className="w-full p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-zinc-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-inner"
                  />
                </div>

                <div>
                   <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3 block">브랜드 페르소나 (톤)</label>
                   <div className="grid grid-cols-4 gap-2">
                     {[
                       { id: 'Elegant', label: '우아함' },
                       { id: 'Warm', label: '따뜻함' },
                       { id: 'Trendy', label: '트렌디' },
                       { id: 'Expert', label: '전문적' }
                     ].map((p) => (
                       <button 
                         key={p.id} 
                         onClick={() => setSettings({...settings, persona: p.id})}
                         className={`p-3 rounded-xl border ${settings.persona.includes(p.id) ? 'border-indigo-500 bg-indigo-500/5 text-indigo-500 shadow-lg shadow-indigo-500/10' : 'border-zinc-100 dark:border-zinc-800 text-zinc-400'} text-[10px] font-black uppercase tracking-tighter transition-all hover:scale-105 active:scale-95`}
                       >
                         {p.label}
                       </button>
                     ))}
                   </div>
                </div>

                <div className="pt-4">
                  <div className="flex items-center justify-between p-6 bg-zinc-50 dark:bg-zinc-900 rounded-[32px] border border-zinc-100 dark:border-zinc-800">
                    <div className="space-y-1">
                       <h4 className="font-black text-xs uppercase italic tracking-tighter text-zinc-900 dark:text-white">시스템 총괄 모드 (Admin)</h4>
                       <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">플랫폼 B2B 마케팅 모드 활성화</p>
                    </div>
                    <button 
                      onClick={() => setSettings({...settings, isAdmin: !settings.isAdmin})}
                      className={cn(
                        "w-12 h-6 rounded-full p-1 transition-all",
                        settings.isAdmin ? "bg-indigo-600" : "bg-zinc-200 dark:bg-zinc-800"
                      )}
                    >
                       <div className={cn("w-4 h-4 bg-white rounded-full transition-all", settings.isAdmin ? "translate-x-6" : "translate-x-0")} />
                    </button>
                  </div>
                </div>
             </div>
          </Card>

          <h3 className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-4 text-zinc-900 dark:text-white pt-4">
             <Cpu className="w-8 h-8 text-indigo-500" /> 브릿지 및 자동화
          </h3>
          <Card className="p-8 bg-white dark:bg-zinc-950 border-none shadow-2xl rounded-[40px] space-y-8">
             <div className="space-y-6">
                <div className="flex items-center justify-between p-6 bg-indigo-500/5 rounded-[32px] border border-indigo-500/10">
                   <div className="space-y-1">
                      <h4 className="font-black text-sm uppercase italic tracking-tighter text-zinc-900 dark:text-white">오토파일럿 모드</h4>
                      <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">자율 주행 마케팅 엔진</p>
                   </div>
                   <button 
                     onClick={() => setSettings({...settings, autoPilot: !settings.autoPilot})}
                     className={cn(
                       "w-14 h-8 rounded-full p-1 transition-all duration-500 ease-in-out",
                       settings.autoPilot ? "bg-indigo-500 px-7" : "bg-zinc-200 dark:bg-zinc-800 px-1"
                     )}
                   >
                     <div className="w-6 h-6 bg-white rounded-full shadow-lg" />
                   </button>
                </div>

                <div className="pt-2">
                    <p className="text-[10px] text-zinc-400 font-bold leading-relaxed px-2">
                      * 활성화 시 AI가 비즈니스의 특성을 분석하여 정기적인 자동 마케팅 작전을 수행합니다. 모든 설정은 중앙 사령부(Admin)의 정책을 따릅니다.
                    </p>
                </div>
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
