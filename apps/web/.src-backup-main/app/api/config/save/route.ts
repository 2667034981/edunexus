import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * 保存配置到服务器
 * POST /api/config/save
 *
 * 注意：这个 API 仅用于演示，实际生产环境中应该：
 * 1. 添加身份验证
 * 2. 使用数据库存储配置
 * 3. 不要直接修改环境变量
 */
export async function POST(request: Request) {
  try {
    const config = await request.json();

    // 在实际应用中，这里应该保存到数据库
    // 目前只返回成功响应，配置实际保存在客户端 localStorage
    console.log("Config save requested:", {
      ...config,
      MODELSCOPE_API_KEY: config.MODELSCOPE_API_KEY ? "***" : undefined,
    });

    return NextResponse.json({
      success: true,
      message: "配置已保存到客户端",
    });
  } catch (error) {
    console.error("Failed to save config:", error);
    return NextResponse.json(
      {
        success: false,
        error: "保存配置失败",
      },
      { status: 500 }
    );
  }
}
