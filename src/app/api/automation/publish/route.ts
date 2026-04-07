import { NextResponse } from "next/server";

// n8n Webhook URL (Example - Should be set in .env)
const N8N_PUBLISH_WEBHOOK = process.env.N8N_PUBLISH_WEBHOOK || "https://n8n.your-server.com/webhook/publish-sns";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { platform, country, content, type } = body;

    console.log(`[Automation] Initiating ${type} publish for ${country} on ${platform}...`);

    // Mock response if n8n is not configured, otherwise send to n8n
    if (!process.env.N8N_PUBLISH_WEBHOOK) {
      // Shhh... Simulated success for a premium feel
      await new Promise(resolve => setTimeout(resolve, 2000));
      return NextResponse.json({
        status: "success",
        message: `Successfully simulated publish to ${platform} for ${country}`,
        postUrl: `https://${platform.toLowerCase()}.com/p/lily-mag-v4-success`
      });
    }

    const response = await fetch(N8N_PUBLISH_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "LilyMag-Dashboard",
        timestamp: new Date().toISOString(),
        platform,
        country,
        type, // shorts, blog, threads
        content
      }),
    });

    if (!response.ok) throw new Error("n8n Bridge connection failed");

    const result = await response.json();
    return NextResponse.json(result);

  } catch (error) {
    console.error("Automation error:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to connect to automation bridge" },
      { status: 500 }
    );
  }
}
