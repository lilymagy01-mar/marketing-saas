import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  
  // 본 서버 주소 (개발 = localhost, 실운영 = 도메인)
  // Meta(Facebook)는 HTTPS 강제 정책 때문에 반드시 'localhost' 나 'https://'만 허용합니다. (127.0.0.1 차단)
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  // 우리 서버로 돌아올 콜백 주소
  const redirectUri = `${baseUrl}/api/auth/callback/${provider}`;

  let authUrl = '';

  if (provider === 'instagram') {
    // 1. Meta (Instagram) OAuth URL 생성
    // 앱 ID를 URL에서 확인된 최신 버전으로 업데이트 완료!
    const clientId = process.env.NEXT_PUBLIC_META_APP_ID || "1834771173855867";
    const scope = 'instagram_basic,instagram_content_publish,pages_show_list,pages_read_engagement';
    authUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
  } 
  else if (provider === 'youtube') {
    // 2. Google (YouTube) OAuth URL 생성
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const scope = 'https://www.googleapis.com/auth/youtube.upload';
    authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;
  }
  else if (provider === 'naver') {
    // 3. Naver (Blog) OAuth URL 생성
    const clientId = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID;
    const state = Math.random().toString(36).substring(7); // 위조 방지 토큰 (CSRF)
    authUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`;
  }
  else {
    return NextResponse.json({ error: '지원하지 않는 플랫폼입니다.' }, { status: 400 });
  }

  // 생성된 각 빅테크 회사의 로그인 화면으로 유저를 날려버림!
  return NextResponse.redirect(authUrl);
}
