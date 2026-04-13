"use client";

import { useState, useEffect } from "react";
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
  ChevronRight,
  Loader2,
  AlertCircle,
  Activity
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { AgentThoughtConsole } from "@/components/dashboard/agent-thought-console";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { label: "총 도달수", value: "1.2M", change: "+0%", icon: Users, color: "from-rose-500 to-rose-600" },
    { label: "AI 생성 콘텐츠", value: "0", change: "New", icon: Sparkles, color: "from-amber-400 to-amber-600" },
    { label: "전환율", value: "4.8%", change: "+0%", icon: TrendingUp, color: "from-indigo-500 to-indigo-600" },
    { label: "자율 주행 모드", value: "OFF", change: "-", icon: Zap, color: "from-emerald-500 to-emerald-600" },
  ]);

  const [recentCampaigns, setRecentCampaigns] = useState<any[]>([]);
  const [isTesting, setIsTesting] = useState(false);

  async function fetchDashboardData() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    // USER METRICS
    const { count: campaignCount } = await supabase
      .from('campaigns')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    const { data: shopSettings } = await supabase
      .from('shop_settings')
      .select('auto_pilot_enabled')
      .eq('user_id', user.id)
      .single();

    const { data: campaigns } = await supabase
      .from('campaigns')
      .select('*, campaign_contents(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(3);

    setStats([
      { label: "총 도달수", value: "1.2M", change: "+12.5%", icon: Users, color: "from-rose-500 to-rose-600" },
      { label: "AI 생성 콘텐츠", value: (campaignCount || 0).toString(), change: "+42%", icon: Sparkles, color: "from-amber-400 to-amber-600" },
      { label: "전환율", value: "4.8%", change: "+1.2%", icon: TrendingUp, color: "from-indigo-500 to-indigo-600" },
      { label: "자율 주행 모드", value: shopSettings?.auto_pilot_enabled ? "가동중" : "중지됨", change: "시스템 정상", icon: Zap, color: "from-emerald-500 to-emerald-600" },
    ]);

    if (campaigns) setRecentCampaigns(campaigns);
    setLoading(false);
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleLaunchTest = async () => {
    setIsTesting(true);
    try {
      await fetch('/api/automation/cron');
      setTimeout(fetchDashboardData, 3000);
    } catch (error) {
      console.error("Test Launch Failed:", error);
    } finally {
      setIsTesting(false);
    }
  };

  const quickActions = [
    { title: "쇼츠 시나리오 생성", description: "사진 한 장으로 바이럴 영상 기획", icon: Video, color: "bg-rose-500", href: "/dashboard/shorts" },
    { title: "AI 블로그 포스팅", description: "권위 있는 전문 콘텐츠 자동 작성", icon: FileText, color: "bg-indigo-500", href: "/dashboard/blog" },
    { title: "스레드 바이럴 팩", description: "지역 고객과 실시간 소통 강화", icon: Hash, color: "bg-amber-400", href: "/dashboard/threads" },
  ];

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-rose-500 animate-spin" />
        <p className="text-sm font-black uppercase tracking-widest text-zinc-500">통합 사령부 동기화 중...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pt-8">
        <div className="space-y-3">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-rose-50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/50"
          >
            <Sparkles className="w-4 h-4 text-rose-500" />
            <span className="text-[10px] font-black uppercase tracking-widest leading-none text-rose-500">
              전개 구역 인텔리전스 활성
            </span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl font-black tracking-tighter uppercase italic leading-[0.9] text-zinc-900 dark:text-white"
          >
            중앙 사령부
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
              <Button 
                variant="outline" 
                size="lg" 
                onClick={handleLaunchTest} 
                disabled={isTesting}
                className="border-zinc-200 dark:border-zinc-800 font-bold uppercase tracking-widest text-[10px]"
              >
                {isTesting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Zap className="w-4 h-4 mr-2 text-amber-500" />}
                테스트 작전 개시
              </Button>
              <Link href="/dashboard/shorts">
                <Button size="lg" className="bg-rose-500 hover:bg-rose-600 text-white font-black italic shadow-xl shadow-rose-500/20">
                  <Sparkles className="w-5 h-5 mr-3 shrink-0" /> 신규 캠페인 런칭
                </Button>
              </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-6 group hover:border-rose-500/20 transition-all duration-500 relative overflow-hidden bg-white dark:bg-zinc-950 border-none shadow-xl rounded-[32px]">
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
                <h3 className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-white">{stat.value}</h3>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area: Recent Campaigns */}
        <div className="lg:col-span-2 space-y-8">
          <h3 className="text-3xl font-black italic uppercase tracking-tighter flex items-center gap-4 text-zinc-900 dark:text-white">
             <TrendingUp className="w-8 h-8 text-indigo-500" /> 최근 배포된 전략 리포트
          </h3>
          
          {recentCampaigns.length === 0 ? (
            <Card className="min-h-[400px] flex flex-col items-center justify-center border-dashed border-2 border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 rounded-[40px] p-12 text-center">
              <div className="p-8 bg-white dark:bg-zinc-900 rounded-[40px] mb-6 shadow-xl ring-1 ring-zinc-100 dark:ring-zinc-800">
                <AlertCircle className="w-16 h-16 text-zinc-300 dark:text-zinc-700" />
              </div>
              <h4 className="text-2xl font-black uppercase italic tracking-tighter mb-2">활성화된 임무 없음</h4>
              <p className="text-zinc-500 text-sm max-w-xs mx-auto mb-8 font-medium">
                아직 생성된 캠페인이 없습니다. 첫 번째 AI 마켓팅 작전을 개시하십시오.
              </p>
              <Link href="/dashboard/shorts">
                <Button className="px-12 py-6 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-black uppercase tracking-widest text-[10px]">초기 작전 기획</Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-4">
              {recentCampaigns.map((camp) => (
                <Card key={camp.id} className="p-8 bg-gradient-to-br from-zinc-900 to-black text-white rounded-[40px] overflow-hidden relative group border-none">
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center gap-3 px-3 py-1 bg-white/10 rounded-full border border-white/5">
                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-cyan-400">{camp.status === 'scheduled' ? '전송 대기중' : camp.status}</span>
                      </div>
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                        {new Date(camp.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">캠페인 인텔리전스</p>
                        <h4 className="text-3xl font-black tracking-tighter uppercase italic leading-none group-hover:text-cyan-400 transition-colors">
                          "{camp.title}"
                        </h4>
                      </div>
                      
                      <div className="flex items-center gap-6">
                         <div className="space-y-2">
                           <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">콘텐츠 유형</p>
                           <span className="px-3 py-1 bg-zinc-800 rounded-lg text-[9px] font-black text-zinc-300 uppercase italic tracking-tighter">
                             {camp.type === 'shorts' ? '바이럴 영상' : camp.type === 'blog' ? 'SEO 블로그' : '소셜 포스트'}
                           </span>
                         </div>
                         <div className="space-y-2">
                           <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">타겟 리전</p>
                           <span className="px-3 py-1 bg-zinc-800 rounded-lg text-[9px] font-black text-zinc-300 uppercase italic tracking-tighter">
                             {camp.country === 'KR' ? '대한민국(KR)' : camp.country === 'CN' ? '중국(CN)' : camp.country === 'US' ? '미국(US)' : '일본(JP)'}
                           </span>
                         </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                      <p className="text-[10px] font-medium text-zinc-500 italic">
                        {camp.status === 'published' ? "작전 전개 완료 (글로벌)." : "최종 명령 대기 / 자동 배포 준비 완료."}
                      </p>
                      <Button className="bg-white text-black font-black px-8 rounded-2xl hover:scale-105 transition-all text-[10px] uppercase tracking-widest">
                        리포트 확인
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions Panel & Agent Console */}
        <div className="space-y-8 flex flex-col">
          <h3 className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-3 text-zinc-900 dark:text-white">
             <ArrowUpRight className="w-6 h-6 text-rose-500" /> 작전 전개 구역
          </h3>
          
          <div className="space-y-4">
            {quickActions.map((action) => (
              <Link key={action.title} href={action.href}>
                <motion.div 
                  whileHover={{ x: 10, scale: 1.02 }}
                  className="group relative flex items-center gap-5 p-6 bg-white dark:bg-zinc-950 rounded-[32px] border border-zinc-100 dark:border-zinc-900 shadow-sm hover:shadow-2xl hover:shadow-rose-500/10 cursor-pointer transition-all duration-300"
                >
                   <div className={`p-4 rounded-2xl ${action.color} text-white shadow-xl shadow-${action.color}/20 group-hover:rotate-12 transition-transform`}>
                     <action.icon className="w-6 h-6" />
                   </div>
                   <div className="flex-1">
                     <h4 className="font-bold text-lg tracking-tight uppercase italic text-zinc-900 dark:text-white">{action.title}</h4>
                     <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{action.description}</p>
                   </div>
                   <ChevronRight className="w-5 h-5 text-zinc-300 group-hover:text-rose-500 transition-colors" />
                </motion.div>
              </Link>
            ))}
          </div>

          <div className="flex-1 min-h-[400px]">
            <h3 className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-3 text-zinc-900 dark:text-white mb-4">
              <Activity className="w-5 h-5 text-emerald-500" /> 코어 신경망 로그 (Cortex)
            </h3>
            <AgentThoughtConsole />
          </div>

          <Card className="bg-gradient-to-br from-indigo-900 to-purple-950 text-white p-8 overflow-hidden relative group border-none rounded-[40px] shadow-2xl">
             <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-white/10 rounded-2xl w-fit">
                    <Sparkles className="w-6 h-6 text-amber-400" />
                  </div>
                  <div className="px-3 py-1 bg-emerald-500 text-black text-[8px] font-black uppercase rounded-full">Pro Advisor</div>
                </div>
                <div className="space-y-3">
                   <h4 className="text-2xl font-black tracking-tighter uppercase italic leading-none">주간 통찰 리포트</h4>
                   <p className="text-zinc-300 text-xs font-bold leading-relaxed">
                     "이번 주 트렌드 키워드에 130% 집중하세요. AI가 당신의 비즈니스에 최적화된 스위트 스팟을 찾아냈습니다."
                   </p>
                </div>
                <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white hover:text-indigo-950 font-black uppercase text-[10px] tracking-widest rounded-2xl py-6">전략 활성화</Button>
             </div>
             <div className="absolute -bottom-10 -right-10 p-4 opacity-10 group-hover:scale-150 transition-transform duration-1000">
               <TrendingUp className="w-64 h-64" />
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
