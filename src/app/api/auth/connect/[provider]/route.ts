import { NextResponse } from 'next/server';
import { getPlatformConfig } from '@/lib/platform-config';

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
    const config = await getPlatformConfig('auth_meta', { 
      id: process.env.NEXT_PUBLIC_META_APP_ID 
    });
    const clientId = config?.id || '';
    const scope = 'instagram_basic,instagram_content_publish,pages_show_list,pages_read_engagement';
    authUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code&state=${userId}&auth_type=reauthenticate`;
  } 
  else if (provider === 'youtube') {
    const config = await getPlatformConfig('auth_google', {
      id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    });
    const clientId = config?.id || '';
    const scope = 'https://www.googleapis.com/auth/youtube.upload';
    authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent&state=${userId}`;
  }
  else if (provider === 'naver') {
    const config = await getPlatformConfig('auth_naver', {
      id: process.env.NEXT_PUBLIC_NAVER_CLIENT_ID
    });
    const clientId = config?.id || '';
    authUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${userId}`;
  }
  else if (provider === 'threads') {
    const config = await getPlatformConfig('auth_meta', {
      id: process.env.NEXT_PUBLIC_META_APP_ID
    });
    const clientId = config?.id || '';
    const scope = 'threads_basic,threads_content_publish';
    authUrl = `https://www.threads.net/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code&state=${userId}`;
  }
  else if (provider === 'tiktok') {
    const config = await getPlatformConfig('auth_tiktok', {
      key: process.env.TIKTOK_CLIENT_KEY
    });
    const clientKey = config?.key || '';
    const scope = 'user.info.basic,video.upload,video.publish,video.publish.direct';
    authUrl = `https://www.tiktok.com/v2/auth/authorize/?client_key=${clientKey}&scope=${scope}&response_type=code&redirect_uri=${redirectUri}&state=${userId}`;
  }
  else if (provider === 'twitter') {
    const config = await getPlatformConfig('auth_twitter', {
      id: process.env.TWITTER_CLIENT_ID
    });
    const clientId = config?.id || '';
    const scope = 'tweet.read tweet.write users.read offline.access';
    authUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${userId}&code_challenge=challenge&code_challenge_method=plain&prompt=login`;
  }
  else if (provider === 'blogger') {
    const config = await getPlatformConfig('auth_google', {
      id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    });
    const clientId = config?.id || '';
    const scope = 'https://www.googleapis.com/auth/blogger';
    authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent&state=${userId}`;
  }
  else {
    return NextResponse.json({ error: '지원하지 않는 플랫폼입니다.' }, { status: 400 });
  }

  return NextResponse.redirect(authUrl);
}
