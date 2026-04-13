import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dmkbtlgkqwdykkllcsoj.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRta2J0bGdrcXdkeWtrbGxjc29qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0OTcxNDQsImV4cCI6MjA5MTA3MzE0NH0.FjWdCLc0GszDQrYK4eJkVUAJrx7QPTXel9yASK1Vj3g'

// ============================================================
// Browser Client (클라이언트 컴포넌트 전용)
// "use client" 컴포넌트에서 import 하여 사용
// ============================================================
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ============================================================
// Server Client (서버 컴포넌트 / API Route 전용)
// Service Role Key를 사용하여 RLS를 우회할 수 있음
// ⚠️ 절대 클라이언트 번들에 포함시키지 말 것!
// ============================================================
export function createServerSupabaseClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRta2J0bGdrcXdkeWtrbGxjc29qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTQ5NzE0NCwiZXhwIjoyMDkxMDczMTQ0fQ.jjSIRDY9u3cnD71FPCdwNU-czB7_XTbTsFCTKvf7Ydo'
  
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// ============================================================
// 타입 정의 (AI 엔진 응답 / 캠페인 / 설정 등)
// ============================================================

/** AI 쇼츠 시나리오 생성 결과 */
export interface ShortsScenario {
  hook: string
  scenes: Array<{
    time: string
    visual: string
    narration: string
    text_overlay: string
  }>
  cta: string
  hashtags: string[]
  music_suggestion: string
}

/** AI 마케팅 카피 생성 결과 */
export interface MarketingCopy {
  title: string
  hook: string
  value: string
  cta: string
  hashtags?: string[]
}

/** 캠페인 레코드 */
export interface Campaign {
  id: string
  shop_id: string
  type: 'shorts' | 'blog' | 'threads'
  platform: string
  content: ShortsScenario | MarketingCopy
  status: 'draft' | 'pending' | 'published' | 'failed'
  published_at?: string
  error_log?: string
  created_at: string
}

/** 매장 설정 */
export interface ShopSettings {
  id: string
  user_id: string
  shop_id?: string
  n8n_webhook_url?: string
  auto_pilot_enabled: boolean
  auto_pilot_frequency: number
  store_persona: string
  target_platforms: string[]
  settings_json: Record<string, any>
}

/** SNS 자격 증명 */
export interface UserCredential {
  id: string
  user_id: string
  provider: string
  access_token: string
  refresh_token?: string
  token_expires_at?: string
  account_name?: string
  is_active: boolean
}
