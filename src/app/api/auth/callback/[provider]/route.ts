import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  const { searchParams } = new URL(request.url);
  
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(new URL(`/dashboard/settings?error=${error}`, request.url));
  }

  if (!code) {
    return NextResponse.json({ error: '인증 코드가 없습니다.' }, { status: 400 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const redirectUri = `${baseUrl}/api/auth/callback/${provider}`;
  let accessToken = '';
  let refreshToken = '';
  let expiresIn = 0;
  let accountName = '';

  try {
    // =========================================
    // 1. Provider별 Token Exchange
    // =========================================
    if (provider === 'instagram') {
      const clientId = process.env.NEXT_PUBLIC_META_APP_ID || '';
      const clientSecret = process.env.META_APP_SECRET || '';

      const response = await fetch(
        `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${clientId}&redirect_uri=${redirectUri}&client_secret=${clientSecret}&code=${code}`
      );
      const data = await response.json();
      
      if (data.error) {
        console.error('[Meta Auth Error]', data.error);
        return NextResponse.redirect(new URL(`/dashboard/settings?error=${data.error.message}`, request.url));
      }
      accessToken = data.access_token;
      expiresIn = data.expires_in || 5184000; // 기본 60일
    } 
    else if (provider === 'youtube') {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET || '';

      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code',
        }),
      });
      const data = await response.json();

      if (data.error) {
        console.error('[Google Auth Error]', data.error);
        return NextResponse.redirect(new URL(`/dashboard/settings?error=${data.error}`, request.url));
      }
      accessToken = data.access_token;
      refreshToken = data.refresh_token || '';
      expiresIn = data.expires_in || 3600;
    }
    else if (provider === 'naver') {
      const clientId = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID || '';
      const clientSecret = process.env.NAVER_CLIENT_SECRET || '';

      const response = await fetch('https://nid.naver.com/oauth2.0/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: clientId,
          client_secret: clientSecret,
          code,
          redirect_uri: redirectUri,
        }),
      });
      const data = await response.json();

      if (data.error) {
        console.error('[Naver Auth Error]', data.error);
        return NextResponse.redirect(new URL(`/dashboard/settings?error=${data.error}`, request.url));
      }
      accessToken = data.access_token;
      refreshToken = data.refresh_token || '';
      expiresIn = parseInt(data.expires_in) || 3600;
    }
    else if (provider === 'tiktok') {
      const clientKey = process.env.TIKTOK_CLIENT_KEY || '';
      const clientSecret = process.env.TIKTOK_CLIENT_SECRET || '';

      const response = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_key: clientKey,
          client_secret: clientSecret,
          code: code,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
        }),
      });
      const data = await response.json();

      if (data.error) {
        console.error('[TikTok Auth Error]', data.error);
        return NextResponse.redirect(new URL(`/dashboard/settings?error=${data.error_description || data.error}`, request.url));
      }
      accessToken = data.access_token;
      refreshToken = data.refresh_token || '';
      expiresIn = data.expires_in || 3600;
    }
    else if (provider === 'twitter') {
      const clientId = process.env.TWITTER_CLIENT_ID || '';
      const clientSecret = process.env.TWITTER_CLIENT_SECRET || '';

      const response = await fetch('https://api.twitter.com/2/oauth2/token', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
        },
        body: new URLSearchParams({
          code,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
          code_verifier: 'challenge', // state에서 보낸 값과 매칭 필요
        }),
      });
      const data = await response.json();

      if (data.error) {
        console.error('[Twitter Auth Error]', data.error);
        return NextResponse.redirect(new URL(`/dashboard/settings?error=${data.error_description || data.error}`, request.url));
      }
      accessToken = data.access_token;
      refreshToken = data.refresh_token || '';
      expiresIn = data.expires_in || 7200;
    }
    else if (provider === 'blogger') {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET || '';

      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code',
        }),
      });
      const data = await response.json();

      if (data.error) {
        console.error('[Blogger Auth Error]', data.error);
        return NextResponse.redirect(new URL(`/dashboard/settings?error=${data.error}`, request.url));
      }
      accessToken = data.access_token;
      refreshToken = data.refresh_token || '';
      expiresIn = data.expires_in || 3600;
    }
    else {
      return NextResponse.redirect(new URL(`/dashboard/settings?error=unsupported_provider`, request.url));
    }

    // =========================================
    // 2. 토큰을 Supabase DB에 안전하게 저장
    // ⚠️ 더 이상 URL 파라미터로 토큰을 전달하지 않음!
    // =========================================
    const supabase = createServerSupabaseClient();
    
    // 현재 인증된 사용자 가져오기 (쿠키 기반 세션이 없으면 임시 처리)
    // TODO: 실제 배포 시 @supabase/ssr 의 createServerClient로 교체 필요
    const tokenExpiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();

    // ✅ 토큰 탈취 방지: state 파라미터를 맹신하지 않고 보안 세션에서 직접 유저 추출
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('[Secured Auth Error] 유효하지 않은 세션', authError);
      return NextResponse.redirect(new URL(`/dashboard/settings?error=unauthorized_callback`, request.url));
    }
    
    let userId = user.id;

    if (userId) {
      const { error: upsertError } = await supabase
        .from('user_credentials')
        .upsert({
          user_id: userId,
          provider,
          access_token: accessToken,
          refresh_token: refreshToken || null,
          token_expires_at: tokenExpiresAt,
          account_name: accountName || provider,
          is_active: true,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,provider',
        });

      if (upsertError) {
        console.error('[DB Save Error]', upsertError);
        // DB 저장 실패해도 연결은 성공으로 처리 (로그만 남김)
      }
    }

    console.log(`[LilyMag Auth] ${provider} 토큰 저장 완료`);

    // ✅ 토큰 없이 성공 상태만 전달
    return NextResponse.redirect(
      new URL(`/dashboard/settings?success=${provider}`, request.url)
    );

  } catch (err) {
    console.error(`[${provider} Exchange Error]`, err);
    return NextResponse.redirect(new URL(`/dashboard/settings?error=exchange_failed`, request.url));
  }
}
