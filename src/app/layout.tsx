import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LilyMag | World Class Marketing Automation ERP",
  description: "Beyond limits. High-performance, AI-driven marketing engine for premium retail.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        inter.variable,
        outfit.variable,
        "h-full antialiased selection:bg-rose-500/30 selection:text-rose-900"
      )}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans bg-[#fafafa] dark:bg-[#050505] text-zinc-900 dark:text-zinc-100 selection:bg-rose-500/20">
        {children}
      </body>
    </html>
  );
}
