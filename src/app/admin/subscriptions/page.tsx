'use client';

import React from 'react';
import { 
  CreditCard, 
  TrendingUp, 
  Users, 
  ArrowUpRight, 
  DollarSign,
  PieChart,
  Calendar,
  Download,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function SubscriptionsPage() {
  const stats = [
    { name: '월간 반복 매출 (MRR)', value: '₩12,840,000', change: '+14.2%', icon: DollarSign, color: 'text-emerald-400' },
    { name: '활성 구독 테넌트', value: '158', change: '+12', icon: Users, color: 'text-indigo-400' },
    { name: '평균 객단가 (ARPU)', value: '₩81,265', change: '+2.4%', icon: TrendingUp, color: 'text-amber-400' },
    { name: '이탈률 (Churn Rate)', value: '1.2%', change: '-0.3%', icon: Clock, color: 'text-rose-400' },
  ];

  const plans = [
    { name: 'Free', users: 112, revenue: '₩0', color: 'bg-slate-500' },
    { name: 'Standard', users: 34, revenue: '₩1,666,000', color: 'bg-indigo-400' },
    { name: 'Premium', users: 12, revenue: '₩11,174,000', color: 'bg-rose-500' },
  ];

  const recentTransactions = [
    { id: 'TX-1024', business: '글로벌 테크', plan: 'Premium', amount: '₩890,000', status: 'Completed', date: '5분 전' },
    { id: 'TX-1023', business: '패션허브 서울', plan: 'Premium', amount: '₩890,000', status: 'Completed', date: '2시간 전' },
    { id: 'TX-1022', business: '미식가 가이드', plan: 'Standard', amount: '₩49,000', status: 'Processing', date: '5시간 전' },
    { id: 'TX-1021', business: '어반 커피', plan: 'Standard', amount: '₩49,000', status: 'Completed', date: '어제' },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* 📊 High-Level Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.name} 
            className="group p-6 rounded-[32px] bg-[#0f0f12] border border-white/5 hover:border-indigo-500/20 transition-all shadow-xl"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-indigo-500/10 transition-colors">
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className="text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full flex items-center gap-1">
                {stat.change} <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{stat.name}</p>
            <h3 className="text-2xl font-black text-white tracking-tighter">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 📉 Revenue Breakdown */}
        <div className="lg:col-span-2 p-8 rounded-[40px] bg-[#0f0f12] border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="flex justify-between items-center mb-8 relative z-10">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <PieChart className="w-5 h-5 text-indigo-400" />
                플랜별 매출 분포
              </h2>
              <p className="text-xs text-slate-500 mt-1">현재 활성화된 구독 플랜별 기여도 데이터입니다.</p>
            </div>
            <button className="p-2.5 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all">
              <Download className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          <div className="space-y-6 relative z-10">
            {plans.map((plan) => (
              <div key={plan.name} className="space-y-2">
                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${plan.color}`} />
                    <span className="font-bold text-white tracking-tight">{plan.name} Plan</span>
                    <span className="text-xs text-slate-500">({plan.users} 테넌트)</span>
                  </div>
                  <span className="text-sm font-black text-indigo-400">{plan.revenue}</span>
                </div>
                <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: plan.name === 'Premium' ? '85%' : plan.name === 'Standard' ? '12%' : '3%' }}
                    className={`h-full ${plan.color} shadow-lg shadow-current/20`}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 p-6 rounded-3xl bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-indigo-500/20 rounded-2xl">
                 <CreditCard className="w-5 h-5 text-indigo-400" />
               </div>
               <div>
                 <p className="text-xs font-bold text-indigo-400">결제 성수기 진입</p>
                 <p className="text-[10px] text-slate-500">지난달 대비 프리미엄 전환율이 15% 상승했습니다.</p>
               </div>
            </div>
            <button className="px-4 py-2 bg-indigo-500 text-white text-[10px] font-black rounded-lg uppercase tracking-widest">
              분석 리포트
            </button>
          </div>
          
          <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-indigo-500/5 rounded-full blur-[100px]" />
        </div>

        {/* 🔔 Recent Transactions */}
        <div className="p-8 rounded-[40px] bg-gradient-to-br from-[#121217] to-[#0f0f12] border border-white/5 shadow-2xl">
          <h2 className="text-xl font-bold text-white flex items-center gap-3 mb-8">
            <Calendar className="w-5 h-5 text-rose-400" />
            최근 결제 내역
          </h2>

          <div className="space-y-6">
            {recentTransactions.map((tx, i) => (
              <div key={tx.id} className="relative group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={tx.status === 'Completed' ? "text-emerald-400" : "text-amber-400"}>
                      {tx.status === 'Completed' ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5 animate-pulse" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{tx.business}</p>
                      <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">{tx.plan} · {tx.id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-white">{tx.amount}</p>
                    <p className="text-[10px] text-slate-500 font-medium">{tx.date}</p>
                  </div>
                </div>
                {i !== recentTransactions.length - 1 && <div className="h-px bg-white/5 mt-6" />}
              </div>
            ))}
          </div>

          <button className="w-full mt-8 py-4 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black rounded-2xl border border-white/10 transition-all uppercase tracking-widest flex items-center justify-center gap-2 group">
            전체 내역 확인 <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
