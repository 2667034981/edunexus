import { NextResponse } from "next/server";
import { getLLMConfig } from "@/lib/server/llm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** 豆包（火山方舟）常用文本模型，供设置页下拉选择 */
const DOUBAO_MODELS = [
  { id: "doubao-seed-1-6-250615", name: "Doubao Seed 1.6", description: "通用旗舰模型，支持深度思考" },
  { id: "doubao-seed-1-6-flash-250615", name: "Doubao Seed 1.6 Flash", description: "轻量快速，成本低" },
  { id: "doubao-1-5-pro-32k-250115", name: "Doubao 1.5 Pro 32k", description: "长上下文通用模型" },
  { id: "doubao-1-5-lite-32k-250115", name: "Doubao 1.5 Lite 32k", description: "轻量模型，响应快" },
  { id: "doubao-1-5-vision-pro-32k-250115", name: "Doubao 1.5 Vision Pro", description: "支持图片理解" }
];

/**
 * 获取可用模型列表
 * GET /api/models/list
 *
 * 豆包模式下返回内置列表（火山方舟需先开通模型，实际可用清单以控制台为准），
 * 其余模式沿用 ModelScope 的模型接口。
 */
export async function GET() {
  const llm = getLLMConfig();

  if (llm.provider === "doubao") {
    return NextResponse.json({
      success: true,
      models: DOUBAO_MODELS.map((m) => ({
        ...m,
        provider: "Doubao",
        multimodal: m.id.includes("vision"),
      })),
      total: DOUBAO_MODELS.length,
      source: "builtin",
      current: llm.model
    });
  }

  try {
    // 调用 ModelScope API 获取模型列表
    const response = await fetch("https://api-inference.modelscope.cn/v1/models", {
      headers: {
        Authorization: `Bearer ${process.env.MODELSCOPE_API_KEY}`,
      },
    });

    if (!response.ok) {
      console.error(`ModelScope API error: ${response.status} ${response.statusText}`);
      throw new Error(`ModelScope API error: ${response.statusText}`);
    }

    const data = await response.json();

    // 直接返回所有模型，不要过滤
    const models = (data.data || []).map((model: any) => {
      const id = model.id || "";
      const name = id.split("/").pop() || id;

      // Qwen3.5 系列都是多模态（不需要 VL 后缀）
      const isQwen35 = id.includes("Qwen3.5");
      const isVL = id.includes("-VL") || id.includes("VL-");
      const isMultimodal = isQwen35 || isVL;

      return {
        id: model.id,
        name,
        description: `${name}`,
        provider: "ModelScope",
        multimodal: isMultimodal,
        created: model.created,
      };
    });

    return NextResponse.json({
      success: true,
      models,
      total: models.length,
      source: "api",
    });
  } catch (error) {
    console.error("Failed to fetch models from API:", error);

    // 如果 API 调用失败，返回空列表并提示用户
    return NextResponse.json({
      success: false,
      models: [],
      total: 0,
      source: "error",
      error: error instanceof Error ? error.message : "Unknown error",
      message: "无法获取模型列表，请检查 MODELSCOPE_API_KEY 是否配置正确",
    }, { status: 500 });
  }
}
