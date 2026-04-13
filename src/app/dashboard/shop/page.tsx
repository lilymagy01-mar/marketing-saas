"use client";
// Force re-compile to fix HMR ReferenceError: Button

import { 
  Store, 
  MapPin, 
  Phone, 
  Globe, 
  MessageSquare,
  Sparkles,
  Zap,
  ShieldCheck,
  Link2,
  Camera,
  Map,
  Clock,
  Aperture
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { IndustrySelector, IndustryType } from "@/components/dashboard/industry-selector";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ShopPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [industry, setIndustry] = useState<IndustryType>('SAAS');
  const [shopName, setShopName] = useState("V4 Digital HQ");
  const [marketingTheme, setMarketingTheme] = useState("권위와 신뢰 중심의 프리미엄 마케팅");
  const [industryMap, setIndustryMap] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchInitialData();
  }, []);

  async function fetchInitialData() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // 1. Fetch industries to map codes to IDs
    const { data: industriesData } = await supabase.from('industries').select('*');
    if (industriesData) {
      const map: Record<string, string> = {};
      industriesData.forEach(ind => map[ind.code] = ind.id);
      setIndustryMap(map);
    }

    // 2. Fetch current shop settings
    const { data: settings } = await supabase
      .from('shop_settings')
      .select('*, industries!industry_id(code)')
      .eq('user_id', user.id)
      .single();

    if (settings) {
      if (settings.industries?.code) {
        setIndustry(settings.industries.code as IndustryType);
      }
      setMarketingTheme(settings.marketing_theme || "");
    }

    // 3. Fetch shop name from shops table or profile
    const { data: profile } = await supabase.from('profiles').select('display_name').eq('id', user.id).single();
    if (profile?.display_name) setShopName(profile.display_name);

    setLoading(false);
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const industryId = industryMap[industry];

      // Update shop_settings
      const { error: settingsError } = await supabase
        .from('shop_settings')
        .update({
          industry_id: industryId,
          marketing_theme: marketingTheme,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (settingsError) throw settingsError;

      // Update profile display_name as shop name placeholder
      await supabase.from('profiles').update({ display_name: shopName }).eq('id', user.id);

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-rose-500 animate-spin" />
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">전술 데이터 동기화 중...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pt-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 w-fit">
            <ShieldCheck className="w-4 h-4 text-indigo-500" />
            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest leading-none">비즈니스 사령부 v4.0</span>
          </div>
          <h1 className="text-6xl font-black tracking-tighter uppercase italic leading-[0.9]">
             비즈니스 권위 설정
          </h1>
          <p className="text-zinc-500 font-medium max-w-xl text-lg leading-relaxed">
             "사장님의 비즈니스가 해당 지역에서 압도적 1위의 '권위'를 가질 수 있도록 시스템을 최적화합니다."
          </p>
        </div>
        <Button 
          variant={saved ? "secondary" : "outline"} 
          size="lg" 
          onClick={handleSave}
          disabled={saving}
          className={cn(
            "rounded-2xl font-bold min-w-[140px] transition-all",
            saved && "bg-green-500 hover:bg-green-600 text-white border-none"
          )}
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : (saved ? <CheckCircle2 className="w-4 h-4 mr-2" /> : null)}
          {saving ? "저장 중..." : (saved ? "저장 완료" : "변경사항 저장")}
        </Button>
      </div>

      {/* Industry Selection */}
      <section className="space-y-6">
        <h3 className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-3">
          <Zap className="w-5 h-5 text-amber-500" /> 업종 인텔리전스 선택
        </h3>
        <IndustrySelector selected={industry} onSelect={setIndustry} />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left: Shop Overview */}
        <div className="lg:col-span-2 space-y-10">
          <Card className="relative overflow-hidden p-0 border-none shadow-2xl rounded-[48px]">
             <div className="h-48 bg-gradient-to-tr from-rose-500/20 to-amber-500/20 relative">
               <div className="absolute inset-0 bg-white/10 backdrop-blur-3xl" />
             </div>
             <div className="p-12 -mt-24 relative z-10 space-y-10">
                <div className="flex flex-col md:flex-row items-end gap-8">
                  <div className="w-40 h-40 rounded-[48px] bg-white dark:bg-zinc-900 shadow-2xl p-2 ring-1 ring-zinc-100 dark:ring-zinc-800">
                    <div className="w-full h-full rounded-[40px] bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white text-5xl font-black italic shadow-inner">
                       {shopName.slice(0, 2).toUpperCase()}
                    </div>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">비즈니스 명칭</p>
                      <input 
                        value={shopName}
                        onChange={(e) => setShopName(e.target.value)}
                        className="text-5xl font-black tracking-tighter uppercase italic bg-transparent border-none outline-none focus:ring-2 focus:ring-rose-500/20 rounded-xl w-full"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">브랜딩 메인 주제 / 테마</p>
                      <input 
                        value={marketingTheme}
                        onChange={(e) => setMarketingTheme(e.target.value)}
                        placeholder="예: 현대적인 미니멀리즘, 감성적인 꽃 이야기 등"
                        className="text-xl font-bold tracking-tight text-zinc-500 bg-transparent border-b border-zinc-200 dark:border-zinc-800 outline-none focus:border-rose-500 transition-all w-full pb-2"
                      />
                    </div>

                    <div className="flex flex-wrap gap-4 pt-2">
                       <div className="flex items-center gap-2 text-sm font-bold text-zinc-500">
                         <MapPin className="w-4 h-4" /> 대한민국 서울
                       </div>
                       <div className="flex items-center gap-2 text-sm font-bold text-zinc-500">
                         <Clock className="w-4 h-4" /> 영업시간 10:00 - 20:00
                       </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">글로벌 도달 범위</p>
                    <div className="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-[32px] border border-zinc-100 dark:border-zinc-800 flex items-center justify-between shadow-inner">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl shadow-lg">
                          <Globe className="w-5 h-5" />
                        </div>
                         <span className="font-bold">v4hq.com</span>
                      </div>
                      <Link2 className="text-zinc-300 w-5 h-5" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">매장 상담 센터</p>
                    <div className="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-[32px] border border-zinc-100 dark:border-zinc-800 flex items-center justify-between shadow-inner">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl shadow-lg">
                          <Phone className="w-5 h-5" />
                        </div>
                        <span className="font-bold">+82 10-1234-5678</span>
                      </div>
                       <Button variant="ghost" size="sm">에이전트 상담</Button>
                    </div>
                  </div>
                </div>
             </div>
          </Card>

          <div className="space-y-6">
            <h3 className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-4">
               <Aperture className="w-8 h-8 text-indigo-500 animate-spin-slow" /> 마케팅 채널 허브
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <Card className="hover:border-rose-500/20 transition-all duration-500 p-8">
                  <div className="flex items-center justify-between mb-6">
                     <div className="p-4 bg-gradient-to-tr from-rose-500 to-rose-600 text-white rounded-2xl shadow-xl shadow-rose-500/20">
                        <Camera className="w-6 h-6" />
                     </div>
                     <div className="px-3 py-1 bg-green-50 dark:bg-green-950/20 rounded-full text-green-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <ShieldCheck className="w-3 h-3" /> 실시간 동기화
                     </div>
                  </div>
                  <h4 className="text-xl font-bold italic uppercase tracking-tighter">인스타그램 비즈니스</h4>
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-6">마스터 채널 활성화됨</p>
                  <Button variant="outline" className="w-full">세부 설정 및 관리</Button>
               </Card>
               <Card className="border-dashed flex flex-col items-center justify-center p-8 opacity-60 hover:opacity-100 transition-all">
                  <MessageSquare className="w-12 h-12 text-zinc-200 mb-6" />
                  <p className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-6">네이버 블로그 자동화</p>
                  <Button variant="secondary" className="w-full">채널 연동하기</Button>
               </Card>
            </div>
          </div>
        </div>

        {/* Right: ERP Strategy */}
        <div className="space-y-8">
          <Card className="bg-gradient-to-br from-indigo-900 to-indigo-950 border-none shadow-2xl text-white p-10 rounded-[48px] relative overflow-hidden group">
            <div className="relative z-10 space-y-10">
               <div className="p-4 bg-white/10 rounded-[28px] w-fit shadow-2xl backdrop-blur-xl border border-white/20">
                 <Zap className="w-10 h-10 text-amber-400 fill-amber-400" />
               </div>
               <div className="space-y-4">
                    <h3 className="text-4xl font-black italic uppercase tracking-tighter leading-none">브랜드 권위<br />엔진</h3>
                  <p className="text-indigo-200 text-sm font-medium leading-relaxed">
                    "물리적 한계를 거부하세요. 매장 사장님의 뇌를 딥러닝하여 AI가 대신 홍보하는 프리미엄 자동화 모드를 활성화했습니다."
                  </p>
               </div>
               <div className="space-y-4">
                  <div className="flex justify-between items-end border-b border-white/10 pb-4">
                     <span className="text-xs font-bold uppercase tracking-widest text-indigo-300">시스템 연동 효율</span>
                     <span className="text-2xl font-black italic italic tracking-tighter text-white">98.4%</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-white/10 pb-4">
                     <span className="text-xs font-bold uppercase tracking-widest text-indigo-300">권위 지수 (Score)</span>
                     <span className="text-2xl font-black italic italic tracking-tighter text-amber-400">Elite</span>
                  </div>
               </div>
               <Button 
                 variant="glass" 
                 size="xl" 
                 className="w-full mt-4"
                 onClick={handleSave}
                 disabled={saving}
               >
                 {saving ? "전략 반영 중..." : "마케팅 전략 업그레이드"}
               </Button>
            </div>
            <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-1000" />
            <Sparkles className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5 group-hover:rotate-45 transition-transform duration-[4000ms]" />
          </Card>

          <Card className="p-8 border-none bg-zinc-50 dark:bg-zinc-900 rounded-[40px] shadow-inner">
              <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-6 flex items-center gap-2">
               <Map className="w-4 h-4" /> 브랜드 거점 지도
             </h4>
             <div className="aspect-square bg-zinc-200 dark:bg-black rounded-[32px] overflow-hidden relative shadow-inner">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.1)_0,transparent_100%)] animate-pulse" />
                <div className="flex h-full items-center justify-center">
                    <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-tighter text-zinc-500">
                     도달 범위 분석 중...
                    </div>
                </div>
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
