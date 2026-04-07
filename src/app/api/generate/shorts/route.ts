import { NextRequest, NextResponse } from "next/server";
import { generateShortsScenario } from "@/lib/ai-engine";

export async function POST(req: NextRequest) {
  try {
    const { prompt, country } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Description is required for neural synthesis." },
        { status: 400 }
      );
    }

    const scenario = await generateShortsScenario(prompt, country || 'KR');

    return NextResponse.json(scenario);
  } catch (error) {
    console.error("AI Route Error:", error);
    return NextResponse.json(
      { error: "Neural link failed. Please try again." },
      { status: 500 }
    );
  }
}
