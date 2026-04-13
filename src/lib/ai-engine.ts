import OpenAI from "openai";

// AI Neural Context for World Class Marketing
export type CountryCode = 'KR' | 'US' | 'VN' | 'JP' | 'CN';

interface Persona {
  name: string;
  tone: string;
  strategy: string;
  platforms: string[];
}

export type StorePersona = 'Elegant & Premium' | 'Warm & Emotional' | 'Trendy & Hip' | 'Expert & Professional';

const STORE_TONE_GUIDE: Record<StorePersona, string> = {
  'Elegant & Premium': "Speak like a luxury concierge. Use sophisticated vocabulary and prioritize aesthetic values. High-class storytelling.",
  'Warm & Emotional': "Speak like a dear friend. Use gentle, poetic language that touches the heart. Focus on the emotional meaning of flowers.",
  'Trendy & Hip': "Speak like a viral influencer. Use energetic, short sentences and trending slang (for the target country). Focus on visual impact and 'cool' factor.",
  'Expert & Professional': "Speak like a master expert with 30 years of experience. Use professional terminology and focus on quality, techniques, and strategic value."
};

export function normalizePersona(persona: string): StorePersona {
  const personaMap: Record<string, StorePersona> = {
    'Elegant': 'Elegant & Premium',
    'Warm': 'Warm & Emotional',
    'Trendy': 'Trendy & Hip',
    'Expert': 'Expert & Professional'
  };
  return personaMap[persona] || (persona as StorePersona) || 'Elegant & Premium';
}

const COUNTRY_PERSONAS: Record<CountryCode, Persona> = {
  KR: {
    name: "Korean Psychology Strategist",
    tone: "Practical, Psychological, High-Energy Hooking",
    strategy: "Focus on efficiency, psychology-based persuasion, and clear benefits (The 130% Rule).",
    platforms: ["YouTube Shorts", "Instagram Reels", "Naver Blog"]
  },
  US: {
    name: "Silicon Valley Minimalist",
    tone: "Impactful, Direct, Confident, Modern",
    strategy: "Focus on bold statements, social proof, and high-impact visual storytelling.",
    platforms: ["YouTube Shorts", "Instagram Reels", "Twitter (X)"]
  },
  VN: {
    name: "Dynamic Southeast Pulse",
    tone: "Vibrant, Trend-focused, Emotional, Fast-paced",
    strategy: "Focus on TikTok aesthetics, trending hashtags, and high-emotional connection.",
    platforms: ["TikTok", "Facebook Reels", "Instagram"]
  },
  JP: {
    name: "Zen Hospitality Artisan",
    tone: "Polite (Omotenashi), Delicate, Trustworthy, Detailed",
    strategy: "Focus on craftsmanship, brand narrative (Monozukuri), and extreme reliability.",
    platforms: ["YouTube", "Instagram", "X (Twitter)"]
  },
  CN: {
    name: "China Market Growth Hacker", // Exclusive China Engine
    tone: "Visual-centric, Trendy, Persuasive (ZhongCao), Viral",
    strategy: "Focus on Douyin (Shorts), XiaoHongShu (Visual Blog/Red), and WeChat Moments (Community). No YouTube/Meta references.",
    platforms: ["Douyin", "XiaoHongShu (Red)", "WeChat"]
  }
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "mock-key",
});

