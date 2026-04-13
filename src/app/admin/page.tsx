'use client';

import React, { useEffect, useState } from 'react';
import { 
  Users, 
  ArrowUpRight, 
  Activity, 
  Server, 
  Zap,
  Clock,
  CheckCircle2,
  TrendingUp,
  CreditCard
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRevenue: 0,
    status: { n8n: '...', ai: '...', db: '...' }
  });
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Fetch stats and recent users in parallel
        const [statsRes, usersRes] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/admin/users')
        ]);

        const statsData = await statsRes.json();
        const usersData = await usersRes.json();

        if (statsData.error) throw new Error(statsData.error);
        if (usersData.error) throw new Error(usersData.error);

        setStats({
          totalUsers: statsData.totalUsers,
          totalRevenue: statsData.totalRevenue,
          status: statsData.status
        });

        // Take only first 5 recent users
        const formattedUsers = (usersData.users || []).slice(0, 5).map((u: any) => ({
          id: u.id,
          name: u.display_name || '(이름 미설정)',
          email: u.email,
          plan: u.subscriptions?.[0]?.plan || 'Free',
          status: u.subscriptions?.[0]?.status === 'active' ? 'Active' : 'Pending',
          date: new Date(u.created_at).toLocaleDateString()
        }));
        setRecentUsers(formattedUsers);

      } catch (err) {
        console.error("Dashboard failed to load:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const kpis = [
    { name: '전체 입점 회원', value: stats.totalUsers.toString(), change: '실시간', icon: Users, color: 'text-indigo-400' },
    { name: '예상 월 매출', value: `₩${(stats.totalRevenue / 10000).toLocaleString()}만`, change: '활성 구독 기준', icon: CreditCard, color: 'text-emerald-400' },
    { name: '시스템 가동 상태', value: stats.status.n8n, change: 'Normal', icon: Server, color: 'text-blue-400' },
    { name: 'DB 가동률', value: '100%', change: 'Stable', icon: Activity, color: 'text-amber-400' },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* 🚀 Main KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((stat) => (
          <div key={stat.name} className="relative group p-6 rounded-3xl bg-[#0f0f12] border border-white/5 hover:border-indigo-500/30 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-indigo-500/10 transition-colors">
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-white/5 text-slate-400">
                {stat.change}
              </div>
            </div>
            <h3 className="text-slate-400 text-sm font-medium mb-1">{stat.name}</h3>
            <p className="text-3xl font-bold text-white tracking-tight">
              {isLoading ? '...' : stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 📋 Recent Business List */}
        <div className="lg:col-span-2 p-8 rounded-[32px] bg-[#0f0f12] border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              최근 가입 비즈니스
            </h2>
            <a href="/admin/users" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors">전체 보기</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="pb-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">비즈니스 정보</th>
                  <th className="pb-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">플랜</th>
                  <th className="pb-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">상태</th>
                  <th className="pb-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">가입일</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="py-16 text-center text-slate-500 text-sm">데이터 분석 중...</td>
                  </tr>
                ) : recentUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-16 text-center text-slate-500 text-sm font-medium italic">입점된 비즈니스가 없습니다.</td>
                  </tr>
                ) : (
                  recentUsers.map((user) => (
                    <tr key={user.id} className="group hover:bg-white/[0.01] transition-colors">
                      <td className="py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-[10px] font-bold text-indigo-400 uppercase tracking-tighter">
                            {user.email[0]}
                          </div>
                          <div>
                            <p className="font-bold text-white text-sm">{user.name}</p>
                            <p className="text-[11px] text-slate-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                          user.plan !== 'Free' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-800 text-slate-500'
                        }`}>
                          {user.plan}
                        </span>
                      </td>
                      <td className="py-5">
                        <div className="flex items-center justify-center gap-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-600'}`} />
                          <span className={`text-[11px] font-bold ${user.status === 'Active' ? 'text-emerald-400' : 'text-slate-500'}`}>
                            {user.status === 'Active' ? '활성' : '대기'}
                          </span>
                        </div>
                      </td>
                      <td className="py-5 text-slate-500 text-[11px] font-medium text-right font-mono">{user.date}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ⚙️ Infrastructure Status */}
        <div className="p-8 rounded-[32px] bg-gradient-to-br from-[#0f0f12] to-[#0a0a0c] border border-white/5 shadow-2xl space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <Zap className="w-5 h-5 text-amber-400" />
            엔진 상태
          </h2>
          
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group hover:border-emerald-500/30 transition-all cursor-default">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-xl group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">n8n Automation</p>
                  <p className="text-[10px] text-slate-500">Master Cloud Connection</p>
                </div>
              </div>
              <div className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black rounded-full uppercase tracking-widest border border-emerald-500/20">
                Online
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group hover:border-indigo-500/30 transition-all cursor-default">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/10 rounded-xl group-hover:scale-110 transition-transform">
                  <Zap className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">OpenAI Neural</p>
                  <p className="text-[10px] text-slate-500">API Latency Standard</p>
                </div>
              </div>
              <div className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[10px] font-black rounded-full uppercase tracking-widest border border-indigo-500/20">
                Healthy
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group hover:border-amber-500/30 transition-all cursor-default">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/10 rounded-xl group-hover:scale-110 transition-transform">
                  <Activity className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Supabase DB</p>
                  <p className="text-[10px] text-slate-500">Production Core Sync</p>
                </div>
              </div>
              <div className="px-2 py-0.5 bg-amber-500/10 text-amber-400 text-[10px] font-black rounded-full uppercase tracking-widest border border-amber-500/20">
                Linked
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5">
            <button className="w-full py-4 bg-white/2 outline-none border border-white/10 hover:bg-white/5 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-lg active:scale-95">
              Run System Diagnostics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
