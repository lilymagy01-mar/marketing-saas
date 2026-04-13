import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  const { searchParams } = new URL(request.url);
  
  // 본 서버 주소
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const redirectUri = `${baseUrl}/api/auth/callback/${provider}`;
  
  // user_id를 state 파라미터로 전달 (콜백에서 DB 저장 시 사용)
  const userId = searchParams.get('user_id') || '';

  let authUrl = '';

  if (provider === 'instagram') {
    const clientId = process.env.NEXT_PUBLIC_META_APP_ID || '';
    const scope = 'instagram_basic,instagram_content_publish,pages_show_list,pages_read_engagement';
    authUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code&state=${userId}`;
  } 
  else if (provider === 'youtube') {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
    const scope = 'https://www.googleapis.com/auth/youtube.upload';
    authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent&state=${userId}`;
  }
  else if (provider === 'naver') {
    const clientId = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID || '';
    authUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${userId}`;
  }
  else if (provider === 'threads') {
    // Threads는 Instagram과 동일 계정 사용 (Meta Graph API)
    const clientId = process.env.NEXT_PUBLIC_META_APP_ID || '';
    const scope = 'threads_basic,threads_content_publish';
    authUrl = `https://www.threads.net/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code&state=${userId}`;
  }
  else if (provider === 'tiktok') {
    const clientKey = process.env.TIKTOK_CLIENT_KEY || '';
    const scope = 'user.info.basic,video.upload,video.publish,video.publish.direct';
    authUrl = `https://www.tiktok.com/v2/auth/authorize/?client_key=${clientKey}&scope=${scope}&response_type=code&redirect_uri=${redirectUri}&state=${userId}`;
  }
  else if (provider === 'twitter') {
    const clientId = process.env.TWITTER_CLIENT_ID || '';
    const scope = 'tweet.read tweet.write users.read offline.access';
    // OAuth 2.0 (PKCE를 위해 간단하게 state만 사용, 실제 배포 시 PKCE 강화 권장)
    authUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${userId}&code_challenge=challenge&code_challenge_method=plain`;
  }
  else if (provider === 'blogger') {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
    const scope = 'https://www.googleapis.com/auth/blogger';
    authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent&state=${userId}`;
  }
  else {
    return NextResponse.json({ error: '지원하지 않는 플랫폼입니다.' }, { status: 400 });
  }

  return NextResponse.redirect(authUrl);
}
