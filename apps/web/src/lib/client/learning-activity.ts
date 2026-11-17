/**
 * 客户端学习活动上报
 * 工作区对话 / 笔记 / 练习 → 服务端 learningSessions + userStats
 */

import { getLocalUserId } from "@/lib/identity/local-user";
import type { LearningSession } from "@/lib/analytics/learning-session";

export type RecordActivityInput = {
  activityType: LearningSession["activityType"];
  durationMinutes?: number;
  metadata?: LearningSession["metadata"];
  userId?: string;
};

export async function recordLearningActivity(
  input: RecordActivityInput
): Promise<{ ok: boolean; sessionId?: string }> {
  if (typeof window === "undefined") {
    return { ok: false };
  }

  const userId = input.userId || getLocalUserId();
  const duration = Math.max(1, Math.round(input.durationMinutes ?? 1));
  const end = new Date();
  const start = new Date(end.getTime() - duration * 60_000);

  const session: LearningSession = {
    sessionId: `ls_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    userId,
    startTime: start.toISOString(),
    endTime: end.toISOString(),
    duration,
    activityType: input.activityType,
    metadata: input.metadata,
  };

  try {
    const res = await fetch("/api/analytics/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session }),
    });
    if (!res.ok) {
      console.warn("[learning-activity] 上报失败", res.status);
      return { ok: false };
    }
    const json = await res.json().catch(() => ({}));
    return { ok: true, sessionId: json?.data?.sessionId ?? session.sessionId };
  } catch (err) {
    console.warn("[learning-activity] 网络错误", err);
    return { ok: false };
  }
}