export async function generateShortsScenario(
  prompt: string, 
  country: CountryCode = 'KR', 
  storePersona: StorePersona = 'Elegant & Premium',
  industry: string = 'flower',
  targetAudience: string = 'general customers',
  isAdmin: boolean = false,
  marketingTheme?: string
) {
  const persona = COUNTRY_PERSONAS[country];
  const storeTone = STORE_TONE_GUIDE[storePersona];
  
  if (process.env.OPENAI_API_KEY === undefined || process.env.OPENAI_API_KEY === "mock-key") {
    const platform = country === 'CN' ? "Douyin" : "YouTube Shorts";
    return [
      {
        type: 'Dominance',
        hook: `[${country} - ${platform} - ${storePersona}] 오직 상위 1%를 위한 시선을 훔치는 3초!`,
        value: `${persona.name} 전략과 ${storePersona} 감성이 결합된 프리미엄 정보...`,
        cta: `지금 바로 VIP 혜택을 확인하세요!`,
        script: `[Script] 압도적인 퀄리티, 남들과는 다른 선택...`,
        estimatedReachBoost: "150%+",
        country: country,
        platforms: persona.platforms
      },
      {
        type: 'Stimulus',
        hook: `[${country}] 안 보면 무조건 후회하는 트렌디 끝판왕!`,
        value: `가장 트렌디한 ${storePersona} 스타일의 파격적인 구성...`,
        cta: `품절 전 프로필 링크 클릭!`,
        script: `[Script] 힙한 공간엔 무조건 이거죠!...`,
        estimatedReachBoost: "180%+",
        country: country,
        platforms: persona.platforms
      },
      {
        type: 'Balance',
        hook: `[${country}] 변치 않는 마음을 전하는 가장 진정성 있는 3초`,
        value: `30년 장인의 마음으로 준비한 믿을 수 있는 품질...`,
        cta: `고민 없이 안심하고 예약하세요.`,
        script: `[Script] 언제나 믿고 찾는 ${storePersona}의 감동...`,
        estimatedReachBoost: "120%+",
        country: country,
        platforms: persona.platforms
      }
    ];
  }

  const systemPrompt = isAdmin 
    ? `You are a Tier-1 Growth Hacker and SaaS Marketer. 
       Your goal is to promote the 'LilyMag Marketing ERP & Automation' platform.
       Focus on ROI, saving time, automation, and business growth.
       Current Tone: ${storePersona}. Tone Guide: ${storeTone}.
       Target Market: ${country}. Strategy: ${persona.strategy}.`
    : `You are a World-Class Marketing AI specializing in '${persona.name}' for the ${industry} industry. 
       Current Branch Persona: ${storePersona}. Tone Guide: ${storeTone}.
       ${marketingTheme ? `Marketing Theme/Subject: ${marketingTheme}. Use this context to differentiate the brand.` : ''}
       Target Audience: ${targetAudience}. Industry: ${industry}.
       Target Market: ${country}. Exclusive Platforms: ${persona.platforms.join(", ")}.
       Strategy: ${persona.strategy}.`;

  const finalSystemPrompt = systemPrompt + `
  You must output exactly 3 variations of the scenario based on the 'Limbic Map' psychological triggers to perform A/B/C testing:
  1. 'Dominance' (지배): Focus on status, exclusivity, premium feeling, and being the best (1%).
  2. 'Stimulus' (자극): Focus on novelty, trends, fun, excitement, and breaking the mold.
  3. 'Balance' (균형): Focus on trust, comfort, tradition, reliability, and warm emotions.
  
  Format the output as a JSON object containing a "variants" array:
  {
    "variants": [
      {
        "type": "Dominance",
        "hook": "string",
        "value": "string",
        "cta": "string",
        "script": "string",
        "estimatedReachBoost": "150%+"
      },
      ...
    ]
  }
  Do not include markdown blocks, just raw JSON.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: finalSystemPrompt },
      { role: "user", content: `Create a viral content scenario for: ${prompt}. Language: ${country}. Make sure the output is pure JSON matching the requested structure.` }
    ],
    response_format: { type: "json_object" },
  });

  const parsed = JSON.parse(response.choices[0].message.content || "{}");
  const variants = parsed.variants || [parsed]; // fallback
  return variants.map((v: any) => ({
    ...v,
    country,
    platforms: persona.platforms
  }));
}

export async function generateMarketingCopy(
  prompt: string, 
  type: 'blog' | 'threads', 
  country: CountryCode = 'KR',
  storePersona: StorePersona = 'Elegant & Premium',
  industry: string = 'flower',
  targetAudience: string = 'general customers',
  isAdmin: boolean = false,
  marketingTheme?: string
) {
  const persona = COUNTRY_PERSONAS[country];
  const storeTone = STORE_TONE_GUIDE[storePersona];
  const targetPlatform = country === 'CN' 
    ? (type === 'blog' ? "XiaoHongShu (Red)" : "WeChat Moments") 
    : (type === 'blog' ? "Blog" : "Threads");

  if (process.env.OPENAI_API_KEY === undefined || process.env.OPENAI_API_KEY === "mock-key") {
    return {
      title: `[${country} - ${storePersona}] ${targetPlatform} 전용 마케팅 서사`,
      hook: `${targetPlatform} 유저들의 심장을 흔드는 ${storePersona} 스타일의 첫 문장...`,
      value: `${persona.strategy} 전략과 ${storeTone} 감계가 결합된 ${targetPlatform} 본문 내용입니다.`,
      cta: `${targetPlatform} 한정 혜택을 놓치지 마세요!`,
      country: country,
      targetPlatform: targetPlatform
    };
  }

  const systemPrompt = isAdmin
    ? `You are a Master Strategic Copywriter for B2B SaaS.
       Focus on how 'LilyMag ERP' solves marketing friction and automates growth.
       Platform: ${targetPlatform}. Tone Guide: ${storeTone}.
       Language: ${country}. Strategy: ${persona.strategy}.`
    : `You are a Master Content Alchemist for the ${country} market in the ${industry} industry. 
       Current Branch Persona: ${storePersona}. Tone Guide: ${storeTone}.
       ${marketingTheme ? `Marketing Theme/Subject: ${marketingTheme}. Use this context to differentiate the brand.` : ''}
       Target Audience: ${targetAudience}. Industry: ${industry}.
       Target Platform: ${targetPlatform}. Strategy: ${persona.strategy}.
       Language: ${country}.`;

  const finalSystemPrompt = systemPrompt + `\nOutput JSON format: { "title": string, "hook": string, "value": string, "cta": string }`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: finalSystemPrompt },
      { role: "user", content: `Generate ${targetPlatform} content for: ${prompt}` }
    ],
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content || "{}");
}
