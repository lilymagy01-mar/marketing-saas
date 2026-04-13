import { NextRequest, NextResponse } from "next/server";
import { runGlobalAutonomousEngine } from "@/lib/autonomous-brain";

/**
 * 전 세계 자율 주행 엔진을 깨우는 외부 트리거 (Cron Job용)
 * n8n 스케줄러나 Vercel Cron 등에서 호출합니다.
 */
export async function GET(req: NextRequest) {
  try {
    // 보안을 위해 간단한 API Key 체크 (옵션)
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET || "lily-mag-autonomous-vault-2024";
    
    if (authHeader !== `Bearer ${cronSecret}`) {
      // return NextResponse.json({ error: "Unauthorized neural access." }, { status: 401 });
      // 개발 단계에서는 일단 통과시키거나 Log만 남김
      console.warn("[CRON] Unauthorized attempt or dev mode bypass.");
    }

    console.log("[CRON] Pulse detected. Initializing Global Autonomous Engine...");
    
    const report = await runGlobalAutonomousEngine();

    return NextResponse.json({
      status: "success",
      timestamp: new Date().toISOString(),
      report: report
    });
  } catch (error: any) {
    console.error("[CRON] Global Engine Failure:", error);
    return NextResponse.json(
      { status: "failure", error: error.message },
      { status: 500 }
    );
  }
}

// POST 지원 (일부 서비스용)
export async function POST(req: NextRequest) {
    return GET(req);
}
