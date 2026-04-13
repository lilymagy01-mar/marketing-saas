import { NextRequest, NextResponse } from "next/server";
import { generateShortsScenario, normalizePersona } from "@/lib/ai-engine";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { prompt, country } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Description is required for neural synthesis." },
        { status: 400 }
      );
    }

    // Fetch contextual metadata
    const { data: profile } = await supabase
      .from('profiles')
      .select('target_audience, is_admin')
      .eq('id', user?.id)
      .single();

    const { data: shopSettings } = await supabase
      .from('shop_settings')
      .select('store_persona, industry_id, marketing_theme')
      .eq('user_id', user?.id)
      .single();

    const storePersona = normalizePersona(shopSettings?.store_persona);

    // AI Generation
    const scenario = await generateShortsScenario(
      prompt, 
      country || 'KR', 
      storePersona,
      shopSettings?.industry_id || 'flower',
      profile?.target_audience || 'general customers',
      profile?.is_admin || false,
      shopSettings?.marketing_theme
    );

    // If user is logged in, save to campaigns table automatically
    if (user) {
      const { data: campaign, error: campaignError } = await supabase
        .from('campaigns')
        .insert({
          user_id: user.id,
          title: prompt.substring(0, 50),
          type: 'shorts',
          status: 'draft',
          country: country || 'KR',
          source_prompt: prompt
        })
        .select()
        .single();

      if (!campaignError && campaign) {
        await supabase
          .from('campaign_contents')
          .insert({
            campaign_id: campaign.id,
            platform: country === 'CN' ? 'douyin' : 'youtube_shorts',
            content_json: scenario
          });
      }
    }

    return NextResponse.json(scenario);
  } catch (error: any) {
    console.error("AI Route Error:", error);
    return NextResponse.json(
      { error: `Neural link failed: ${error.message}` },
      { status: 500 }
    );
  }
}
