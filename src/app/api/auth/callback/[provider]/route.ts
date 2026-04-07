import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  const { searchParams } = new URL(request.url);
  
  // 빅테크 회사가 우리에게 던져준 인증 코드(code)
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(new URL(`/dashboard/settings?error=${error}`, request.url));
  }

  if (!code) {
    return NextResponse.json({ error: '인증 코드가 없습니다.' }, { status: 400 });
  }

  // TODO: 여기서 code를 가지고 각 빅테크 서버(Meta, Google, Naver)에 요청하여 
  // 진짜 '액세스 토큰(Access Token)'으로 교환해야 합니다.
  
  // TODO: 교환받은 액세스 토큰을 Supabase의 'sns_vault' 테이블에 저장해야 합니다.

  console.log(`[LilyMag Global Auth] ${provider} 플랫폼으로부터 1차 인증 코드 획득 완료:`, code);

  // 일단 임시로 성공 처리하고 설정 페이지로 강제 귀환! (임시 Token 표시)
  // 실제 프로덕션에서는 토큰을 암호화하여 DB에 넣고, url 쿼리에 토큰을 노출하지 않아야 함.
  return NextResponse.redirect(new URL(`/dashboard/settings?success=${provider}&tempCode=${code}`, request.url));
}
