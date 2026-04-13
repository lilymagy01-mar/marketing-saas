import React from 'react';
import { 
  Users, 
  ArrowUpRight, 
  ArrowDownRight, 
  Activity, 
  Server, 
  Zap,
  Clock,
  CheckCircle2
} from 'lucide-react';

export default function AdminDashboard() {
  // Mock data - In production this will come from Supabase Admin query
  const stats = [
    { name: '전체 활성 꽃집', value: '8', change: '+2', changeType: 'increase', icon: Users },
    { name: '프리미엄 구독', value: '3', change: '+1', changeType: 'increase', icon: Activity },
    { name: 'n8n 노드 가동률', value: '99.9%', change: 'Normal', changeType: 'neutral', icon: Server },
    { name: 'AI 평균 응답', value: '1.2s', change: '-0.2s', changeType: 'increase', icon: Zap },
  ];

  const recentUsers = [
    { id: 1, name: '들꽃 인테리어', email: 'wildflower@example.com', plan: 'Premium', status: 'Active', date: '2024.04.12' },
    { id: 2, name: '라라 플라워', email: 'lala@example.com', plan: 'Free', status: 'Active', date: '2024.04.11' },
    { id: 3, name: '블룸가든', email: 'bloom@example.com', plan: 'Premium', status: 'Pending', date: '2024.04.10' },
  ];

  return (
    <div className="space-y-8">
      {/* 🚀 Main KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="relative group p-6 rounded-3xl bg-[#0f0f12] border border-white/5 hover:border-indigo-500/30 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-indigo-500/10 transition-colors">
                <stat.icon className="w-6 h-6 text-slate-400 group-hover:text-indigo-400" />
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${
                stat.changeType === 'increase' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-400'
              }`}>
                {stat.change}
                {stat.changeType === 'increase' ? <ArrowUpRight className="w-3 h-3" /> : null}
              </div>
            </div>
            <h3 className="text-slate-400 text-sm font-medium mb-1">{stat.name}</h3>
            <p className="text-3xl font-bold text-white tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 📋 Recent Shop List */}
        <div className="lg:col-span-2 p-8 rounded-3xl bg-[#0f0f12] border border-white/5 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <Users className="w-5 h-5 text-indigo-400" />
              신규 입점 꽃집
            </h2>
            <button className="text-xs font-bold text-indigo-400 hover:text-indigo-300">전체 보기</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="pb-4 text-xs font-bold text-slate-500 uppercase tracking-widest">매장명</th>
                  <th className="pb-4 text-xs font-bold text-slate-500 uppercase tracking-widest">이메일</th>
                  <th className="pb-4 text-xs font-bold text-slate-500 uppercase tracking-widest">플랜</th>
                  <th className="pb-4 text-xs font-bold text-slate-500 uppercase tracking-widest">상태</th>
                  <th className="pb-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">등록일</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentUsers.map((user) => (
                  <tr key={user.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 font-bold text-white text-sm">{user.name}</td>
                    <td className="py-4 text-slate-400 text-sm">{user.email}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                        user.plan === 'Premium' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-slate-700/30 text-slate-500 border border-white/5'
                      }`}>
                        {user.plan}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                        <span className="text-xs text-slate-300">{user.status}</span>
                      </div>
                    </td>
                    <td className="py-4 text-slate-500 text-sm text-right">{user.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ⚙️ Infrastructure Status */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-[#121217] to-[#0f0f12] border border-white/5 shadow-2xl space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <Server className="w-5 h-5 text-emerald-400" />
            인프라 헬스 체크
          </h2>
          
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">n8n 마스터 노드</p>
                  <p className="text-[10px] text-slate-500">v1.24.1 - Online</p>
                </div>
              </div>
              <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/10 rounded-lg">
                  <Zap className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">OpenAI Neural Link</p>
                  <p className="text-[10px] text-slate-500">Latency: 1.2s</p>
                </div>
              </div>
              <div className="text-[10px] font-bold text-emerald-400">Optimal</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/10 rounded-lg">
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">DB Storage</p>
                  <p className="text-[10px] text-slate-500">82.1 GB / 500 GB</p>
                </div>
              </div>
              <div className="w-12 h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="w-[16%] h-full bg-amber-500" />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5">
            <button className="w-full py-3 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-xl border border-white/10 transition-all">
              인프라 수동 재시작
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
