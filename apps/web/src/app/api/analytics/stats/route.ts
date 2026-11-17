import { NextRequest, NextResponse } from "next/server";
import { AnalyticsEngine, createTimeRange } from "@/lib/analytics/analytics-engine";
import { listLearningSessions } from "@/lib/server/learning-session-store";
import { SERVER_FALLBACK_USER_ID } from "@/lib/identity/local-user";

export const runtime = "nodejs";

/**
 * GET /api/analytics/stats
 * 真实学习会话统计
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId") || SERVER_FALLBACK_USER_ID;
    const rangeType =
      (searchParams.get("range") as "day" | "week" | "month" | "year") || "week";
    const startDate = searchParams.get("start");
    const endDate = searchParams.get("end");

    let timeRange;
    if (startDate && endDate) {
      timeRange = createTimeRange("custom", new Date(startDate), new Date(endDate));
    } else {
      timeRange = createTimeRange(rangeType);
    }

    const sessions = await listLearningSessions({
      userId,
      since: timeRange.start.toISOString(),
      until: timeRange.end.toISOString(),
    });

    const behaviorAnalysis = AnalyticsEngine.analyzeLearningBehavior(
      sessions,
      timeRange
    );
    const metrics = AnalyticsEngine.calculateMetrics(sessions);
    const heatmapData = AnalyticsEngine.generateHeatmap(sessions);

    return NextResponse.json({
      success: true,
      data: {
        timeRange: {
          start: timeRange.start.toISOString(),
          end: timeRange.end.toISOString(),
        },
        behaviorAnalysis,
        metrics,
        heatmapData,
        sessionCount: sessions.length,
      },
    });
  } catch (error) {
    console.error("获取统计数据失败:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "获取统计数据失败",
      },
      { status: 500 }
    );
  }
}
