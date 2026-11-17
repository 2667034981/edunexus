import { NextRequest, NextResponse } from "next/server";
import { generateMonthlyReport } from "@/lib/analytics/report-generator";
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
    const startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);

    const userStats = await getUserStatsOrEmpty(userId);
    const sessions = await listLearningSessions({
      userId,
      since: startDate.toISOString(),
      until: endDate.toISOString(),
    });

    const report = generateMonthlyReport(sessions, userStats);
    return NextResponse.json(report);
  } catch (error) {
    console.error("Error generating monthly report:", error);
    return NextResponse.json(
      { error: "Failed to generate monthly report" },
      { status: 500 }
    );
  }
}
