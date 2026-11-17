import { NextResponse } from "next/server";
import { loadDb, type DbSchema } from "@/lib/server/store";

export const runtime = "nodejs";

/** 导出服务端 db.json 全量（单机备份用） */
export async function GET() {
  try {
    const db = await loadDb();
    return NextResponse.json({
      success: true,
      data: {
        exportedAt: new Date().toISOString(),
        db,
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
