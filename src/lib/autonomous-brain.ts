import { generateMarketingCopy } from "./ai-engine";

export type CampaignTopic = {
  id: string;
  title: string;
  description: string;
  targetRegion: string;
  contentType: 'Shorts' | 'Blog' | 'Social';
  scheduledTime: string;
};

// 4월 봄 시즌에 특화된 고품격 꽃말 및 스토리텔링 전략
const SEASONAL_STRATEGY = [
  { region: 'KR', topics: ['벚꽃의 끝자락, 이제는 튤립의 시간', '부모님께 드리는 향기로운 감사', '봄의 정원을 내 방으로'] },
  { region: 'US', topics: ['Spring Revival: Fresh Blooms for your Desk', 'The Language of Lilies', 'Sustainable Florists: Why Local is Better'] },
  { region: 'JP', topics: ['春の香りを届ける', '桜の季節が終わっても、花は咲き続ける', 'お祝いの席に添える彩り'] },
  { region: 'VN', topics: ['Hoa xinh cho ngày mới rực rỡ', 'Phong cách Hàn Quốc tại Việt Nam', 'Gửi trọn tình cảm qua cánh hoa'] },
  { region: 'CN', topics: ['春暖花开, 遇见最美的自己', '给生活加一点仪式感', '中式美学与鲜花的邂逅'] },
];

/**
 * 전 세계 트렌드를 분석하여 '오늘의 자율 주행 포스팅'을 생성합니다.
 */
export async function getDailyAutonomousStrategy(region: string): Promise<CampaignTopic[]> {
  const strategy = SEASONAL_STRATEGY.find(s => s.region === region) || SEASONAL_STRATEGY[0];
  
  // 매일 1~2개의 고품격 주제 무작위 선정
  const selectedTopics = strategy.topics.sort(() => 0.5 - Math.random()).slice(0, 2);
  
  return selectedTopics.map((topic, i) => ({
    id: `auto-${Date.now()}-${i}`,
    title: topic,
    description: `${topic}를 주제로 한 프리미엄 자동 생성 콘텐츠입니다.`,
    targetRegion: region,
    contentType: i === 0 ? 'Shorts' : 'Blog', // 하나는 쇼츠, 하나는 블로그로 믹스
    scheduledTime: i === 0 ? 'AM 10:00' : 'PM 03:00', // 최적의 노출 시간 대기
  }));
}

/**
 * 실제 자율 주행 엔진 가동 (n8n으로 사출하기 전 로직)
 */
export async function igniteAutonomousPosting(region: string) {
  const campaigns = await getDailyAutonomousStrategy(region);
  
  console.log(`[AUTONOMOUS BRAIN] Igniting ${campaigns.length} campaigns for ${region}`);
  
  // 여기서 각 캠페인에 대해 ai-engine의 generateMarketingContent를 호출하여 
  // 실제 콘텐츠를 만들고 n8n 웹훅으로 전송하는 로직이 향후 추가됩니다.
  
  return campaigns;
}
