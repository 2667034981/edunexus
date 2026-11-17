import { NextRequest, NextResponse } from "next/server";
import {
  generateDailyReport,
  generateEnhancedWeeklyReport,
  generateEnhancedMonthlyReport,
  generateYearlyReport,
} from "@/lib/analytics/report-builder";
import { listLearningSessions } from "@/lib/server/learning-session-store";
import { SERVER_FALLBACK_USER_ID } from "@/lib/identity/local-user";

export const runtime = "nodejs";

/**
 * GET /api/analytics/reports
 * 基于真实 learningSessions 生成报告
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const reportType =
      (searchParams.get("type") as "daily" | "weekly" | "monthly" | "yearly") ||
      "weekly";
    const date = searchParams.get("date");
    const userId = searchParams.get("userId") || SERVER_FALLBACK_USER_ID;

    const end = date ? new Date(date) : new Date();
    const start = new Date(end);
    if (reportType === "daily") {
      start.setHours(0, 0, 0, 0);
    } else if (reportType === "weekly") {
      start.setDate(end.getDate() - 7);
    } else if (reportType === "monthly") {
      start.setDate(1);
      start.setMonth(end.getMonth());
    } else {
      start.setMonth(0, 1);
    }

    const sessions = await listLearningSessions({
      userId,
      since: start.toISOString(),
      until: end.toISOString(),
    });

    let report;

    switch (reportType) {
      case "daily": {
        const targetDate = date ? new Date(date) : new Date();
        report = generateDailyReport(sessions, targetDate);
        break;
      }
      case "weekly": {
        const weekStart = date ? new Date(date) : undefined;
        report = generateEnhancedWeeklyReport(sessions, weekStart);
        break;
      }
      case "monthly": {
        const [year, month] = date
          ? date.split("-").map(Number)
          : [undefined, undefined];
        report = generateEnhancedMonthlyReport(
          sessions,
          year,
          month ? month - 1 : undefined
        );
        break;
      }
      case "yearly": {
        const y = date ? new Date(date).getFullYear() : new Date().getFullYear();
        report = generateYearlyReport(sessions, y);
        break;
      }
      default:
        report = generateEnhancedWeeklyReport(sessions);
    }

    return NextResponse.json({
      success: true,
      data: report,
      meta: { sessionCount: sessions.length, userId },
    });
  } catch (error) {
    console.error("生成报告失败:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "生成报告失败",
      },
      { status: 500 }
    );
  }
}
