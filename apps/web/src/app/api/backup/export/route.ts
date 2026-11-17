import { NextResponse } from "next/server";
import { loadDb, type DbSchema } from "@/lib/server/store";
import { dumpVaultFiles } from "@/lib/server/kb-lite";

export const runtime = "nodejs";

/** 一键备份：服务端 db.json 全量 + vault 笔记原文（单机备份用） */
export async function GET() {
  try {
    const [db, vault] = await Promise.all([
      loadDb(),
      dumpVaultFiles().catch(() => [] as Array<{ relPath: string; content: string }>),
    ]);
    return NextResponse.json({
      success: true,
      data: {
        exportedAt: new Date().toISOString(),
        version: 2,
        db,
        vault,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "export failed",
      },
      { status: 500 }
    );
  }
}

/** 用备份中的 serverDb 覆盖写入（合并已知字段，缺省用当前值） */
export async function POST() {
  return NextResponse.json(
    { success: false, error: "请使用 /api/backup/import" },
    { status: 405 }
  );
}

export type { DbSchema };
