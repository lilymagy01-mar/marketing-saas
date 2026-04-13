import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import { createServerSupabaseClient } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const supabase = createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "접근 권한이 없습니다 (Unauthorized)." }, { status: 401 });
    }

    const { oneliner } = await req.json();

    if (!oneliner) {
      return NextResponse.json({ error: "입력된 텍스트가 없습니다." }, { status: 400 });
    }

    const prompt = `
당신은 자청의 '더 시스템' 철학을 기반으로 하는 마케팅 CMO 에이전트입니다.
사용자가 자신의 비즈니스를 설명하는 단 한 줄의 텍스트(One-liner)를 입력했습니다.
이 텍스트를 분석하여, 우리 SaaS 플랫폼이 자동화 마케팅을 완벽하게 수행할 수 있도록 비즈니스 프로필을 세팅해주세요.

업종(Industry) 코드는 다음 중 가장 가까운 것을 선택하세요: 'SAAS', 'FLOWER', 'FASHION', 'RESTAURANT', 'REAL_ESTATE'. (해당 없으면 SAAS)

사용자 입력: "${oneliner}"

반드시 아래 JSON 포맷으로만 응답을 반환하세요:
{
  "shopName": "추출되거나 생성된 2~4글자의 샵 이름 (예: 강남라운지바)",
  "industryCode": "업종 코드",
  "marketingTheme": "고객의 심리적 욕구를 찌르는 브랜딩 테마/카피 (한국어, 예: '강남 상위 1%를 위한 은밀한 유혹')",
  "targetAudience": "구체적인 타겟 고객층 설명 (한국어)"
}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "system", content: prompt }],
      response_format: { type: "json_object" },
    });

    const resultStr = completion.choices[0].message.content || "{}";
    const result = JSON.parse(resultStr);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Onboarding setup error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
