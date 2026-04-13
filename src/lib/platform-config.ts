import { createServerSupabaseClient } from './supabase';

export interface SNSConfig {
  id?: string;
  secret?: string;
  key?: string; // for TikTok
}

/**
 * 전역 플랫폼 설정을 DB(platform_config)에서 가져오고, 없으면 ENV에서 폴백합니다.
 */
export async function getPlatformConfig(key: string, envFallback?: { id?: string, secret?: string, key?: string }) {
  const supabase = createServerSupabaseClient();
  
  try {
    const { data, error } = await supabase
      .from('platform_config')
      .select('value')
      .eq('key', key)
      .single();

    if (error || !data) {
      return envFallback;
    }

    return data.value as SNSConfig;
  } catch (err) {
    return envFallback;
  }
}

/**
 * 모든 SNS 마스터 설정을 한 번에 가져옵니다.
 */
export async function getAllPlatformConfigs() {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase.from('platform_config').select('*');
  
  const configMap: Record<string, any> = {};
  data?.forEach(item => {
    configMap[item.key] = item.value;
  });

  return {
    meta: configMap['auth_meta'] || { 
      id: process.env.NEXT_PUBLIC_META_APP_ID, 
      secret: process.env.META_APP_SECRET 
    },
    google: configMap['auth_google'] || { 
      id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID, 
      secret: process.env.GOOGLE_CLIENT_SECRET 
    },
    naver: configMap['auth_naver'] || { 
      id: process.env.NEXT_PUBLIC_NAVER_CLIENT_ID, 
      secret: process.env.NAVER_CLIENT_SECRET 
    },
    tiktok: configMap['auth_tiktok'] || { 
      key: process.env.TIKTOK_CLIENT_KEY, 
      secret: process.env.TIKTOK_CLIENT_SECRET 
    },
    twitter: configMap['auth_twitter'] || { 
      id: process.env.TWITTER_CLIENT_ID, 
      secret: process.env.TWITTER_CLIENT_SECRET 
    },
    n8n: configMap['n8n_master_url']?.url || '',
    openai: configMap['openai_master_key']?.key || process.env.OPENAI_API_KEY
  };
}
