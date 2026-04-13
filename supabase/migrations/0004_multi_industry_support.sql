-- [lilymagerp-v4] Phase 3: 다중 업종 및 B2B 플랫폼 설정 지원
-- LilyMag을 꽃집뿐만 아니라 다양한 업종으로 확장하기 위한 스키마 확장

-- 1. 업종(Industry) 마스터 테이블
CREATE TABLE IF NOT EXISTS public.industries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL, -- 'FLOWER', 'FASHION', 'ESTATE', 'REST'
    name_ko TEXT NOT NULL,
    default_persona TEXT,
    marketing_triggers JSONB DEFAULT '[]'::JSONB, -- 업종별 주요 마케팅 시점 (ex: 졸업용, 가을세일)
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 초기 기초 데이터 삽입
INSERT INTO public.industries (code, name_ko, default_persona)
VALUES 
('FLOWER', '꽃집/원예', 'Elegant & Premium'),
('FASHION', '의류/패션', 'Trendy & Bold'),
('RESTAURANT', '음식점/카페', 'Cozy & Welcoming'),
('REAL_ESTATE', '부동산', 'Professional & Trustworthy')
ON CONFLICT (code) DO NOTHING;

-- 2. 상점 설정(shop_settings)에 업종 ID 추가
ALTER TABLE public.shop_settings 
ADD COLUMN IF NOT EXISTS industry_id UUID REFERENCES public.industries(id),
ADD COLUMN IF NOT EXISTS target_audience TEXT,
ADD COLUMN IF NOT EXISTS business_scale TEXT DEFAULT 'SMALL'; -- 'SMALL', 'MEDIUM', 'LARGE'

-- 3. 플랫폼 마케팅(B2B)을 위한 글로벌 설정 테이블
-- (관리자가 플랫폼 사용자들에게 보낼 마케팅이나 시스템 메시지 관리)
CREATE TABLE IF NOT EXISTS public.platform_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. RLS 정책 추가
ALTER TABLE public.industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view industries"
ON public.industries FOR SELECT
USING (true);

CREATE POLICY "Admins can manage industries"
ON public.industries FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
);

CREATE POLICY "Admins can manage platform_config"
ON public.platform_config FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
);

CREATE POLICY "Users can view platform_config"
ON public.platform_config FOR SELECT
USING (true);
