import { NextResponse } from "next/server";
import { getModelscopeClient } from "@/lib/server/modelscope";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * 测试 ModelScope API 连接
 * GET /api/test/modelscope
 */
export async function GET() {
  try {
    const client = getModelscopeClient();

    // 测试简单对话
    const completion = await client.chat.completions.create({
      model: process.env.MODELSCOPE_CHAT_MODEL || "Qwen/Qwen3-8B",
      messages: [
        {
          role: "system",
          content: "你是一个测试助手，请简短回复。"
        },
        {
          role: "user",
          content: "你好，这是一个测试。请回复'测试成功'。"
        }
      ],
      temperature: 0.3,
      max_tokens: 50,
    });

    const response = completion.choices[0]?.message?.content || "";

    return NextResponse.json({
      success: true,
      message: "ModelScope API 连接成功",
      model: process.env.MODELSCOPE_CHAT_MODEL,
      response,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("ModelScope test error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        details: error,
      },
      { status: 500 }
    );
  }
}
