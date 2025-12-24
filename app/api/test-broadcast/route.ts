import { NextResponse } from "next/server";
import { broadcastNewsletter } from "@/lib/broadcast";

export async function GET() {
  try {
    console.log("Triggering manual broadcast...");
    // Await execution for testing purposes.
    // Warning: In production with many users, this might timeout a serverless function.
    // Better strictly for local testing or with few users.
    await broadcastNewsletter();

    return NextResponse.json({ success: true, message: "Broadcast execution completed." });
  } catch (error: any) {
    console.error("Broadcast failed:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
