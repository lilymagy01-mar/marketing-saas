'use client';

import React, { useEffect, useState } from 'react';
import {
  Search,
  Filter,
  Users,
  Calendar,
  ShieldCheck,
  User,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Ban,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  plan: string;
  status: string;
  expiryDate: string;
  joinDate: string;
}

const EXTEND_PRESETS = [
  { label: '7일', days: 7 },
  { label: '30일', days: 30 },
  { label: '90일', days: 90 },
  { label: '180일', days: 180 },
  { label: '1년', days: 365 },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionUserId, setActionUserId] = useState<string | null>(null); // expanded row
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => { fetchUsers(); }, []);

  async function fetchUsers() {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/users');
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const { users: data, error: apiError } = await res.json();
      if (apiError) throw new Error(apiError);

      setUsers((data || []).map((u: any) => {
        const sub = u.subscriptions?.[0];
        return {
          id: u.id,
          name: u.display_name || '(이름 미설정)',
          email: u.email || '(이메일 없음)',
          role: u.role || 'user',
          plan: sub?.plan || 'Free',
          status: sub?.status === 'active' ? 'active' : (sub?.status === 'canceled' ? 'canceled' : (sub ? 'expired' : 'none')),
          expiryDate: sub?.expires_at
            ? new Date(sub.expires_at).toLocaleDateString('ko-KR')
            : '구독 없음',
          joinDate: u.created_at
            ? new Date(u.created_at).toLocaleDateString('ko-KR')
            : '-',
        };
      }));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleExtend(userId: string, days: number) {
    setProcessing(`extend-${userId}-${days}`);
    try {
      const res = await fetch('/api/admin/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: userId, daysToExtend: days }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || '연장 실패');
      await fetchUsers();
      setActionUserId(null);
    } catch (e: any) {
      alert(`❌ 오류: ${e.message}`);
    } finally {
      setProcessing(null);
    }
  }

  async function handleCancel(userId: string, email: string) {
    if (!confirm(`[${email}]\n구독을 즉시 취소(만료)하시겠습니까?\n취소 후에도 기간 연장으로 재활성화 가능합니다.`)) return;
    setProcessing(`cancel-${userId}`);
    try {
      const res = await fetch('/api/admin/subscriptions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: userId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || '취소 실패');
      await fetchUsers();
      setActionUserId(null);
    } catch (e: any) {
      alert(`❌ 오류: ${e.message}`);
    } finally {
      setProcessing(null);
    }
  }

  const filtered = users.filter(u =>
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const adminUsers = users.filter(u => u.role === 'admin').length;

  return (
    <div className="space-y-6 pb-10">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: '전체 회원', value: totalUsers, icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
          { label: '활성 구독자', value: activeUsers, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: '관리자', value: adminUsers, icon: ShieldCheck, color: 'text-amber-400', bg: 'bg-amber-500/10' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="p-5 rounded-2xl bg-[#0f0f12] border border-white/5 flex items-center gap-4"
          >
            <div className={`p-3 rounded-xl ${stat.bg}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black text-white">{isLoading ? '…' : stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search */}
      <div className="flex gap-3 items-center bg-[#0f0f12] p-4 rounded-2xl border border-white/5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="이메일 또는 이름 검색..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:border-indigo-500/50 outline-none transition-all"
          />
        </div>
        <button
          onClick={fetchUsers}
          className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-slate-300 hover:bg-white/10 transition-all flex items-center gap-2"
        >
          <Filter className="w-4 h-4" /> 새로고침
        </button>
      </div>

      {/* User Table */}
      <div className="bg-[#0f0f12] rounded-[28px] border border-white/5 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">회원</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">역할</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">플랜 / 상태</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">만료일</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">가입일</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">관리</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-slate-500 text-sm">불러오는 중...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-rose-400 text-sm">❌ {error}</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-slate-500 text-sm">검색 결과가 없습니다.</td>
                </tr>
              ) : (
                filtered.map((user, i) => (
                  <React.Fragment key={user.id}>
                    {/* Main Row */}
                    <motion.tr
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`group transition-colors border-b border-white/5 ${actionUserId === user.id ? 'bg-indigo-500/5' : 'hover:bg-white/[0.02]'}`}
                    >
                      {/* 회원 */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center font-bold text-white text-sm">
                            {user.email[0]?.toUpperCase() || '?'}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">{user.name}</p>
                            <p className="text-xs text-slate-500">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* 역할 */}
                      <td className="px-6 py-5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider ${
                          user.role === 'admin'
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                            : 'bg-slate-700/30 text-slate-400 border border-white/5'
                        }`}>
                          {user.role === 'admin' ? <ShieldCheck className="w-3 h-3" /> : <User className="w-3 h-3" />}
                          {user.role === 'admin' ? '관리자' : '일반회원'}
                        </span>
                      </td>

                      {/* 플랜 / 상태 */}
                      <td className="px-6 py-5">
                        <div className="space-y-1.5">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                            user.plan !== 'Free'
                              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/20'
                              : 'bg-slate-700/40 text-slate-400 border border-white/5'
                          }`}>
                            {user.plan}
                          </span>
                          <div className="flex items-center gap-1.5">
                            {user.status === 'active'
                              ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              : user.status === 'canceled'
                              ? <Ban className="w-3.5 h-3.5 text-rose-400" />
                              : user.status === 'none'
                              ? <Clock className="w-3.5 h-3.5 text-slate-500" />
                              : <XCircle className="w-3.5 h-3.5 text-orange-400" />}
                            <span className={`text-[10px] font-bold uppercase ${
                              user.status === 'active' ? 'text-emerald-400' :
                              user.status === 'canceled' ? 'text-rose-400' :
                              user.status === 'none' ? 'text-slate-500' : 'text-orange-400'
                            }`}>
                              {user.status === 'active' ? '활성' :
                               user.status === 'canceled' ? '취소됨' :
                               user.status === 'none' ? '미구독' : '만료'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* 만료일 */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          {user.expiryDate}
                        </div>
                      </td>

                      {/* 가입일 */}
                      <td className="px-6 py-5 text-xs text-slate-500">{user.joinDate}</td>

                      {/* 관리 토글 버튼 */}
                      <td className="px-6 py-5 text-right">
                        <button
                          onClick={() => setActionUserId(actionUserId === user.id ? null : user.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                            actionUserId === user.id
                              ? 'bg-indigo-500/30 border-indigo-500/40 text-indigo-300'
                              : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20'
                          }`}
                        >
                          관리
                          {actionUserId === user.id
                            ? <ChevronUp className="w-3.5 h-3.5" />
                            : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </td>
                    </motion.tr>

                    {/* Expanded Action Row */}
                    <AnimatePresence>
                      {actionUserId === user.id && (
                        <motion.tr
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <td colSpan={6} className="px-6 pb-5 border-b border-white/5 bg-indigo-500/[0.03]">
                            <div className="pt-1 space-y-3">
                              {/* 기간 연장 */}
                              <div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                                  기간 연장
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {EXTEND_PRESETS.map(preset => {
                                    const key = `extend-${user.id}-${preset.days}`;
                                    const isLoading = processing === key;
                                    return (
                                      <button
                                        key={preset.days}
                                        onClick={() => handleExtend(user.id, preset.days)}
                                        disabled={!!processing}
                                        className="px-4 py-2 bg-indigo-500/15 hover:bg-indigo-500/30 border border-indigo-500/25 rounded-xl text-indigo-400 font-bold text-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                                      >
                                        {isLoading ? (
                                          <span className="animate-pulse">처리중...</span>
                                        ) : (
                                          <>+{preset.label}</>
                                        )}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* 구분선 */}
                              <div className="h-px bg-white/5" />

                              {/* 구독 취소 */}
                              <div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                                  위험 구역
                                </p>
                                <button
                                  onClick={() => handleCancel(user.id, user.email)}
                                  disabled={!!processing || user.status === 'canceled'}
                                  className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/20 rounded-xl text-rose-400 font-bold text-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                  <Ban className="w-3.5 h-3.5" />
                                  {processing === `cancel-${user.id}`
                                    ? '처리중...'
                                    : user.status === 'canceled'
                                    ? '이미 취소됨'
                                    : '구독 즉시 취소'}
                                </button>
                              </div>
                            </div>
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
