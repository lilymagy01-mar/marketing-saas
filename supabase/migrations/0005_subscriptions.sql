-- [lilymagerp-v4] Phase 5: Subscriptions Table (corrected column names)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan TEXT NOT NULL DEFAULT 'Free',
    status TEXT NOT NULL DEFAULT 'active',
    amount INTEGER DEFAULT 0,
    expires_at TIMESTAMPTZ DEFAULT now() + interval '14 days',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id)
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions"
ON public.subscriptions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage subscriptions"
ON public.subscriptions FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Auto-create free trial subscription for new users
CREATE OR REPLACE FUNCTION public.handle_new_user_subscription()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.subscriptions (user_id, plan, status, expires_at)
    VALUES (NEW.id, 'Free', 'active', now() + interval '14 days')
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created_for_subscription ON auth.users;
CREATE TRIGGER on_auth_user_created_for_subscription
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_subscription();

-- Populate existing users with a 14-day free trial
INSERT INTO public.subscriptions (user_id, plan, status, expires_at)
SELECT id, 'Free', 'active', now() + interval '14 days'
FROM auth.users
ON CONFLICT (user_id) DO NOTHING;
