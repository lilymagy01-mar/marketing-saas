-- [lilymagerp-v4] Initial Multi-tenant Schema

-- 1. Shops (매장 정보 및 마케팅 설정)
CREATE TABLE IF NOT EXISTS public.shops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL, -- Supabase Auth User ID
    name TEXT NOT NULL,
    shop_code TEXT UNIQUE, -- ERP 연동용 코드
    language TEXT DEFAULT 'ko', -- 서비스 언어
    marketing_settings JSONB DEFAULT '{
        "auto_shorts": true,
        "auto_blog": true,
        "auto_threads": true,
        "130_percent_rule": true
    }'::JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Campaigns (자동화 콘텐츠 마케팅 이력)
CREATE TABLE IF NOT EXISTS public.campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shop_id UUID REFERENCES public.shops(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'shorts', 'blog', 'threads'
    platform TEXT NOT NULL, -- 'instagram', 'youtube', 'naver', 'threads'
    content JSONB NOT NULL, -- 생성된 텍스트, 영상 URL, 메타데이터 등
    status TEXT DEFAULT 'draft', -- 'draft', 'pending', 'published', 'failed'
    published_at TIMESTAMPTZ,
    error_log TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Enabling RLS (보안 강화: 자기 매장 데이터만 접근 가능하도록 설정)
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
-- Owners can only see and manage their own shop
CREATE POLICY "Owners can view their own shops" 
ON public.shops FOR SELECT 
USING (auth.uid() = owner_id);

CREATE POLICY "Owners can manage their own shops" 
ON public.shops FOR ALL 
USING (auth.uid() = owner_id);

-- Owners can only manage campaigns related to their shops
CREATE POLICY "Owners can manage their own campaigns" 
ON public.campaigns FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.shops 
        WHERE shops.id = campaigns.shop_id 
        AND shops.owner_id = auth.uid()
    )
);

-- Indexing for performance
CREATE INDEX IF NOT EXISTS idx_shops_owner_id ON public.shops(owner_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_shop_id ON public.campaigns(shop_id);
