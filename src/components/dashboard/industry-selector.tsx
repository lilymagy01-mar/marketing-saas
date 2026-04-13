"use client";

import { 
  Flower2, 
  Shirt, 
  Utensils, 
  Home, 
  Search,
  Check,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type IndustryType = 'SAAS' | 'FLOWER' | 'FASHION' | 'RESTAURANT' | 'REAL_ESTATE' | 'OTHER';

interface Industry {
  id: IndustryType;
  label: string;
  icon: any;
  color: string;
}

const industries: Industry[] = [
  { id: 'SAAS', label: 'IT / SaaS / 소프트웨어', icon: Zap, color: 'text-indigo-600 bg-indigo-600/10' },
  { id: 'FLOWER', label: '꽃집 / 원예', icon: Flower2, color: 'text-rose-500 bg-rose-500/10' },
  { id: 'FASHION', label: '의류 / 패션', icon: Shirt, color: 'text-indigo-500 bg-indigo-500/10' },
  { id: 'RESTAURANT', label: '카페 / 음식점', icon: Utensils, color: 'text-amber-500 bg-amber-500/10' },
  { id: 'REAL_ESTATE', label: '부동산 / 인테리어', icon: Home, color: 'text-emerald-500 bg-emerald-500/10' },
  { id: 'OTHER', label: '기타 비즈니스', icon: Search, color: 'text-slate-500 bg-slate-500/10' },
];

interface IndustrySelectorProps {
  selected?: IndustryType;
  onSelect: (id: IndustryType) => void;
}

export function IndustrySelector({ selected = 'FLOWER', onSelect }: IndustrySelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {industries.map((item) => {
        const isActive = selected === item.id;
        return (
          <motion.div
            key={item.id}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(item.id)}
            className={cn(
              "cursor-pointer p-6 rounded-[32px] border-2 transition-all relative overflow-hidden group",
              isActive 
                ? "bg-white dark:bg-zinc-900 border-rose-500 shadow-xl shadow-rose-500/10" 
                : "bg-zinc-50 dark:bg-zinc-950 border-transparent hover:border-zinc-200 dark:hover:border-zinc-800"
            )}
          >
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:rotate-12",
              item.color
            )}>
              <item.icon className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <p className={cn(
                "text-xs font-black uppercase tracking-widest",
                isActive ? "text-rose-500" : "text-zinc-500"
              )}>
                {item.id}
              </p>
              <h4 className="font-bold text-sm tracking-tight">{item.label}</h4>
            </div>

            {isActive && (
              <div className="absolute top-4 right-4 text-rose-500">
                <Check className="w-5 h-5" />
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
