import { NextRequest, NextResponse } from "next/server";
import { generateMarketingCopy } from "@/lib/ai-engine";

export async function POST(req: NextRequest) {
  let requestType = "copy";
  try {
    const { prompt, type, country } = await req.json();
    requestType = type || "copy";

    if (!prompt) {
      return NextResponse.json(
        { error: "Description is required for neural alchemy." },
        { status: 400 }
      );
    }

    const result = await generateMarketingCopy(prompt, requestType as any, country || 'KR');

    return NextResponse.json(result);
  } catch (error) {
    console.error(`AI ${requestType} Route Error:`, error);
    return NextResponse.json(
      { error: "Neural link failed. Please try again." },
      { status: 500 }
    );
  }
}
