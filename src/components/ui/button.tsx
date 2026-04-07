"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";
import { motion, HTMLMotionProps } from "framer-motion";

export interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: 'bg-rose-500 text-white hover:bg-rose-600 shadow-xl shadow-rose-500/20 active:bg-rose-700',
      secondary: 'bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100',
      outline: 'border-2 border-zinc-200 bg-transparent text-zinc-900 hover:border-zinc-300 dark:border-zinc-800 dark:text-zinc-100 dark:hover:border-zinc-700',
      ghost: 'bg-transparent text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30',
      glass: 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20'
    };

    const sizes = {
      sm: 'px-4 py-2 text-xs font-bold uppercase tracking-wider',
      md: 'px-6 py-3 text-sm font-bold uppercase tracking-widest',
      lg: 'px-8 py-4 text-base font-black uppercase tracking-widest',
      xl: 'px-10 py-5 text-lg font-black uppercase tracking-widest'
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "inline-flex items-center justify-center rounded-2xl transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:grayscale select-none",
          variants[variant],
          sizes[size],
          className
        )}
        {...props as any}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export { Button };
