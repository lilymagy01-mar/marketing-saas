"use client";

import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";
import { HTMLMotionProps, motion } from "framer-motion";

const Card = forwardRef<HTMLDivElement, HTMLMotionProps<"div">>(
  ({ className, ...props }, ref) => (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(
        "rounded-[32px] border border-zinc-100 bg-white/80 p-8 shadow-2xl shadow-zinc-200/20 dark:border-zinc-800 dark:bg-zinc-950/50 backdrop-blur-3xl overflow-hidden",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

const CardHeader = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mb-8 flex flex-col space-y-2", className)} {...props} />
);

const CardTitle = ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={cn("text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 font-display uppercase italic italic tracking-tighter", className)} {...props} />
);

const CardDescription = ({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn("text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest leading-relaxed", className)} {...props} />
);

const CardContent = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("pt-0", className)} {...props} />
);

export { Card, CardHeader, CardTitle, CardDescription, CardContent };
