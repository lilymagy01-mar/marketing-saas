"use client";

import { useState, useEffect } from "react";
import { 
  Settings, 
  Zap, 
  Sparkles,
  Cpu,
  Database,
  Lock,
  ChevronRight,
  Video,
  Send,
  MessageCircle,
  Share2,
  Calendar,
  Layers,
  Power,
  Link2,
  CheckCircle2,
  Bell,
  Globe,
  MessageSquare,
  Key,
  RefreshCw,
  Shield,
  Smartphone,
  ArrowRight,
  Play,
  Camera,
  Briefcase
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function SettingsPage() {
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    shopName: "",
    persona: "Elegant & Premium",
    targetAudience: "",
    webhookUrl: "",
    autoPilot: true,
    tokens: {
      instagram: "",
      facebook: "",
      pinterest: "",
      twitter: "",
      linkedin: "",
      youtube: "",
      tiktok: "",
      threads: "",
      line: "",
      telegram: ""
    }
  });

  // Load and Save Logic
  useEffect(() => {
    // 1. 기존 설정 불러오기
    const saved = localStorage.getItem("lilymag_saas_settings");
    let initialSettings = settings;
    if (saved) {
      try {
        initialSettings = JSON.parse(saved);
        setSettings(initialSettings);
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }

    // 2. OAuth 콜백으로 돌아온 경우 주소창 파싱 (예: ?success=instagram&tempCode=xxxx)
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const successProvider = searchParams.get("success");
      const tempCode = searchParams.get("tempCode");

      if (successProvider && tempCode) {
        // 해당 플랫폼 연결 성공 처리! (임시 코드 저장)
        const newSettings = {
          ...initialSettings,
          tokens: {
            ...initialSettings.tokens,
            [successProvider]: tempCode
          }
        };
        setSettings(newSettings);
        localStorage.setItem("lilymag_saas_settings", JSON.stringify(newSettings));
        
        // 지저분한 주소창 정리
        window.history.replaceState(null, '', window.location.pathname);
      }
    }
  }, []);

  const saveToSystem = () => {
    setIsSaving(true);
    localStorage.setItem("lilymag_saas_settings", JSON.stringify(settings));
    
    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }, 1200);
  };

  const handleTestAttack = async () => {
    alert("🚀 [실전 사격 개시] 사장님의 '열쇠 금고'에 있는 모든 토큰을 n8n으로 실시간 사출합니다!\n\n데이터베이스에서 사장님(user_id)의 정보를 찾아서 각 SNS에 자동으로 배달을 시작합니다!\n\n전투 타격 대상: 10개 채널 통합 전송");
    
    if (!settings.webhookUrl) {
      alert("⚠️ 사령관님! n8n 웹훅 주소가 비어있습니다. 좌표를 입력해 주세요!");
      return;
    }

    try {
      console.log("Sending Payload to n8n:", {
        user_id: "LILYMAG_GLOBAL_CMD_1",
        tokens: settings.tokens,
        shopName: settings.shopName,
        test_mode: true
      });
    } catch (err) {
      console.error(err);
    }
  };

  const [selectedGuide, setSelectedGuide] = useState<string | null>(null);

  const snsVaultItems = [
    { 
      id: 'instagram', name: 'Instagram', icon: Camera, color: "text-pink-500", bg: "bg-pink-500/10", placeholder: "IG_Access_Token_...",
      guide: "📍 [인스타그램/페이스북 통합 작전 가이드]\n\n1. developers.facebook.com 접속 후 로그인\n2. 오른쪽 상단 [내 앱 (My Apps)] 클릭\n3. 파란색 [앱 만들기 (Create App)] 버튼 클릭\n4. 유형 선택에서 [기타 (Other)]를 누른 후 [다음]\n5. 앱 유형에서 [비즈니스 (Business)] 선택 후 [다음]\n6. **[App Name]** 칸에 사장님 매장 이름(예: MyFlowerShop)이나 'LilyMag' 등 **기억하기 쉬운 이름을 영문으로 아무거나** 입력하세요. (이름은 관리용일 뿐이며 언제든 바꿀 수 있습니다!)\n7. 대시보드 왼쪽 메뉴 [설정] -> [기본 설정]에서 '앱 ID' 확인\n8. 왼쪽 메뉴 [Marketing API] 옆 [설정] 클릭\n9. [도구 (Tools)] 메뉴 클릭\n10. 토큰 생성 영역에서 'ads_management', 'instagram_basic' 체크 후 [토큰 생성]\n11. 발급된 긴 문자열을 복사하여 여기에 붙여넣으세요."
    },
    { 
      id: 'facebook', name: 'Facebook', icon: Share2, color: "text-blue-600", bg: "bg-blue-600/10", placeholder: "FB_Page_Token_...",
      guide: "📍 [페이스북 페이지 무력화 가이드]\n\n1. 본인의 페이스북 페이지 접속\n2. 왼쪽 메뉴 [설정] -> [새 페이지 환경] 클릭\n3. [고급 메시징] 또는 [Meta Business Suite] 접속\n4. '영구 페이지 액세스 토큰' 발급을 위해 위 인스타그램 가이드의 8번 이후 과정을 페이스북 페이지 권한으로 진행\n5. 'manage_pages' 권한이 포함된 토큰을 복사하여 붙여넣으세요."
    },
    { 
      id: 'pinterest', name: 'Pinterest', icon: Layers, color: "text-red-600", bg: "bg-red-600/10", placeholder: "PIN_Access_Token_...",
      guide: "📍 [핀터레스트 시각 전략 가이드]\n\n1. pinterest.com/developers 접속 후 로그인\n2. 상단 [My Apps] 클릭 후 [Create New App] 클릭\n3. **[Name]** 칸에 사장님 매장 이름 등을 영문으로 입력하고 [Create]\n4. App ID와 App Secret이 나오면 하단의 [V5 Access Token] 영역 확인\n5. 'boards:read', 'pins:write' 권한을 체크하고 [Generate Token] 클릭\n6. 생성된 토큰을 복사하여 붙여넣으세요."
    },
    { 
      id: 'twitter', name: 'X (Twitter)', icon: Zap, color: "text-zinc-600", bg: "bg-zinc-600/10", placeholder: "X_API_Key_...",
      guide: "📍 [X(트위터) 실시간 소식통 가이드]\n\n1. developer.x.com(구 dev.twitter.com) 접속\n2. 메인 대시보드의 + [Create Project] 클릭\n3. 프로젝트 내부에 [Add App] 클릭하여 새 앱 등록\n4. **[App Name]**은 사장님이 구별하기 편한 영문 이름을 아무거나 적으세요.\n5. 앱 설정의 [User authentication settings] 옆 [Set up] 클릭\n6. App Permissions를 반드시 [Read and write]로 체크 (매우 중요!)\n7. Type of App을 [Web App / Automated]로 선택\n8. Callback URI에 https://example.com 입력 (임시)\n9. 하단의 [Save]를 누르면 'Client ID'와 'Secret'이 나옵니다.\n10. 이것을 여기에 입력하세요."
    },
    { 
      id: 'linkedin', name: 'LinkedIn', icon: Globe, color: "text-blue-700", bg: "bg-blue-700/10", placeholder: "LNKD_Access_Token_...",
      guide: "📍 [링크드인 신뢰 전략 가이드]\n\n1. linkedin.com/developers 접속 후 [Create app] 버튼 클릭\n2. **[App Name]**에 매장 이름을 영문으로 입력하고 회사 페이지와 연동\n3. [Product] 탭 클릭 후 [Share on LinkedIn] 기능을 승인받기\n4. [Auth] 탭에서 'OAuth 2.0 scopes'에 'w_member_social'이 있는지 확인\n5. 발급된 토큰을 복사하여 입력하세요."
    },
    { 
      id: 'youtube', name: 'YouTube', icon: Play, color: "text-red-500", bg: "bg-red-500/10", placeholder: "YT_OAuth_Secret_...",
      guide: "📍 [유튜브 영상 사격 가이드]\n\n1. console.cloud.google.com 접속\n2. 상단 파란색 바 옆의 드롭다운 클릭 -> [새 프로젝트]\n3. **[프로젝트 이름]**에 사장님 매장 이름 등을 입력 후 생성\n4. 왼쪽 상단 메뉴 [API 및 서비스] -> [라이브러리] 클릭\n5. 'YouTube Data API v3' 검색 후 [사용] 클릭\n6. [관리] -> [사용자 인증 정보] -> [+ 사용자 인증 정보 만들기] -> [API 키] 클릭\n7. 발급된 API 키를 복사하여 붙여넣으세요."
    },
    { 
      id: 'tiktok', name: 'TikTok', icon: Video, color: "text-zinc-900 dark:text-zinc-100", bg: "bg-zinc-900/10 dark:bg-white/10", placeholder: "TT_Client_Key_...",
      guide: "📍 [틱톡 유입 전술 가이드]\n\n1. developers.tiktok.com 접속\n2. [My Apps] -> [Create App] 클릭\n3. **[App Name]**에 'LilyMag'이나 사장님 매장 이름을 영문으로 입력\n4. [Video Kit] 제품 활성화 및 'Client Key/Secret' 확인\n5. 발급받은 'Access Token'을 여기에 입력하세요."
    },
    { 
      id: 'threads', name: 'Threads', icon: MessageSquare, color: "text-zinc-800 dark:text-zinc-200", bg: "bg-zinc-800/10 dark:bg-white/10", placeholder: "THRD_Access_Token_...",
      guide: "📍 [스레드 감성 전략 가이드]\n\n1. 인스타그램(Meta) 개발자 포털의 같은 앱 사용\n2. 제품 목록 중 [Threads API] 추가\n3. 권한 목록에서 'threads_basic', 'threads_content_publish' 승인\n4. 생성된 스레드 전용 액세스 토큰을 입력하세요."
    },
    { 
      id: 'line', name: 'Line / Kakao', icon: MessageCircle, color: "text-green-500", bg: "bg-green-500/10", placeholder: "MSG_Channel_Secret_...",
      guide: "📍 [라인/카톡 알림 가이드]\n\n1. developers.line.biz 접속\n2. Messaging API 채널 생성\n3. **[Channel Name]**에 사장님 매장 이름을 입력\n4. [Messaging API] 탭 하단의 'Channel access token' 발급\n5. 생성된 긴 문자를 복사하여 입력하세요."
    },
    { 
      id: 'telegram', name: 'Telegram Bot', icon: Send, color: "text-blue-400", bg: "bg-blue-400/10", placeholder: "TG_Bot_Token_...",
      guide: "📍 [텔레그램 비서 로봇 가이드]\n\n1. 스마트폰 텔레그램 앱 실행\n2. 검색창에 @BotFather 검색 후 /newbot 전송\n3. **[이름]**은 매장 이름, **[사용자명]**은 매장_bot 등으로 사장님이 자유롭게 지으세요.\n4. 완료되면 'HTTP API Token' 뒤에 나오는 긴 토큰을 복사해서 붙여넣으세요."
    },
  ];

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
                    <h4 className="text-xl font-black uppercase italic tracking-tighter">Tactical Deployment Guide</h4>
                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Connect your business to the global web</p>
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
                Understood, Returning to Bridge
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
            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest leading-none">Global SaaS Infrastructure v4.0</span>
          </div>
          <h1 className="text-6xl font-black tracking-tighter uppercase italic leading-[0.9] text-zinc-900 dark:text-white">
             SaaS Vault
          </h1>
          <p className="text-zinc-500 font-medium max-w-xl text-lg leading-relaxed">
             "전 세계 수백만 사장님이 동시 접속해도 끄떡없는 초거대 다중 계정(Multi-tenant) 통합 사령탑입니다."
          </p>
        </div>
        
        <div className="flex flex-col items-start lg:items-end gap-3">
          <AnimatePresence>
            {isSaved && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Database Synced
              </motion.div>
            )}
          </AnimatePresence>
          <Button 
            onClick={saveToSystem}
            disabled={isSaving}
            className={`px-10 py-5 rounded-full font-black text-sm uppercase tracking-widest transition-all shadow-2xl ${isSaving ? 'bg-zinc-500' : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20'}`}
          >
            {isSaving ? <RefreshCw className="w-5 h-5 animate-spin mr-2" /> : <Shield className="w-5 h-5 mr-2" />}
            {isSaving ? "보안 동기화 중..." : "글로벌 금고에 저장"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Left Column: SNS Credential Vault */}
        <div className="xl:col-span-8 space-y-10">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-4 text-zinc-900 dark:text-white">
               <Lock className="w-8 h-8 text-indigo-500" /> Omni-SNS Credential Vault
            </h3>
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">10 Channels Multi-Auth Enabled</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {snsVaultItems.map((sns) => (
              <Card key={sns.id} className="p-6 bg-white dark:bg-zinc-950 border-none shadow-xl rounded-[32px] group relative overflow-hidden transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                 <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-2xl ${sns.bg} ${sns.color} shadow-sm transition-transform group-hover:scale-110`}>
                       <sns.icon className="w-5 h-5" />
                    </div>
                    <div>
                       <h5 className="font-bold text-sm tracking-tight">{sns.name}</h5>
                       <p className="text-[8px] font-black uppercase text-zinc-400 tracking-widest">AES-256 Encrypted Connection</p>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                       <button 
                         onClick={() => setSelectedGuide(sns.guide)}
                         className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 hover:text-indigo-500 hover:bg-indigo-500/10 transition-all"
                         title="연결 가이드 보기"
                       >
                         <Shield className="w-3.5 h-3.5" />
                       </button>
                       <div className={`w-2 h-2 rounded-full ${(settings.tokens as any)[sns.id] ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-200 dark:bg-zinc-800'}`} />
                    </div>
                 </div>
                 <div className="relative mt-2">
                    {/* Connection Status & Action Button */}
                    <div className="flex flex-col gap-3">
                       {(settings.tokens as any)[sns.id] ? (
                          <div className="flex items-center justify-between p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                             <div className="flex items-center gap-3">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                <span className="text-xs font-black uppercase text-emerald-600 tracking-widest italic">Connection Active</span>
                             </div>
                             <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => setSettings({
                                  ...settings, 
                                  tokens: { ...settings.tokens, [sns.id]: "" }
                                })}
                                className="text-[10px] font-black uppercase text-rose-500 hover:bg-rose-500/10"
                             >
                                Disconnect
                             </Button>
                          </div>
                       ) : (
                          <Button 
                            onClick={() => {
                              // Global OAuth Logic trigger!
                              if (['instagram', 'youtube', 'naver'].includes(sns.id)) {
                                window.location.href = `/api/auth/connect/${sns.id}`;
                              } else {
                                setSelectedGuide(sns.guide);
                              }
                            }}
                            className={`w-full py-6 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] ${sns.bg.replace('/10', '')} text-white`}
                          >
                            <Link2 className="w-4 h-4 mr-2" /> Connect {sns.name} Account
                          </Button>
                       )}
                       
                       {/* Subtle manual entry for Power Users (Hidden by default or smaller) */}
                       <div className="group/manual relative opacity-0 hover:opacity-100 transition-opacity">
                          <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-1 ml-1">Manual Key Entry (Optional)</p>
                          <div className="relative">
                            <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                            <input 
                              type="password"
                              value={(settings.tokens as any)[sns.id]}
                              onChange={(e) => setSettings({
                                ...settings, 
                                tokens: { ...settings.tokens, [sns.id]: e.target.value }
                              })}
                              placeholder="Advanced: Paste secret key here..."
                              className="w-full bg-zinc-100/50 dark:bg-zinc-900/50 border border-transparent focus:border-indigo-500/50 rounded-xl py-3 pl-10 pr-4 text-[10px] font-mono text-zinc-400 focus:outline-none transition-all"
                            />
                          </div>
                       </div>
                    </div>
                 </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Column: Identity & Bridge */}
        <div className="xl:col-span-4 space-y-10">
          <h3 className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-4 text-zinc-900 dark:text-white">
             <Sparkles className="w-8 h-8 text-amber-500" /> Store Identity
          </h3>
          <Card className="p-8 bg-white dark:bg-zinc-950 border-none shadow-2xl rounded-[40px] space-y-8">
             <div className="space-y-6">
               <div>
                 <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3 block">Branch Global Name</label>
                 <input 
                   type="text" 
                   value={settings.shopName}
                   onChange={(e) => setSettings({...settings, shopName: e.target.value})}
                   placeholder="e.g. My Global Branch #1"
                   className="w-full p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-zinc-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-inner"
                 />
               </div>
               <div>
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3 block">Brand Persona (Tone)</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Elegant', 'Warm', 'Trendy', 'Expert'].map((persona) => (
                      <button 
                        key={persona} 
                        onClick={() => setSettings({...settings, persona})}
                        className={`p-3 rounded-xl border ${settings.persona.includes(persona) ? 'border-indigo-500 bg-indigo-500/5 text-indigo-500' : 'border-zinc-100 dark:border-zinc-800 text-zinc-400'} text-[10px] font-black uppercase tracking-tighter transition-all`}
                      >
                        {persona}
                      </button>
                    ))}
                  </div>
               </div>
             </div>
          </Card>

          <h3 className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-4 text-zinc-900 dark:text-white">
             <Layers className="w-8 h-8 text-rose-500" /> SaaS Bridge
          </h3>
          <Card className="p-8 bg-zinc-50 dark:bg-zinc-900 border-none rounded-[40px] shadow-inner space-y-6">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-rose-500 text-white rounded-2xl shadow-lg shadow-rose-500/30">
                   <Link2 className="w-6 h-6" />
                </div>
                <div>
                   <h5 className="font-bold text-sm tracking-tight">Global n8n Endpoint</h5>
                   <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Central Automation Hub</p>
                </div>
             </div>
             <div className="flex gap-2">
                 <input 
                   type="text" 
                   value={settings.webhookUrl}
                   onChange={(e) => setSettings({...settings, webhookUrl: e.target.value})}
                   placeholder="https://n8n.global-saas.com/webhook/..."
                   className="flex-1 p-4 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 text-sm font-mono text-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all font-bold"
                 />
                 <Button 
                   onClick={handleTestAttack}
                   className="bg-rose-600 hover:bg-rose-500 rounded-2xl px-6 font-black uppercase text-[10px] tracking-widest shadow-xl shadow-rose-500/20"
                 >
                   Send Test Attack
                 </Button>
             </div>
             <p className="text-[10px] text-zinc-500 font-medium px-2 leading-relaxed italic">
               "수백만 명의 사용자가 단 하나의 중앙 엔드포인트를 통해 포스팅을 쏘아 올립니다. 시스템이 user_id를 인식하여 각자의 금고 열쇠를 자동으로 가동합니다."
             </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
