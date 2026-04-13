'use client';

import React, { useEffect, useState } from 'react';
import {
  CreditCard,
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  RefreshCw,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface SubRow {
  id: string;
  userId: string;
  email: string;
  name: string;
  plan: string;
  status: string;
  expiresAt: string;
  createdAt: string;
}

export default function SubscriptionsPage() {
  const [subs, setSubs] = useState<SubRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [extending, setExtending] = useState<string | null>(null);

  useEffect(() => {
    fetchSubs();
  }, []);

  async function fetchSubs() {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/subscriptions');
      const { subscriptions, error: apiError } = await res.json();
      if (apiError) throw new Error(apiError);

      setSubs(
        (subscriptions || []).map((s: any) => ({
          id: s.id,
          userId: s.user_id,
          email: s.profiles?.email || '(이메일 없음)',
          name: s.profiles?.display_name || '(이름 미설정)',
          plan: s.plan || 'Free',
          status: s.status || 'unknown',
          expiresAt: s.expires_at
            ? new Date(s.expires_at).toLocaleDateString('ko-KR')
            : '없음',
          createdAt: s.created_at
            ? new Date(s.created_at).toLocaleDateString('ko-KR')
            : '-',
        }))
      );
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleExtend(userId: string, email: string) {
    const days = window.prompt(`[${email}] 연장할 일수를 입력하세요 (예: 30)`);
    if (!days || isNaN(Number(days)) || Number(days) <= 0) return;

    setExtending(userId);
    try {
      const res = await fetch('/api/admin/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: userId, daysToExtend: Number(days) }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || '연장 실패');
      alert(`✅ ${days}일 연장!\n새 만료일: ${new Date(json.newEndDate).toLocaleDateString('ko-KR')}`);
      fetchSubs();
    } catch (e: any) {
      alert(`❌ 오류: ${e.message}`);
    } finally {
      setExtending(null);
    }
  }

  const activeCnt = subs.filter((s) => s.status === 'active').length;
  const expiredCnt = subs.filter((s) => s.status !== 'active').length;

  return (
    <div className="space-y-6 pb-10">
      {/* Stats - real counts only */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: '전체 구독', value: subs.length, icon: CreditCard, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
          { label: '활성', value: activeCnt, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: '만료/미구독', value: expiredCnt, icon: XCircle, color: 'text-rose-400', bg: 'bg-rose-500/10' },
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

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            구독 현황
          </h2>
          <p className="text-xs text-slate-500 mt-1">모든 회원의 구독 상태 및 만료일을 관리합니다.</p>
        </div>
        <button
          onClick={fetchSubs}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-slate-300 hover:bg-white/10 transition-all"
        >
          <RefreshCw className="w-4 h-4" /> 새로고침
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#0f0f12] rounded-[28px] border border-white/5 overflow-hidden shadow-2xl">
        {subs.length === 0 && !isLoading && !error ? (
          <div className="py-20 text-center space-y-3">
            <CreditCard className="w-10 h-10 text-slate-700 mx-auto" />
            <p className="text-slate-500 text-sm font-medium">구독 데이터가 없습니다.</p>
            <p className="text-slate-600 text-xs">
              Supabase SQL Editor에서 <code className="bg-white/5 px-1 py-0.5 rounded">0005_subscriptions.sql</code>을 실행해 주세요.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">회원</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">플랜</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">상태</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">만료일</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">구독 시작</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center text-slate-500 text-sm">불러오는 중...</td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center text-rose-400 text-sm">❌ {error}</td>
                  </tr>
                ) : (
                  subs.map((sub, i) => (
                    <motion.tr
                      key={sub.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className="group hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center font-bold text-white text-sm">
                            {sub.email[0]?.toUpperCase() || '?'}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">{sub.name}</p>
                            <p className="text-xs text-slate-500">{sub.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider ${
                          sub.plan === 'Pro' || sub.plan === 'Premium'
                            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/20'
                            : 'bg-slate-700/40 text-slate-400 border border-white/5'
                        }`}>
                          {sub.plan}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          {sub.status === 'active'
                            ? <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            : <Clock className="w-4 h-4 text-rose-400" />}
                          <span className={`text-xs font-bold uppercase ${
                            sub.status === 'active' ? 'text-emerald-400' : 'text-rose-400'
                          }`}>
                            {sub.status === 'active' ? '활성' : '만료'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          {sub.expiresAt}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-xs text-slate-500">{sub.createdAt}</td>
                      <td className="px-6 py-5 text-right">
                        <button
                          onClick={() => handleExtend(sub.userId, sub.email)}
                          disabled={extending === sub.userId}
                          className="px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/25 border border-indigo-500/20 rounded-lg text-indigo-400 font-bold text-xs transition-all disabled:opacity-40"
                        >
                          {extending === sub.userId ? '처리중...' : '기간 연장'}
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
