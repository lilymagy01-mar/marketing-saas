import React from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Settings, 
  Zap, 
  ShieldCheck,
  LogOut,
  Bell
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white font-sans selection:bg-indigo-500/30">
      {/* Side Navigation - Command Center Style */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-[#0f0f12] border-r border-white/5 z-50">
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            LilyMag Admin
          </span>
        </div>

        <nav className="p-4 space-y-2 mt-4">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 transition-all">
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">사령부 상태</span>
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all">
            <Users className="w-5 h-5" />
            <span className="font-medium">구독 꽃집 관리</span>
          </Link>
          <Link href="/admin/subscriptions" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all">
            <CreditCard className="w-5 h-5" />
            <span className="font-medium">매출 및 플랜</span>
          </Link>
          <div className="pt-4 pb-2 px-4">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Infrastructure</span>
          </div>
          <Link href="/admin/nodes" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all">
            <Zap className="w-5 h-5" />
            <span className="font-medium">n8n 노드 상태</span>
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all">
            <Settings className="w-5 h-5" />
            <span className="font-medium">전역 시스템 설정</span>
          </Link>
        </nav>

        <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-gradient-to-t from-slate-900 to-slate-800/50 border border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-slate-700 border border-white/10 overflow-hidden" />
            <div>
              <p className="text-xs font-bold text-white">Super Admin</p>
              <p className="text-[10px] text-slate-500">System Operator</p>
            </div>
          </div>
          <button className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2">
            <LogOut className="w-3 h-3" /> 안전하게 나가기
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-64 p-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">시스템 중앙 사령부</h1>
            <p className="text-slate-400 text-sm">전체 꽃집 구독 현황 및 인프라 상태를 실시간 모니터링합니다.</p>
          </div>
          <div className="flex gap-4">
            <button className="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all relative">
              <Bell className="w-5 h-5 text-slate-300" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
            </button>
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-emerald-400">System Normal</span>
            </div>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}
