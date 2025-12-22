import { NextResponse } from "next/server";
import { runDiscovery } from "@/lib/tavily";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get("country") || "Brazil";
  const topicsParam = searchParams.get("topics");
  const topics = topicsParam ? topicsParam.split(",") : ["AI", "Technology"];

  try {
    console.log(`Testing discovery for Country: ${country}, Topics: ${topics}`);
    const results = await runDiscovery(country, topics);
    return NextResponse.json({ success: true, params: { country, topics }, data: results });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
