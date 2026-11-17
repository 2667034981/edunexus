import { fail, ok } from "@/lib/server/response";
import { saveNoteSchema } from "@/lib/server/schema";
import { saveNoteFromSession } from "@/lib/server/kb-lite";
import { appendLearningSession } from "@/lib/server/learning-session-store";
import { SERVER_FALLBACK_USER_ID } from "@/lib/identity/local-user";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const json = await request.json().catch(() => ({}));
    const parsed = saveNoteSchema.safeParse(json);
    if (!parsed.success) {
      return fail({
        code: "INVALID_REQUEST",
        message: "请求参数不合法。",
        details: parsed.error.flatten()
      });
    }

    const saved = await saveNoteFromSession({
      sessionId: parsed.data.sessionId,
      title: parsed.data.title,
      content: parsed.data.content,
      tags: parsed.data.tags,
      links: parsed.data.links
    });

    // 笔记保存回流到学习分析
    const userId =
      (typeof (json as { userId?: string }).userId === "string" &&
        (json as { userId?: string }).userId) ||
      SERVER_FALLBACK_USER_ID;
    const now = new Date();
    void appendLearningSession({
      sessionId: `note_${Date.now()}`,
      userId,
      startTime: new Date(now.getTime() - 60_000).toISOString(),
      endTime: now.toISOString(),
      duration: 2,
      activityType: "document_create",
      metadata: {
        documentTitle: parsed.data.title,
        documentId: (saved as { id?: string })?.id,
      },
    }).catch(() => undefined);

    return ok(saved);
  } catch (error) {
    return fail(
      {
        code: "NOTE_SAVE_FAILED",
        message: "保存笔记失败。",
        details: error instanceof Error ? error.message : error
      },
      500
    );
  }
}
