import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { getPlatformConfig } from '@/lib/platform-config';

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
      const config = await getPlatformConfig('auth_meta', {
        id: process.env.NEXT_PUBLIC_META_APP_ID,
        secret: process.env.META_APP_SECRET
      });
      const clientId = config?.id || '';
      const clientSecret = config?.secret || '';

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
      const config = await getPlatformConfig('auth_google', {
        id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        secret: process.env.GOOGLE_CLIENT_SECRET
      });
      const clientId = config?.id || '';
      const clientSecret = config?.secret || '';

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
      const config = await getPlatformConfig('auth_naver', {
        id: process.env.NEXT_PUBLIC_NAVER_CLIENT_ID,
        secret: process.env.NAVER_CLIENT_SECRET
      });
      const clientId = config?.id || '';
      const clientSecret = config?.secret || '';

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
      const config = await getPlatformConfig('auth_tiktok', {
        key: process.env.TIKTOK_CLIENT_KEY,
        secret: process.env.TIKTOK_CLIENT_SECRET
      });
      const clientKey = config?.key || '';
      const clientSecret = config?.secret || '';

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
      const config = await getPlatformConfig('auth_twitter', {
        id: process.env.TWITTER_CLIENT_ID,
        secret: process.env.TWITTER_CLIENT_SECRET
      });
      const clientId = config?.id || '';
      const clientSecret = config?.secret || '';

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
          code_verifier: 'challenge',
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
      const config = await getPlatformConfig('auth_google', {
        id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        secret: process.env.GOOGLE_CLIENT_SECRET
      });
      const clientId = config?.id || '';
      const clientSecret = config?.secret || '';

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
    // =========================================
    const supabase = createServerSupabaseClient();
    const tokenExpiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();
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
      }
    }

    console.log(`[LilyMag Auth] ${provider} 토큰 저장 완료`);
    return NextResponse.redirect(new URL(`/dashboard/settings?success=${provider}`, request.url));

  } catch (err) {
    console.error(`[${provider} Exchange Error]`, err);
    return NextResponse.redirect(new URL(`/dashboard/settings?error=exchange_failed`, request.url));
  }
}
