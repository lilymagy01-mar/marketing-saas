import React from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  ExternalLink,
  TrendingUp,
  AlertTriangle,
  UserCheck
} from 'lucide-react';

export default function AdminUsersPage() {
  // Mock data of users with SaaS metrics
  const users = [
    { 
      id: '1', name: '릴리맥 강남점', email: 'owner@lilymag.kr', plan: 'Premium', 
      status: 'Active', usage: 84, successRate: 98, lastActive: '10분 전',
      joinDate: '2024.01.15'
    },
    { 
      id: '2', name: '로즈가든 부산', email: 'rose@busan.com', plan: 'Premium', 
      status: 'Active', usage: 42, successRate: 92, lastActive: '2시간 전',
      joinDate: '2024.02.01'
    },
    { 
      id: '3', name: '플라워박스 제주', email: 'jeju@flower.cc', plan: 'Free', 
      status: 'Warning', usage: 95, successRate: 74, lastActive: '3일 전',
      joinDate: '2024.03.10'
    },
    { 
      id: '4', name: '봄날의 꽃 일산', email: 'spring@naver.com', plan: 'Free', 
      status: 'Inactive', usage: 12, successRate: 0, lastActive: '15일 전',
      joinDate: '2024.03.20'
    }
  ];

  return (
    <div className="space-y-6">
      {/* 🔍 Filter & Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#0f0f12] p-4 rounded-2xl border border-white/5">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="매장명 또는 이메일 검색..." 
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white focus:border-indigo-500/50 outline-none transition-all"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-slate-300 hover:bg-white/10 transition-all">
            <Filter className="w-4 h-4" /> 필터
          </button>
          <button className="flex-1 md:flex-none px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/20 transition-all">
            신규 매장 초대
          </button>
        </div>
      </div>

      {/* 👥 User Table */}
      <div className="bg-[#0f0f12] rounded-[32px] border border-white/5 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">매장 브랜딩</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">플랜 / 상태</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">AI 사용량</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">마케팅 성공률</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">최근 활동</th>
                <th className="px-8 py-5 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((user) => (
                <tr key={user.id} className="group hover:bg-indigo-500/[0.02] transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center font-bold text-indigo-400 group-hover:scale-110 transition-transform">
                        {user.name[0]}
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm tracking-tight">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col gap-2">
                      <span className={`w-fit px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                        user.plan === 'Premium' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-slate-700/30 text-slate-500 border border-white/5'
                      }`}>
                        {user.plan}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          user.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 
                          user.status === 'Warning' ? 'bg-amber-500' : 'bg-rose-500'
                        }`} />
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{user.status}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 font-mono">
                    <div className="space-y-1.5 w-32">
                      <div className="flex justify-between text-[10px] font-bold text-slate-500">
                        <span>Usage</span>
                        <span className={user.usage > 90 ? 'text-rose-400' : ''}>{user.usage}%</span>
                      </div>
                      <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ${user.usage > 90 ? 'bg-rose-500' : 'bg-indigo-500'}`}
                          style={{ width: `${user.usage}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-2">
                       <TrendingUp className={`w-4 h-4 ${user.successRate > 90 ? 'text-emerald-400' : 'text-slate-500'}`} />
                       <span className="text-sm font-bold text-white">{user.successRate}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <p className="text-xs font-medium text-slate-400">{user.lastActive}</p>
                    <p className="text-[10px] text-slate-600 mt-0.5">Joined: {user.joinDate}</p>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2 hover:bg-white/5 rounded-lg transition-all text-slate-500 hover:text-white">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ⚠️ Management Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="p-6 rounded-3xl bg-amber-500/5 border border-amber-500/10 flex items-start gap-4">
          <div className="p-3 bg-amber-500/20 rounded-2xl">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-amber-400 mb-1 tracking-tight">구독 만료 예정 (3건)</h4>
            <p className="text-xs text-amber-500/70 leading-relaxed font-medium">'플라워박스 제주' 외 2곳의 매장이 7일 이내에 구독이 만료됩니다. 연장 안내 메시지를 발송할 준비를 하세요.</p>
          </div>
        </div>
        <div className="p-6 rounded-3xl bg-indigo-500/5 border border-indigo-500/10 flex items-start gap-4">
          <div className="p-3 bg-indigo-500/20 rounded-2xl">
            <UserCheck className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-indigo-400 mb-1 tracking-tight">신규 프리미엄 전환 추천</h4>
            <p className="text-xs text-indigo-500/70 leading-relaxed font-medium">'라라 플라워'의 AI 사용량이 무료 한도(90%)에 근접했습니다. 자동화 전환 프로모션을 제안하기에 최적의 타이밍입니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
