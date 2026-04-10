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

  // 2. 인증 코드를 실제 액세스 토큰으로 교환! (Token Exchange)
  let accessToken = '';

  try {
    if (provider === 'instagram') {
      const clientId = process.env.NEXT_PUBLIC_META_APP_ID || "1834771173855867";
      const clientSecret = process.env.META_APP_SECRET;
      // 주의: redirect_uri는 connect 단계에서 보낸 것과 100% 일치해야 함!
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const redirectUri = `${baseUrl}/api/auth/callback/${provider}`;

      const response = await fetch(
        `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${clientId}&redirect_uri=${redirectUri}&client_secret=${clientSecret}&code=${code}`
      );
      const data = await response.json();
      
      if (data.error) {
        console.error('[Meta Auth Error]', data.error);
        return NextResponse.redirect(new URL(`/dashboard/settings?error=${data.error.message}`, request.url));
      }

      accessToken = data.access_token;
    }
    // TODO: Google, Naver 토큰 교환 로직도 차례로 추가 예정!
  } catch (err) {
    console.error(`[${provider} Exchange Error]`, err);
    return NextResponse.redirect(new URL(`/dashboard/settings?error=exchange_failed`, request.url));
  }

  // 3. (TODO) Supabase DB에 토큰 저장
  // 일단 임시로 성공 처리하고 설정 페이지로 강제 귀환!
  console.log(`[LilyMag Global Auth] ${provider} 플랫폼으로부터 최종 토큰 획득 성공:`, accessToken?.substring(0, 10) + '...');

  return NextResponse.redirect(new URL(`/dashboard/settings?success=${provider}&token=${accessToken}`, request.url));
}
