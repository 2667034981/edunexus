import { fail, ok } from "@/lib/server/response";
import { NextRequest } from "next/server";
import { generatePathRecommendations } from "@/lib/path/path-recommend";

export const runtime = "nodejs";

/**
 * AI / 规则路径推荐 API
 * 根据用户的学习目标、当前水平和兴趣推荐合适的学习路径
 */
export async function POST(request: NextRequest) {
  try {
    const json = await request.json().catch(() => ({}));
    const { goal, currentLevel, interests, timeAvailable } = json;

    if (!goal) {
      return fail({
        code: "INVALID_REQUEST",
        message: "请提供学习目标",
      });
    }

    const recommendations = generatePathRecommendations({
      goal,
      currentLevel: currentLevel || "beginner",
      interests: interests || [],
      timeAvailable: timeAvailable || 30,
    });

    return ok({
      recommendations,
      message: "成功生成推荐路径",
    });
  } catch (error) {
    return fail(
      {
        code: "RECOMMENDATION_FAILED",
        message: "生成推荐失败",
        details: error instanceof Error ? error.message : error,
      },
      500
    );
  }
}
