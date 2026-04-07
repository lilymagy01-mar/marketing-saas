"use client";

import { 
  Store, 
  MapPin, 
  Phone, 
  Globe, 
  MessageSquare,
  Sparkles,
  Zap,
  ShieldCheck,
  Link2,
  Instagram,
  Camera,
  Map,
  Clock,
  LayoutDashboard,
  Aperture
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function ShopPage() {
  return (
    <div className="space-y-12 pt-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 w-fit">
            <Store className="w-4 h-4 text-indigo-500" />
            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest leading-none">Authority Profile v4.0</span>
          </div>
          <h1 className="text-6xl font-black tracking-tighter uppercase italic italic tracking-tighter leading-[0.9]">
             Shop Authority
          </h1>
          <p className="text-zinc-500 font-medium max-w-xl text-lg leading-relaxed">
             "사장님의 매장이 지역에서 독보적인 '권위'를 가질 수 있도록 브랜딩의 모든 요소를 시스템화합니다."
          </p>
        </div>
        <Button variant="outline" size="lg">Edit Brand Assets</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left: Shop Overview */}
        <div className="lg:col-span-2 space-y-10">
          <Card className="relative overflow-hidden p-0 border-none shadow-2xl rounded-[48px]">
             <div className="h-48 bg-gradient-to-tr from-rose-500/20 to-amber-500/20 relative">
               <div className="absolute inset-0 bg-white/10 backdrop-blur-3xl" />
             </div>
             <div className="p-12 -mt-24 relative z-10 space-y-10">
                <div className="flex flex-col md:flex-row items-end gap-8">
                  <div className="w-40 h-40 rounded-[48px] bg-white dark:bg-zinc-900 shadow-2xl p-2 ring-1 ring-zinc-100 dark:ring-zinc-800">
                    <div className="w-full h-full rounded-[40px] bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white text-5xl font-black italic shadow-inner">
                       LF
                    </div>
                  </div>
                  <div className="flex-1 space-y-3">
                    <h2 className="text-5xl font-black tracking-tighter uppercase italic">Lily Flower Lab</h2>
                    <div className="flex flex-wrap gap-4">
                       <div className="flex items-center gap-2 text-sm font-bold text-zinc-500">
                         <MapPin className="w-4 h-4" /> Seoul, South Korea
                       </div>
                       <div className="flex items-center gap-2 text-sm font-bold text-zinc-500">
                         <Clock className="w-4 h-4" /> Open 10:00 - 20:00
                       </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Global Reach</p>
                    <div className="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-[32px] border border-zinc-100 dark:border-zinc-800 flex items-center justify-between shadow-inner">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl shadow-lg">
                          <Globe className="w-5 h-5" />
                        </div>
                        <span className="font-bold">lilyflower.com</span>
                      </div>
                      <Link2 className="text-zinc-300 w-5 h-5" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Store Hotline</p>
                    <div className="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-[32px] border border-zinc-100 dark:border-zinc-800 flex items-center justify-between shadow-inner">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl shadow-lg">
                          <Phone className="w-5 h-5" />
                        </div>
                        <span className="font-bold">+82 10-1234-5678</span>
                      </div>
                      <Button variant="ghost" size="sm">Call Agent</Button>
                    </div>
                  </div>
                </div>
             </div>
          </Card>

          <div className="space-y-6">
            <h3 className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-4">
               <Aperture className="w-8 h-8 text-indigo-500 animate-spin-slow" /> Neural Connections
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <Card className="hover:border-rose-500/20 transition-all duration-500 p-8">
                  <div className="flex items-center justify-between mb-6">
                     <div className="p-4 bg-gradient-to-tr from-rose-500 to-rose-600 text-white rounded-2xl shadow-xl shadow-rose-500/20">
                        <Camera className="w-6 h-6" />
                     </div>
                     <div className="px-3 py-1 bg-green-50 dark:bg-green-950/20 rounded-full text-green-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <ShieldCheck className="w-3 h-3" /> Live Sync
                     </div>
                  </div>
                  <h4 className="text-xl font-bold italic uppercase tracking-tighter">Instagram Business</h4>
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-6">Master Channel Active</p>
                  <Button variant="outline" className="w-full">Configuration</Button>
               </Card>
               <Card className="border-dashed flex flex-col items-center justify-center p-8 opacity-60 hover:opacity-100 transition-all">
                  <MessageSquare className="w-12 h-12 text-zinc-200 mb-6" />
                  <p className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-6">NAVER BLOG ENGINE</p>
                  <Button variant="secondary" className="w-full">Connect Channel</Button>
               </Card>
            </div>
          </div>
        </div>

        {/* Right: ERP Strategy */}
        <div className="space-y-8">
          <Card className="bg-gradient-to-br from-indigo-900 to-indigo-950 border-none shadow-2xl text-white p-10 rounded-[48px] relative overflow-hidden group">
            <div className="relative z-10 space-y-10">
               <div className="p-4 bg-white/10 rounded-[28px] w-fit shadow-2xl backdrop-blur-xl border border-white/20">
                 <Zap className="w-10 h-10 text-amber-400 fill-amber-400" />
               </div>
               <div className="space-y-4">
                  <h3 className="text-4xl font-black italic uppercase italic tracking-tighter leading-none">Authority<br />Engine</h3>
                  <p className="text-indigo-200 text-sm font-medium leading-relaxed">
                    "물리적 한계를 거부하세요. 매장 사장님의 뇌를 딥러닝하여 AI가 대신 홍보하는 프리미엄 자동화 모드를 활성화했습니다."
                  </p>
               </div>
               <div className="space-y-4">
                 <div className="flex justify-between items-end border-b border-white/10 pb-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-indigo-300">System Efficiency</span>
                    <span className="text-2xl font-black italic italic tracking-tighter text-white">98.4%</span>
                 </div>
                 <div className="flex justify-between items-end border-b border-white/10 pb-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-indigo-300">Authority Score</span>
                    <span className="text-2xl font-black italic italic tracking-tighter text-amber-400">Elite</span>
                 </div>
               </div>
               <Button variant="glass" size="xl" className="w-full mt-4">Upgrade Strategy</Button>
            </div>
            <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-1000" />
            <Sparkles className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5 group-hover:rotate-45 transition-transform duration-[4000ms]" />
          </Card>

          <Card className="p-8 border-none bg-zinc-50 dark:bg-zinc-900 rounded-[40px] shadow-inner">
             <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-6 flex items-center gap-2">
               <Map className="w-4 h-4" /> Global Footprint
             </h4>
             <div className="aspect-square bg-zinc-200 dark:bg-black rounded-[32px] overflow-hidden relative shadow-inner">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.1)_0,transparent_100%)] animate-pulse" />
                <div className="flex h-full items-center justify-center">
                   <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-tighter text-zinc-500">
                     Visualizing reach map...
                   </div>
                </div>
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
