"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CountryCode } from "@/lib/ai-engine";

interface Country {
  code: CountryCode;
  flag: string;
  label: string;
}

const COUNTRIES: Country[] = [
  { code: 'KR', flag: "🇰🇷", label: "Korea" },
  { code: 'US', flag: "🇺🇸", label: "USA" },
  { code: 'VN', flag: "🇻🇳", label: "Vietnam" },
  { code: 'JP', flag: "🇯🇵", label: "Japan" },
  { code: 'CN', flag: "🇨🇳", label: "China" },
];

interface CountrySelectorProps {
  selected: CountryCode;
  onSelect: (code: CountryCode) => void;
}

export function CountrySelector({ selected, onSelect }: CountrySelectorProps) {
  return (
    <div className="flex items-center gap-2 p-1.5 bg-zinc-100 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 w-fit">
      {COUNTRIES.map((country) => (
        <motion.button
          key={country.code}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(country.code)}
          className={cn(
            "relative px-4 py-2 rounded-xl text-sm font-black transition-all flex items-center gap-2",
            selected === country.code
              ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xl ring-1 ring-zinc-200 dark:ring-zinc-700"
              : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          )}
        >
          <span className="text-lg leading-none">{country.flag}</span>
          <span className="uppercase tracking-widest text-[10px]">{country.code}</span>
          {selected === country.code && (
            <motion.div
              layoutId="country-active"
              className="absolute inset-0 bg-white/10 dark:bg-zinc-700/50 rounded-xl -z-10"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
        </motion.button>
      ))}
    </div>
  );
}
