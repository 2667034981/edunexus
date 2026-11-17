import { NextRequest, NextResponse } from "next/server";
import { generateWeeklyReport } from "@/lib/analytics/report-generator";
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
    const date = searchParams.get("date");

    const endDate = date ? new Date(date) : new Date();
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - 7);

    const userStats = await getUserStatsOrEmpty(userId);
    const sessions = await listLearningSessions({
      userId,
      since: startDate.toISOString(),
      until: endDate.toISOString(),
    });

    const report = generateWeeklyReport(sessions, userStats);
    return NextResponse.json(report);
  } catch (error) {
    console.error("Error generating weekly report:", error);
    return NextResponse.json(
      { error: "Failed to generate weekly report" },
      { status: 500 }
    );
  }
}
