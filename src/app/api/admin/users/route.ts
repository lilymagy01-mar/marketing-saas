import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();

    // Step 1: Fetch profiles (core - must exist)
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, display_name, email, role, created_at')
      .order('created_at', { ascending: false });

    if (profilesError) {
      console.error('[Admin/users] profiles error:', profilesError.message);
      return NextResponse.json({ error: profilesError.message }, { status: 500 });
    }

    // Step 2: Try to fetch subscriptions (optional - may not exist yet)
    const { data: subscriptions } = await supabase
      .from('subscriptions')
      .select('user_id, plan, status, expires_at');

    // Step 3: Try to fetch shop_settings (optional)
    const { data: shopSettings } = await supabase
      .from('shop_settings')
      .select('user_id, industry_id');

    // Step 4: Merge data
    const subMap = new Map((subscriptions || []).map((s: any) => [s.user_id, s]));
    const shopMap = new Map((shopSettings || []).map((s: any) => [s.user_id, s]));

    const users = (profiles || []).map((p: any) => {
      const sub = subMap.get(p.id);
      const shop = shopMap.get(p.id);
      return {
        ...p,
        subscriptions: sub ? [sub] : [],
        shop_settings: shop ? [shop] : [],
      };
    });

    return NextResponse.json({ users });
  } catch (error: any) {
    console.error('[Admin/users] unexpected error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
