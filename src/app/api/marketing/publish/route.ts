import { NextResponse } from 'next/server';

/**
 * LilyMag 관리자 전용 마케팅 배포 프록시
 * 사장님의 .env.local 키를 안전하게 n8n으로 전달합니다.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { draftId, userId, platforms } = body;

    // 1. 사령관님의 환경 변수 추출
    const OPENAI_KEY = process.env.OPENAI_API_KEY;
    const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const WEBHOOK_URL = process.env.N8N_PUBLISH_WEBHOOK_URL; 

    if (!OPENAI_KEY || !SUPABASE_KEY || !WEBHOOK_URL) {
      return NextResponse.json({ error: "관리자 설정(.env.local)이 누락되었습니다." }, { status: 500 });
    }

    // 2. n8n으로 마스터 키와 함께 발사 명령 전송
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-openai-key': OPENAI_KEY,
        'x-supabase-key': SUPABASE_KEY,
        'x-supabase-url': SUPABASE_URL as string,
      },
      body: JSON.stringify({
        draft_id: draftId,
        user_id: userId,
        platforms: platforms,
        timestamp: new Date().toISOString()
      }),
    });

    if (!response.ok) {
      throw new Error(`n8n 서버 응답 오류: ${response.statusText}`);
    }

    return NextResponse.json({ success: true, message: "사령부 발사 명령 완료" });

  } catch (error: any) {
    console.error('[API_ERROR]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
