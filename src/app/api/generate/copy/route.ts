import { NextRequest, NextResponse } from "next/server";
import { generateMarketingCopy, normalizePersona } from "@/lib/ai-engine";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  let requestType = "copy";
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { prompt, type, country } = await req.json();
    requestType = type || "copy";

    if (!prompt) {
      return NextResponse.json(
        { error: "Description is required for neural alchemy." },
        { status: 400 }
      );
    }

    // Fetch user persona for Brand DNA Injection
    const { data: shopSettings } = await supabase
      .from('shop_settings')
      .select('store_persona')
      .eq('user_id', user?.id)
      .single();

    const storePersona = normalizePersona(shopSettings?.store_persona);

    // AI Generation
    const result = await generateMarketingCopy(prompt, requestType as any, country || 'KR', storePersona);

    // If user is logged in, save to campaigns table automatically
    if (user) {
      const { data: campaign, error: campaignError } = await supabase
        .from('campaigns')
        .insert({
          user_id: user.id,
          title: prompt.substring(0, 50),
          type: requestType,
          status: 'draft',
          country: country || 'KR',
          source_prompt: prompt
        })
        .select()
        .single();

      if (!campaignError && campaign) {
        // Map requestType to platform names
        let platform = 'generic';
        if (requestType === 'blog') platform = country === 'KR' ? 'naver_blog' : 'generic_blog';
        else if (requestType === 'threads') platform = 'threads';
        else if (requestType === 'sns') platform = 'instagram';

        await supabase
          .from('campaign_contents')
          .insert({
            campaign_id: campaign.id,
            platform: platform,
            content_json: result
          });
      }
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error(`AI ${requestType} Route Error:`, error);
    return NextResponse.json(
      { error: `Neural link failed: ${error.message}` },
      { status: 500 }
    );
  }
}
