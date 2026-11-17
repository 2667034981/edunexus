import { NextRequest, NextResponse } from "next/server";
import { loadDb, saveDb, type DbSchema } from "@/lib/server/store";
import { restoreVaultFiles } from "@/lib/server/kb-lite";

export const runtime = "nodejs";

function asArray<T>(value: unknown, fallback: T[]): T[] {
  return Array.isArray(value) ? (value as T[]) : fallback;
}

function asRecord<T>(value: unknown, fallback: Record<string, T>): Record<string, T> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, T>)
    : fallback;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const incoming = (body.db ?? body) as Partial<DbSchema>;
    if (!incoming || typeof incoming !== "object") {
      return NextResponse.json(
        { success: false, error: "缺少 db 载荷" },
        { status: 400 }
      );
    }

    const current = await loadDb();
    const next: DbSchema = {
      sessions: asArray(incoming.sessions, current.sessions),
      plans: asArray(incoming.plans, current.plans),
      syncedPaths: asArray(incoming.syncedPaths, current.syncedPaths),
      masteryByNode: asRecord(incoming.masteryByNode, current.masteryByNode),
      userLevels: asRecord(incoming.userLevels, current.userLevels),
      userExperience: asRecord(incoming.userExperience, current.userExperience),
      userAchievements: asArray(incoming.userAchievements, current.userAchievements),
      userStats: asRecord(incoming.userStats, current.userStats),
      expGainHistory: asArray(incoming.expGainHistory, current.expGainHistory),
      resources: asArray(incoming.resources, current.resources),
      bookmarks: asArray(incoming.bookmarks, current.bookmarks),
      bookmarkFolders: asArray(incoming.bookmarkFolders, current.bookmarkFolders),
      resourceNotes: asArray(incoming.resourceNotes, current.resourceNotes),
      collabSessions: asArray(incoming.collabSessions, current.collabSessions),
      collabMessages: asArray(incoming.collabMessages, current.collabMessages),
      collabVersions: asArray(incoming.collabVersions, current.collabVersions),
      learningSessions: asArray(
        incoming.learningSessions,
        current.learningSessions
      ),
    };

    await saveDb(next);

    // 恢复 vault 笔记原文（如果备份里带了）
    let restoredVaultFiles = 0;
    try {
      const vault = (body as { vault?: unknown }).vault;
      if (Array.isArray(vault)) {
        restoredVaultFiles = await restoreVaultFiles(
          vault as Array<{ relPath: string; content: string }>
        );
      }
    } catch {
      restoredVaultFiles = 0;
    }

    return NextResponse.json({
      success: true,
      data: { importedAt: new Date().toISOString(), restoredVaultFiles },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "import failed",
      },
      { status: 500 }
    );
  }
}
