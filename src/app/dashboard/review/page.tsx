"use client";

import { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  Send, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Image as ImageIcon,
  Loader2,
  X,
  AlertCircle,
  Smartphone,
  Globe,
  Monitor
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ContentDraft {
  id: string;
  title: string;
  content: string;
  image_url: string;
  platforms: string[];
  status: string;
  created_at: string;
}

export default function ReviewPage() {
  const [drafts, setDrafts] = useState<ContentDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingDraft, setEditingDraft] = useState<ContentDraft | null>(null);
  const [isPosting, setIsPosting] = useState<string | null>(null);

  useEffect(() => {
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("content_drafts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (data) setDrafts(data);
    setLoading(false);
  };

  const handleApproveAndPost = async (draft: ContentDraft) => {
    setIsPosting(draft.id);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("로그인이 필요합니다.");

      // 1. Update status in Supabase
      const { error: updateError } = await supabase
        .from("content_drafts")
        .update({ status: 'approved' })
        .eq("id", draft.id);

      if (updateError) throw updateError;

      // 2. Trigger secure proxy API (Forwarding .env keys to n8n)
      const response = await fetch('/api/marketing/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          draftId: draft.id,
          userId: user.id,
          platforms: draft.platforms
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "배포 서버 응답 실패");
      }

      // 3. Final success update
      const { error: postError } = await supabase
        .from("content_drafts")
        .update({ status: 'posted' })
        .eq("id", draft.id);

      setDrafts(prev => prev.map(d => d.id === draft.id ? { ...d, status: 'posted' } : d));
      alert("사령부 명령 하달 완료! 전 채널에 성공적으로 배포 중입니다.");
    } catch (err: any) {
      alert(`배포 작전 중단: ${err.message}`);
    } finally {
      setIsPosting(null);
    }
  };

  const deleteDraft = async (id: string) => {
    if (!confirm("이 초안을 삭제하시겠습니까?")) return;
    const { error } = await supabase.from("content_drafts").delete().eq("id", id);
    if (!error) setDrafts(prev => prev.filter(d => d.id !== id));
  };

  return (
    <div className="space-y-10 pt-8 pb-20 max-w-[1400px] mx-auto px-4">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 w-fit">
            <ShieldCheck className="w-4 h-4 text-rose-500" />
            <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest leading-none">AI 작전 배포 대기실</span>
          </div>
          <h1 className="text-6xl font-black tracking-tighter uppercase italic leading-[0.9] text-zinc-900 dark:text-white">
             콘텐츠 검토실
          </h1>
          <p className="text-zinc-500 text-lg font-medium max-w-xl">
             AI 비서가 준비한 초안을 검사하고 최종 발사 명령을 내리세요. 수정이 필요하면 언제든 편집 가능합니다.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full h-[400px] flex flex-col items-center justify-center gap-4 border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-[40px]">
            <Loader2 className="w-10 h-10 text-rose-500 animate-spin" />
            <p className="text-xs font-black uppercase tracking-widest text-zinc-400">Loading AI Drafts...</p>
          </div>
        ) : drafts.length === 0 ? (
          <div className="col-span-full h-[400px] flex flex-col items-center justify-center gap-6 border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-[40px] bg-zinc-50/50 dark:bg-zinc-900/50">
             <AlertCircle className="w-16 h-16 text-zinc-300" />
             <div className="text-center">
                <h3 className="text-xl font-bold text-zinc-600 dark:text-zinc-300">대기 중인 초안이 없습니다.</h3>
                <p className="text-sm text-zinc-500">AI가 매장 정보를 분석하여 곧 새로운 작전을 입안할 것입니다.</p>
             </div>
          </div>
        ) : (
          drafts.map((draft) => (
            <motion.div
              key={draft.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="group relative overflow-hidden bg-white dark:bg-zinc-950 border-none shadow-xl rounded-[32px] hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
                {/* Status Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <div className={cn(
                    "px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 backdrop-blur-md",
                    draft.status === 'pending' ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" : 
                    draft.status === 'posted' ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" :
                    "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                  )}>
                    {draft.status === 'pending' ? <Clock className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                    {draft.status === 'pending' ? '승인 대기중' : '배포 완료'}
                  </div>
                </div>

                {/* Preview Image */}
                <div className="relative aspect-[4/5] overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                  {draft.image_url ? (
                    <img src={draft.image_url} alt={draft.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-300">
                      <ImageIcon className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <div className="flex gap-2 w-full">
                       <Button 
                         variant="secondary" 
                         className="flex-1 bg-white/20 hover:bg-white/40 backdrop-blur-md border-none text-white font-black uppercase text-[10px]"
                         onClick={() => setEditingDraft(draft)}
                       >
                         <Edit3 className="w-3 h-3 mr-2" /> 수정
                       </Button>
                       <Button 
                         variant="destructive" 
                         className="flex-1 bg-rose-500/20 hover:bg-rose-500/40 backdrop-blur-md border-none text-rose-200 font-black uppercase text-[10px]"
                         onClick={() => deleteDraft(draft.id)}
                       >
                         <Trash2 className="w-3 h-3 mr-2" /> 삭제
                       </Button>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col">
                  <div className="flex gap-1 flex-wrap">
                    {draft.platforms.map(p => (
                      <span key={p} className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-[8px] font-black uppercase rounded border border-zinc-200 dark:border-zinc-700">
                        {p}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-lg font-black text-zinc-800 dark:text-zinc-100 leading-tight italic uppercase tracking-tighter">
                    {draft.title || "제목 없는 작전"}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-3 leading-relaxed flex-1">
                    {draft.content}
                  </p>

                  <Button
                    disabled={draft.status === 'posted' || isPosting === draft.id}
                    onClick={() => handleApproveAndPost(draft)}
                    className={cn(
                      "w-full py-6 rounded-2xl font-black uppercase tracking-widest text-[10px] mt-4 transition-all shadow-lg",
                      draft.status === 'posted' ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-400" : "bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20"
                    )}
                  >
                    {isPosting === draft.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : draft.status === 'posted' ? (
                      "배포 완료됨"
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" /> 승인 및 전 채널 배포
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Editor Modal */}
      <AnimatePresence>
        {editingDraft && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
            onClick={() => setEditingDraft(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-5xl bg-white dark:bg-zinc-950 rounded-[40px] overflow-hidden flex flex-col md:flex-row shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
               {/* Left: Preview */}
               <div className="w-full md:w-1/2 bg-zinc-100 dark:bg-zinc-900/50 p-8 flex flex-col items-center justify-center border-r border-zinc-100 dark:border-zinc-900">
                  <div className="relative w-full aspect-[4/5] max-w-sm rounded-[32px] overflow-hidden shadow-2xl">
                     <img src={editingDraft.image_url} className="w-full h-full object-cover" />
                     <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent p-6">
                        <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-widest w-fit">AI Generated Capture</div>
                     </div>
                  </div>
                  <div className="flex gap-4 mt-8">
                     <div className="text-center">
                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-900 flex items-center justify-center mb-2 shadow-lg">
                           <Smartphone className="w-5 h-5 text-zinc-400" />
                        </div>
                        <span className="text-[8px] font-black text-zinc-400 uppercase">Mobile</span>
                     </div>
                     <div className="text-center">
                        <div className="w-10 h-10 rounded-xl bg-rose-500 flex items-center justify-center mb-2 shadow-lg">
                           <Globe className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-[8px] font-black text-zinc-400 uppercase">Web</span>
                     </div>
                  </div>
               </div>

               {/* Right: Editor */}
               <div className="w-full md:w-1/2 p-10 space-y-6 overflow-y-auto">
                  <div className="flex justify-between items-start">
                     <div>
                        <h2 className="text-3xl font-black italic uppercase tracking-tighter text-rose-500">배포 작전 수정</h2>
                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">Final Tactical Adjustment</p>
                     </div>
                     <button onClick={() => setEditingDraft(null)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-all">
                        <X className="w-6 h-6 text-zinc-400" />
                     </button>
                  </div>

                  <div className="space-y-4 pt-4">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">작전명</label>
                        <input 
                           type="text" 
                           value={editingDraft.title}
                           onChange={e => setEditingDraft({...editingDraft, title: e.target.value})}
                           className="w-full p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-zinc-900 dark:text-white font-bold outline-none ring-rose-500/20 focus:ring-4 transition-all"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">마케팅 본문 (블로그/SNS 캡션)</label>
                        <textarea 
                           rows={8}
                           value={editingDraft.content}
                           onChange={e => setEditingDraft({...editingDraft, content: e.target.value})}
                           className="w-full p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-zinc-900 dark:text-white font-bold outline-none ring-rose-500/20 focus:ring-4 transition-all resize-none"
                        />
                     </div>
                  </div>

                  <div className="pt-4 flex gap-3">
                     <Button 
                        variant="secondary" 
                        onClick={() => setEditingDraft(null)}
                        className="flex-1 py-7 rounded-2xl font-black uppercase text-xs tracking-widest"
                     >
                        취소
                     </Button>
                     <Button 
                        onClick={async () => {
                           const { error } = await supabase.from("content_drafts").update({
                              title: editingDraft.title,
                              content: editingDraft.content
                           }).eq("id", editingDraft.id);
                           if (!error) {
                              setDrafts(prev => prev.map(d => d.id === editingDraft.id ? editingDraft : d));
                              setEditingDraft(null);
                           }
                        }}
                        className="flex-[2] py-7 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl"
                     >
                        변경사항 저장
                     </Button>
                  </div>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
