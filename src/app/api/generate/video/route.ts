import { NextResponse } from "next/server";
import { createServerSupabaseClient } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const supabase = createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "접근 권한이 없습니다 (Unauthorized)." }, { status: 401 });
    }

    const { scenario } = await req.json();

    if (!scenario) {
      return NextResponse.json({ error: "시나리오 데이터가 없습니다." }, { status: 400 });
    }

    // 🚀 [Autopus Engine] 
    // 여기서 실제로 DALL-E 이미지 + TTS 음성 추출 후 FFmpeg 람다 서버로 보내 영상을 합성합니다.
    // 현재는 틱톡 연동 테스트를 위해 더미 MP4 영상을 반환하도록 처리되어 있습니다.
    
    // 합성 딜레이 시뮬레이션 (3초)
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // 공개적으로 접근 가능한 더미 MP4 파일 경로 (안전한 테스트용)
    const dummyVideoUrl = "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";

    return NextResponse.json({ 
        videoUrl: dummyVideoUrl,
        message: "Video rendered successfully"
    });
  } catch (error: any) {
    console.error("Video generation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
