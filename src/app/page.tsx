import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BarChart3, Rocket, Sparkles, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1A1A1A] font-sans selection:bg-rose-100 dark:bg-[#0A0A0A] dark:text-zinc-50">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-rose-50/50 bg-white/70 backdrop-blur-md dark:border-zinc-800 dark:bg-black/70">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500 text-white shadow-lg shadow-rose-200 dark:shadow-none">
              <Sparkles className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-rose-600 dark:text-rose-400">
              lilymagerp-v4
            </span>
          </div>
          <div className="hidden items-center gap-8 text-sm font-medium sm:flex">
            <a href="#vision" className="transition-colors hover:text-rose-500">Vision</a>
            <a href="#features" className="transition-colors hover:text-rose-500">System</a>
            <a href="#global" className="transition-colors hover:text-rose-500">Global</a>
            <Link href="/login">
              <button className="rounded-full bg-rose-500 px-5 py-2.5 text-white shadow-md transition-all hover:bg-rose-600 active:scale-95">
                Launch Engine
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-44 pb-32">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-[10%] left-[5%] h-64 w-64 rounded-full bg-rose-100/40 blur-3xl dark:bg-rose-900/10"></div>
          <div className="absolute bottom-[20%] right-[10%] h-96 w-96 rounded-full bg-emerald-50/30 blur-3xl dark:bg-emerald-900/5"></div>
        </div>

        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 flex items-center gap-2 rounded-full border border-rose-100 bg-rose-50/50 px-4 py-1.5 text-sm font-semibold text-rose-600 dark:border-rose-900/50 dark:bg-rose-900/10 dark:text-rose-400">
              <Zap className="h-4 w-4" />
              <span>Next-Gen Flower Shop Automation</span>
            </div>
            <h1 className="mb-8 max-w-4xl text-5xl font-extrabold tracking-tight lg:text-7xl leading-[1.1]">
              사장님이 잠든 사이에도 <br />
              <span className="bg-gradient-to-r from-rose-600 to-amber-500 bg-clip-text text-transparent italic">
                마케팅은 24시간 실행됩니다.
              </span>
            </h1>
            <p className="mb-12 max-w-2xl text-lg leading-relaxed text-zinc-500 dark:text-zinc-400 sm:text-xl">
              전 세계 수백만 꽃집 사장님을 위한 완전 무인 마케팅 시스템. 
              AI가 영상을 만들고, 수치가 증명하며, 결제가 자동으로 이어지는 '더 시스템'의 시작.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/login">
                <button className="group flex items-center justify-center gap-2 rounded-full bg-[#1A1A1A] px-8 py-4 text-lg font-bold text-white transition-all hover:bg-black hover:shadow-xl dark:bg-white dark:text-black w-full sm:w-auto">
                  엔진 가동하기
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </button>
              </Link>
              <Link href="/dashboard/shop">
                <button className="flex items-center justify-center gap-2 rounded-full border border-zinc-200 bg-white px-8 py-4 text-lg font-bold transition-all hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800 w-full sm:w-auto">
                  기능 살펴보기
                </button>
              </Link>
            </div>
          </div>

          {/* Stats/Features Grid */}
          <div className="mt-32 grid gap-8 md:grid-cols-3">
            {[
              { 
                icon: <Rocket className="h-6 w-6 text-rose-500" />, 
                title: "AI 무인 콘텐츠", 
                desc: "사진 한 장으로 0.5초 만에 제작되는 프리미엄 쇼츠/릴스 영상." 
              },
              { 
                icon: <BarChart3 className="h-6 w-6 text-rose-500" />, 
                title: "심리 기반 퍼널", 
                desc: "설득의 6원칙을 녹여낸 이탈 없는 구매 전환 시스템." 
              },
              { 
                icon: <Zap className="h-6 w-6 text-rose-500" />, 
                title: "글로벌 상륙", 
                desc: "수백만 매장이 동시에 사용해도 안정적인 무중단 아키텍처." 
              }
            ].map((feature, i) => (
              <div key={i} className="group relative rounded-3xl border border-rose-50 bg-white/50 p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/50">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 group-hover:bg-rose-100 dark:bg-rose-950/30 dark:group-hover:bg-rose-900/30">
                  {feature.icon}
                </div>
                <h3 className="mb-3 text-xl font-bold">{feature.title}</h3>
                <p className="text-zinc-500 dark:text-zinc-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer / CTA */}
      <footer className="border-t border-zinc-100 py-12 dark:border-zinc-900">
        <div className="mx-auto max-w-7xl px-6 text-center text-sm text-zinc-400">
          <p>© 2026 lilymagerp-v4. Engineered for excellence, built for owners.</p>
        </div>
      </footer>
    </div>
  );
}
