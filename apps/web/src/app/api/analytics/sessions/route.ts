import { NextRequest, NextResponse } from "next/server";
import type { LearningSession } from "@/lib/analytics/learning-session";
import {
  appendLearningSession,
  listLearningSessions,
} from "@/lib/server/learning-session-store";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const userId = searchParams.get("userId") || undefined;
    const since = searchParams.get("since") || undefined;
    const until = searchParams.get("until") || undefined;
    const sessions = await listLearningSessions({ userId, since, until });
    return NextResponse.json({ success: true, data: { sessions } });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "list failed",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const session = body.session as LearningSession | undefined;
    if (!session?.sessionId || !session?.userId || !session?.activityType) {
      return NextResponse.json(
        { success: false, error: "session 字段不完整" },
        { status: 400 }
      );
    }

    const saved = await appendLearningSession({
      sessionId: session.sessionId,
      userId: session.userId,
      startTime: session.startTime || new Date().toISOString(),
      endTime: session.endTime,
      duration: Math.max(0, Number(session.duration) || 0),
      activityType: session.activityType,
      metadata: session.metadata,
    });

    return NextResponse.json({
      success: true,
      data: { sessionId: saved.sessionId },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "save failed",
      },
      { status: 500 }
    );
  }
}
