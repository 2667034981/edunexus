import { NextRequest, NextResponse } from "next/server";
import { generateLearningInsights } from "@/lib/analytics/report-generator";
import {
  getUserStatsOrEmpty,
  listLearningSessions,
} from "@/lib/server/learning-session-store";
import { SERVER_FALLBACK_USER_ID } from "@/lib/identity/local-user";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId") || SERVER_FALLBACK_USER_ID;
    const period = searchParams.get("period") || "month";

    const endDate = new Date();
    const startDate = new Date(endDate);
    if (period === "week") {
      startDate.setDate(endDate.getDate() - 7);
    } else {
      startDate.setDate(endDate.getDate() - 30);
    }

    const userStats = await getUserStatsOrEmpty(userId);
    const sessions = await listLearningSessions({
      userId,
      since: startDate.toISOString(),
      until: endDate.toISOString(),
    });

    const insights = generateLearningInsights(sessions, userStats);
    return NextResponse.json(insights);
  } catch (error) {
    console.error("Error generating AI insights:", error);
    return NextResponse.json(
      { error: "Failed to generate AI insights" },
      { status: 500 }
    );
  }
}
