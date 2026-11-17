/**
 * 学习会话持久化与 userStats 增量更新
 */

import type { LearningSession } from "@/lib/analytics/learning-session";
import type { UserStats } from "@/lib/server/user-level-types";
import { loadDb, saveDb } from "@/lib/server/store";

function emptyUserStats(userId: string): UserStats {
  const now = new Date().toISOString();
  return {
    userId,
    learningMinutes: 0,
    notesCreated: 0,
    notesEdited: 0,
    practiceCorrect: 0,
    practiceWrong: 0,
    knowledgePointsMastered: 0,
    pathsCompleted: 0,
    quizzesPassed: 0,
    postsCount: 0,
    answersCount: 0,
    answersAccepted: 0,
    likesReceived: 0,
    notesShared: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: now,
    updatedAt: now,
  };
}

function applySessionToStats(stats: UserStats, session: LearningSession): UserStats {
  const next = { ...stats };
  next.learningMinutes = (next.learningMinutes || 0) + Math.max(0, session.duration || 0);
  next.lastActiveDate = session.endTime || session.startTime;
  next.updatedAt = new Date().toISOString();

  switch (session.activityType) {
    case "document_create":
      next.notesCreated = (next.notesCreated || 0) + 1;
      break;
    case "document_edit":
      next.notesEdited = (next.notesEdited || 0) + 1;
      break;
    case "practice": {
      const correct = session.metadata?.correctCount ?? 0;
      const total = session.metadata?.questionsCount ?? 0;
      next.practiceCorrect = (next.practiceCorrect || 0) + correct;
      next.practiceWrong = (next.practiceWrong || 0) + Math.max(0, total - correct);
      if (session.metadata?.completed) {
        next.quizzesPassed = (next.quizzesPassed || 0) + 1;
      }
      break;
    }
    default:
      break;
  }

  return next;
}

export async function appendLearningSession(
  session: LearningSession
): Promise<LearningSession> {
  const db = await loadDb();
  if (!Array.isArray(db.learningSessions)) {
    db.learningSessions = [];
  }

  const existingIdx = db.learningSessions.findIndex(
    (s) => s.sessionId === session.sessionId
  );
  if (existingIdx >= 0) {
    db.learningSessions[existingIdx] = session;
  } else {
    db.learningSessions.push(session);
    // 控制体积：最多保留最近 2000 条
    if (db.learningSessions.length > 2000) {
      db.learningSessions = db.learningSessions.slice(-2000);
    }
  }

  const userId = session.userId || "local_default";
  const prev = db.userStats[userId] || emptyUserStats(userId);
  db.userStats[userId] = applySessionToStats(prev, session);

  await saveDb(db);
  return session;
}

export async function listLearningSessions(input: {
  userId?: string;
  since?: string;
  until?: string;
}): Promise<LearningSession[]> {
  const db = await loadDb();
  let list = Array.isArray(db.learningSessions) ? [...db.learningSessions] : [];

  if (input.userId) {
    list = list.filter((s) => s.userId === input.userId);
  }
  if (input.since) {
    const t = new Date(input.since).getTime();
    list = list.filter((s) => new Date(s.startTime).getTime() >= t);
  }
  if (input.until) {
    const t = new Date(input.until).getTime();
    list = list.filter((s) => new Date(s.startTime).getTime() <= t);
  }

  return list.sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );
}

export async function getUserStatsOrEmpty(userId: string): Promise<UserStats> {
  const db = await loadDb();
  return db.userStats[userId] || emptyUserStats(userId);
}
