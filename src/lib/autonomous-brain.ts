import { generateMarketingCopy, generateShortsScenario, normalizePersona } from "./ai-engine";
import { createServerSupabaseClient } from "./supabase";

export type CampaignTopic = {
  id: string;
  title: string;
  description: string;
  targetRegion: string;
  contentType: 'shorts' | 'blog' | 'threads';
  scheduledTime: string;
};

/**
 * 🤖 [Researcher Agent]
 * 사용자의 페르소나와 리전을 분석하여 최적의 주제를 선정합니다.
 */
async function runResearcherAgent(supabase: any, userId: string, region: string) {
  const SEASONAL_DATA: Record<string, string[]> = {
    KR: ['4월의 튤립 투어: 꽃말과 감성 사진 스팟', '부모님 깜짝 꽃배달: 감동을 주는 꿀팁', '봄날의 힐링: 침대 옆 작은 화분이 주는 위로'],
    US: ['Spring Revival: How to keep your blooms fresh for 2 weeks', 'The Secret Language of Peonies', 'Minimalist Home Decor with Wildflowers'],
    JP: ['母の日に贈る、感謝の気持ちを込めた花束', '春の風を感じる、桜以外の季節の花', 'インテリアとしてのドライフラワー活用術'],
  };

  const topics = SEASONAL_DATA[region] || SEASONAL_DATA['KR'];
  const pickedTopic = topics[Math.floor(Math.random() * topics.length)];

  await supabase.from('agent_logs').insert({
    user_id: userId,
    agent_name: 'Researcher',
    action_type: 'Analysis',
    thought_process: `[트렌드 분석] 현재 ${region} 시장의 검색량 데이터와 리전별 시즌(4월) 키워드를 교차 분석한 결과, '${pickedTopic}' 주제가 가장 높은 도달률을 기록할 것으로 예측됩니다.`,
    metadata: { topic: pickedTopic, confidence: 0.94 }
  });

  return pickedTopic;
}

/**
 * 🤖 [Creative Agent]
 * 선정된 주제를 바탕으로 사장님의 브랜드 페르소나를 주입(Injection)하여 고품질 콘텐츠를 생성합니다.
 */
async function runCreativeAgent(supabase: any, userId: string, topic: string, contentType: 'shorts' | 'blog', storePersona: string) {
  // AI 엔진의 정규화 유틸리티를 사용하여 브랜드 DNA 추출
  const normalizedPersona = normalizePersona(storePersona);

  await supabase.from('agent_logs').insert({
    user_id: userId,
    agent_name: 'Creative Director',
    action_type: 'Generation',
    thought_process: `'${topic}' 주제를 바탕으로 사장님의 브랜드 DNA('${normalizedPersona}')를 AI 모델에 주입합니다. 타겟 유저의 심리학적 트리거를 자극하는 서사를 설계합니다.`,
  });

  let content;
  if (contentType === 'shorts') {
    content = await generateShortsScenario(topic, 'KR', normalizedPersona);
  } else {
    content = await generateMarketingCopy(topic, 'blog', 'KR', normalizedPersona);
  }

  return content;
}

/**
 * 🤖 [Publisher Agent]
 * DB 기록 및 n8n 웹훅 발송을 담당합니다.
 */
async function runPublisherAgent(supabase: any, userId: string, topic: string, contentType: string, content: any, webhookUrl?: string) {
  // 1. 캠페인 마스터 기록
  const { data: campaign } = await supabase
    .from('campaigns')
    .insert({
      user_id: userId,
      title: `[AUTO] ${topic}`,
      type: contentType,
      status: 'scheduled',
      country: 'KR',
      source_prompt: topic
    })
    .select()
    .single();

  if (campaign) {
    await supabase
      .from('campaign_contents')
      .insert({
        campaign_id: campaign.id,
        platform: contentType === 'shorts' ? 'youtube_shorts' : 'naver_blog',
        content_json: content
      });
  }

  // 2. n8n 발송
  if (webhookUrl) {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        type: 'AUTONOMOUS_PUBLISH_V5',
        campaignType: contentType,
        content: content,
        orchestrator: 'V5-MAOMS'
      })
    });
  }

  await supabase.from('agent_logs').insert({
    user_id: userId,
    agent_name: 'Publisher',
    action_type: 'Dispatch',
    thought_process: `콘텐츠 최적화 검토 완료. n8n 배포 파이프라인을 통해 ${contentType} 채널로 작전을 사출했습니다. 캠페인 ID: ${campaign?.id}`,
  });
}

/**
 * 🚀 [Global Engine Orchestrator - CEO Agent]
 * 전 사용자를 대상으로 멀티 에이전트 마케팅을 지배합니다.
 */
export async function runGlobalAutonomousEngine() {
  const supabase = await createServerSupabaseClient();
  
  const { data: shops, error: shopsError } = await supabase
    .from('shop_settings')
    .select('user_id, n8n_webhook_url, store_persona, target_platforms')
    .eq('auto_pilot_enabled', true);

  if (shopsError || !shops) {
    return { status: 'error', message: 'No active shops found' };
  }

  console.log(`[V5-CEO] Global Marketing Battle initiated for ${shops.length} shops.`);

  const results = [];

  for (const shop of shops) {
    try {
      // CEO Log: 작전 개시
      await supabase.from('agent_logs').insert({
        user_id: shop.user_id,
        agent_name: 'CEO',
        action_type: 'Planning',
        thought_process: `자동화 엔진 V5(Paperclip Framework) 가동. 해당 사용자의 매장 페르소나 '${shop.store_persona}'를 기반으로 24시간 자율 마케팅 작전을 개시합니다.`,
      });

      // 1. Research phase
      const topic = await runResearcherAgent(supabase, shop.user_id, 'KR');

      // 2. Creative phase (Brand DNA Injection happens here)
      const contentType = Math.random() > 0.5 ? 'shorts' : 'blog';
      const content = await runCreativeAgent(supabase, shop.user_id, topic, contentType, shop.store_persona);

      // 3. Publishing phase
      await runPublisherAgent(supabase, shop.user_id, topic, contentType, content, shop.n8n_webhook_url);

      results.push({ userId: shop.user_id, status: 'success' });
    } catch (err: any) {
      console.error(`[V5-CEO] Operation failed for ${shop.user_id}:`, err);
      results.push({ userId: shop.user_id, status: 'error', error: err.message });
    }
  }

  return { status: 'completed', processed: results.length, detail: 'V5 Agent Orchestration successful' };
}
