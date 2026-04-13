import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

// GET: Admin - fetch all subscriptions (service role bypasses RLS)
export async function GET() {
  try {
    const supabase = createServerSupabaseClient();

    const { data: subs, error } = await supabase
      .from('subscriptions')
      .select(`
        id,
        user_id,
        amount,
        plan,
        status,
        expires_at,
        created_at,
        profiles (
          display_name,
          email
        )
      `)
      .order('created_at', { ascending: false });

    // If subscriptions table doesn't exist yet, return empty array
    if (error) {
      if (error.code === 'PGRST205' || error.message?.includes('does not exist')) {
        return NextResponse.json({ subscriptions: [] });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ subscriptions: subs || [] });
  } catch (error: any) {
    console.error('[Admin/subscriptions GET]', error);
    return NextResponse.json({ subscriptions: [] });
  }
}

// PATCH: Admin - cancel a user's subscription
export async function PATCH(req: Request) {
  try {
    const supabase = createServerSupabaseClient();
    const { targetUserId } = await req.json();

    if (!targetUserId) {
      return NextResponse.json({ error: '유저 ID가 필요합니다.' }, { status: 400 });
    }

    const { error } = await supabase
      .from('subscriptions')
      .update({
        status: 'canceled',
        expires_at: new Date().toISOString(), // expire immediately
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', targetUserId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[Admin/subscriptions PATCH]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}



// POST: Admin - extend a user's subscription period
export async function POST(req: Request) {
  try {
    const supabase = createServerSupabaseClient();
    const { targetUserId, daysToExtend } = await req.json();

    if (!targetUserId || !daysToExtend || isNaN(Number(daysToExtend))) {
      return NextResponse.json({ error: '유저 ID와 연장 일수가 필요합니다.' }, { status: 400 });
    }

    const days = parseInt(daysToExtend, 10);

    // Step 1: Get ONLY this user's current subscription
    const { data: currentSub } = await supabase
      .from('subscriptions')
      .select('expires_at, plan, status')
      .eq('user_id', targetUserId)   // ← 반드시 특정 유저만
      .maybeSingle();

    // Step 2: Calculate new expiry from today or current expiry (whichever is later)
    let baseDate = new Date();
    if (currentSub?.expires_at) {
      const currentExpiry = new Date(currentSub.expires_at);
      if (currentExpiry > baseDate) baseDate = currentExpiry;
    }
    baseDate.setDate(baseDate.getDate() + days);

    const newExpiry = baseDate.toISOString();
    const plan = currentSub?.plan || 'Free';

    if (currentSub) {
      // Step 3a: UPDATE existing row for this user ONLY
      const { error } = await supabase
        .from('subscriptions')
        .update({
          expires_at: newExpiry,
          status: 'active',
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', targetUserId);  // ← 핵심: 이 유저만 업데이트

      if (error) {
        console.error('[Subscription extend UPDATE error]', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    } else {
      // Step 3b: INSERT new subscription for this user
      const { error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: targetUserId,
          plan,
          status: 'active',
          expires_at: newExpiry,
        });

      if (error) {
        console.error('[Subscription extend INSERT error]', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, newEndDate: newExpiry });
  } catch (error: any) {
    console.error('[Admin/subscriptions POST]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
