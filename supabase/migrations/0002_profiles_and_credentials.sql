-- [lilymagerp-v4] Phase 2: 프로필 및 SNS 자격 증명 테이블
-- 로그인/온보딩에서 사용하는 profiles & OAuth 토큰 저장소

-- 1. Profiles (사용자 프로필 - 온보딩 시 생성)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'owner', -- 'owner', 'staff', 'admin'
    language TEXT DEFAULT 'ko',
    onboarding_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. User Credentials (SNS OAuth 토큰 금고 - n8n에서 조회)
CREATE TABLE IF NOT EXISTS public.user_credentials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    shop_id UUID REFERENCES public.shops(id) ON DELETE CASCADE,
    provider TEXT NOT NULL, -- 'instagram', 'youtube', 'naver', 'threads', 'wechat'
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    token_expires_at TIMESTAMPTZ,
    scopes TEXT[], -- 부여된 권한 목록
    account_name TEXT, -- 연결된 SNS 계정 이름 (표시용)
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    -- 한 유저가 같은 provider에 중복 연결 방지
    UNIQUE(user_id, provider)
);

-- 3. Shop Settings (매장별 마케팅 설정 - localStorage 대체)
CREATE TABLE IF NOT EXISTS public.shop_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    shop_id UUID REFERENCES public.shops(id) ON DELETE CASCADE,
    n8n_webhook_url TEXT,
    auto_pilot_enabled BOOLEAN DEFAULT false,
    auto_pilot_frequency INTEGER DEFAULT 1, -- 일 N회
    store_persona TEXT DEFAULT 'Elegant & Premium',
    target_platforms TEXT[] DEFAULT ARRAY['instagram', 'youtube', 'naver'],
    settings_json JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id)
);

-- 4. RLS 활성화
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_settings ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies - profiles
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- 6. RLS Policies - user_credentials
CREATE POLICY "Users can view own credentials"
ON public.user_credentials FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own credentials"
ON public.user_credentials FOR ALL
USING (auth.uid() = user_id);

-- 7. RLS Policies - shop_settings
CREATE POLICY "Users can view own settings"
ON public.shop_settings FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own settings"
ON public.shop_settings FOR ALL
USING (auth.uid() = user_id);

-- 8. Indexes
CREATE INDEX IF NOT EXISTS idx_user_credentials_user_id ON public.user_credentials(user_id);
CREATE INDEX IF NOT EXISTS idx_user_credentials_provider ON public.user_credentials(user_id, provider);
CREATE INDEX IF NOT EXISTS idx_shop_settings_user_id ON public.shop_settings(user_id);

-- 9. 신규 유저 가입 시 자동 profile & shop_settings 생성 트리거
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- 1. 프로필 생성
    INSERT INTO public.profiles (id, display_name)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
    
    -- 2. 기본 매장 설정 생성 (신규 유저 필수 - 대시보드 충돌 방지)
    INSERT INTO public.shop_settings (user_id, industry_id, marketing_theme)
    VALUES (NEW.id, 'SAAS', 'Modern & Professional');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 기존 트리거가 있으면 교체
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
