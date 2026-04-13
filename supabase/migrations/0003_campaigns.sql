-- [lilymagerp-v4] Phase 3: 캠페인 및 콘텐츠 관리 테이블
-- AI가 생성한 시나리오, 블로그 포스트, 트레드 등을 저장하는 공간

-- 1. Campaigns (마케팅 캠페인 마스터 테이블)
CREATE TABLE IF NOT EXISTS public.campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type TEXT NOT NULL, -- 'shorts', 'blog', 'threads', 'combined'
    status TEXT DEFAULT 'draft', -- 'draft', 'scheduled', 'published', 'failed'
    country TEXT DEFAULT 'KR',
    source_prompt TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Campaign Contents (각 플랫폼별 생성된 실제 내용)
CREATE TABLE IF NOT EXISTS public.campaign_contents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
    platform TEXT NOT NULL, -- 'instagram', 'youtube', 'naver', 'tiktok', 'threads'
    content_json JSONB NOT NULL, -- 시나리오 JSON, 블로그 HTML 등
    media_urls TEXT[], -- 업로드된 이미지/영상 경로
    post_id TEXT, -- 실제 플랫폼 게시물 ID (배포 후)
    post_url TEXT, -- 실제 게시물 링크
    published_at TIMESTAMPTZ,
    error_log TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. RLS 활성화
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_contents ENABLE ROW LEVEL SECURITY;

-- 4. RLS 정책
CREATE POLICY "Users can manage own campaigns"
ON public.campaigns FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own campaign contents"
ON public.campaign_contents FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.campaigns
        WHERE public.campaigns.id = public.campaign_contents.campaign_id
        AND public.campaigns.user_id = auth.uid()
    )
);

-- 5. 인덱스
CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON public.campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_campaign_contents_campaign_id ON public.campaign_contents(campaign_id);

-- 6. Profiles 테이블 보강 (필수 컬럼 추가)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='onboarding_completed') THEN
        ALTER TABLE public.profiles ADD COLUMN onboarding_completed BOOLEAN DEFAULT false;
    END IF;
END $$;
