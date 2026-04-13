"use client";

import { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { 
  LayoutDashboard, 
  Store, 
  Video, 
  FileText, 
  Hash, 
  Settings, 
  LogOut, 
  Menu, 
  Bell,
  Search,
  Sparkles,
  Zap,
  ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string>('user');
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
      } else {
        setUser(session.user);
        // Explicitly fetch the most recent role from profiles
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        if (profileError) {
          console.error("Error fetching profile role:", profileError);
          setRole('user');
        } else if (profile && profile.role) {
          console.log("Verified Role from DB:", profile.role);
          setRole(profile.role);
        } else {
          setRole('user');
        }
      }
    };
    checkAuth();

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [router]);

  const userItems = [
    { icon: LayoutDashboard, label: "중앙 사령부", href: "/dashboard" },
    { icon: Store, label: "비즈니스 프로필", href: "/dashboard/shop" },
    { icon: Video, label: "AI 쇼츠 제작", href: "/dashboard/shorts" },
    { icon: FileText, label: "블로그 자동화", href: "/dashboard/blog" },
    { icon: Hash, label: "스레드 봇", href: "/dashboard/threads" },
    { icon: ShieldCheck, label: "마케팅 검토실", href: "/dashboard/review" },
    { icon: Settings, label: "운영 설정", href: "/dashboard/settings" },
  ];

  const adminItems = [
    { icon: Zap, label: "플랫폼 총괄 제어", href: "/admin", special: true },
    { icon: ShieldCheck, label: "글로벌 인프라", href: "/admin/settings" },
  ];

  return (
    <div className="flex h-screen bg-[#fafafa] dark:bg-[#050505] text-zinc-900 dark:text-zinc-100 overflow-hidden font-sans">
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-500/5 rounded-full blur-[120px] dark:bg-rose-500/10 animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px] dark:bg-indigo-500/10" />
      </div>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 300 : 96 }}
        className={cn(
          "relative hidden lg:flex flex-col border-r border-zinc-100 dark:border-zinc-900 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-3xl z-50 transition-all duration-500 ease-in-out",
          !isSidebarOpen && "items-center"
        )}
      >
        <div className="p-8 flex items-center gap-4">
          <motion.div 
            whileHover={{ rotate: 180 }}
            className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white shrink-0 shadow-2xl shadow-rose-500/30"
          >
            <Sparkles className="w-6 h-6" />
          </motion.div>
          {isSidebarOpen && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col"
            >
              <span className="text-xl font-black tracking-tighter uppercase italic">LilyMag</span>
              <span className="text-[10px] font-black tracking-[0.2em] text-zinc-400 uppercase">자동화 총괄 ERP</span>
            </motion.div>
          )}
        </div>

        <nav className="flex-1 px-6 mt-8 space-y-8 overflow-y-auto custom-scrollbar">
          {/* Admin Section */}
          {role === 'admin' && (
            <div className="space-y-3">
              <span className="px-5 text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-2 block">Platform Control</span>
              {adminItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    className={cn(
                      "flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group relative",
                      isActive 
                        ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/30" 
                        : "text-indigo-400 bg-indigo-500/5 border border-indigo-500/20 hover:bg-indigo-500/10",
                      !isSidebarOpen && "justify-center px-0 w-14 h-14 mx-auto"
                    )}
                  >
                    <item.icon className="w-5 h-5 shrink-0" />
                    {isSidebarOpen && <span className="font-bold text-sm tracking-tight">{item.label}</span>}
                  </Link>
                );
              })}
              <div className="h-px bg-zinc-100 dark:bg-zinc-800 mx-5 my-6" />
            </div>
          )}

          {/* User Section */}
          <div className="space-y-3">
             {role === 'admin' && isSidebarOpen && (
               <span className="px-5 text-[10px] font-black text-rose-400 uppercase tracking-[0.2em] mb-2 block">Marketing Zone</span>
             )}
            {userItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className={cn(
                    "flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group relative",
                    isActive 
                      ? "bg-rose-500 text-white shadow-xl shadow-rose-500/20" 
                      : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-950 dark:hover:text-white",
                    !isSidebarOpen && "justify-center px-0 w-14 h-14 mx-auto"
                  )}
                >
                  <item.icon className={cn(
                    "w-5 h-5 shrink-0 transition-transform", 
                    isActive ? "text-white" : "group-hover:scale-110"
                  )} />
                  {isSidebarOpen && <span className="font-bold text-sm tracking-tight">{item.label}</span>}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="p-6">
          <div className={cn(
            "p-6 rounded-[24px] bg-zinc-900 text-white relative overflow-hidden group mb-6 transition-all",
            !isSidebarOpen && "hidden"
          )}>
            <div className="relative z-10 space-y-2">
              <Zap className="w-6 h-6 text-amber-400 fill-amber-400" />
              <p className="text-xs font-black uppercase tracking-widest text-zinc-400">프로 플랜</p>
              <p className="text-sm font-bold">무제한 AI 콘텐츠 생성</p>
            </div>
            <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-1/4 -translate-y-1/4">
               <Sparkles className="w-24 h-24" />
            </div>
          </div>
          
          <button 
            onClick={async () => {
              await supabase.auth.signOut();
              router.push("/login");
            }}
            className={cn(
              "flex items-center gap-4 px-5 py-4 w-full rounded-2xl text-zinc-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all",
              !isSidebarOpen && "justify-center px-0 h-14"
            )}
          >
            <LogOut className="w-5 h-5" />
            {isSidebarOpen && <span className="font-bold text-sm">로그아웃</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className={cn(
          "h-24 flex items-center justify-between px-10 z-40 transition-all duration-300",
          scrolled ? "bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-zinc-100 dark:border-zinc-900" : "bg-transparent"
        )}>
          <div className="flex items-center gap-8">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-2xl text-zinc-500"
            >
              <Menu className="w-6 h-6" />
            </motion.button>
            <div className="hidden md:flex items-center gap-4 px-6 py-3 bg-zinc-100 dark:bg-zinc-900/50 rounded-2xl text-zinc-400 text-sm border border-transparent focus-within:border-rose-500/20 transition-all">
              <Search className="w-4 h-4" />
              <input 
                type="text" 
                placeholder="캠페인, 매장 설정 검색..." 
                className="bg-transparent border-none outline-none focus:ring-0 text-zinc-600 dark:text-zinc-300 placeholder-zinc-500 font-medium w-64"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2 px-4 py-2 bg-rose-50 dark:bg-rose-950/20 rounded-full border border-rose-100 dark:border-rose-900/50">
               <div className="w-2 h-2 bg-rose-500 rounded-full animate-ping" />
               <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest leading-none">시스템 가동 중</span>
             </div>
            
            <button className="relative p-3 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-2xl transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-zinc-900 shadow-sm" />
            </button>
            
            <div className="h-10 w-[1px] bg-zinc-200 dark:bg-zinc-800 hidden sm:block" />
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-4 p-1.5 pl-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm cursor-pointer"
            >
               <div className="flex flex-col items-end">
                 <span className="text-xs font-black tracking-tight">{user?.email?.split('@')[0] || 'User'}</span>
                 <span className={cn(
                    "text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full",
                    role === 'admin' ? "bg-[#ff006e] text-white shadow-lg shadow-[#ff006e]/30 animate-pulse" : "text-zinc-400 border border-zinc-200"
                 )}>
                   {role === 'admin' ? "관리자" : "일반 사용자"}
                 </span>
               </div>
               <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-400 shadow-lg shadow-rose-500/20 flex items-center justify-center text-white font-black uppercase">
                 {user?.email?.charAt(0) || 'U'}
               </div>
            </motion.div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative px-10 pt-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="pb-20"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
