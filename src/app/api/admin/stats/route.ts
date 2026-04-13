import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();

    // 1. Total User Count
    const { count: userCount, error: userError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    if (userError) throw userError;

    // 2. Total active revenue (Pro/Premium plans)
    const { data: subData, error: subError } = await supabase
      .from('subscriptions')
      .select('amount, plan')
      .eq('status', 'active');

    // Default price mapping if amount is not set in DB
    const planPrices: Record<string, number> = {
      'Free': 0,
      'Pro': 49000,
      'Premium': 99000,
      'Enterprise': 299000
    };

    const totalRevenue = subData?.reduce((acc, curr) => {
      const price = curr.amount || planPrices[curr.plan] || 0;
      return acc + price;
    }, 0) || 0;

    // 3. Status checks (Simple availability check)
    // In a real app, you'd ping n8n or OpenAI here, 
    // but for now we'll just return 'Healthy' if the DB is reachable.
    const status = {
      n8n: 'Online',
      ai: 'Active',
      db: 'Healthy'
    };

    return NextResponse.json({
      totalUsers: userCount || 0,
      totalRevenue,
      status
    });
  } catch (error: any) {
    console.error('[Admin/stats] error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
