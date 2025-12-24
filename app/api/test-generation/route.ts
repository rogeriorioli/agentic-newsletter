import { NextResponse } from "next/server";
import { runDiscovery } from "@/lib/tavily";
import { generateNewsletterContent } from "@/lib/gemini";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get("country") || "Brazil";
  const topicsParam = searchParams.get("topics");
  const topics = topicsParam ? topicsParam.split(",") : ["Artificial Intelligence", "Space Exploration"];
  const language = searchParams.get("language") || "pt-BR";

  try {
    // 1. Discovery Phase
    console.log(`[Test] Discovery for ${country} - Topics: ${topics}`);
    const newsData = await runDiscovery(country, topics);

    // 2. Generation Phase
    console.log(`[Test] Generating content using Gemini in ${language}`);
    const contentData = await generateNewsletterContent(newsData, language);

    return NextResponse.json({
      success: true,
      params: { country, topics, language },
      discovery_results: newsData.results?.length || 0,
      generated_content: contentData
    });
  } catch (error: any) {
    console.error("Test generation error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
