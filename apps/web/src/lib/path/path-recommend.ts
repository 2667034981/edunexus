/**
 * 学习路径推荐（规则 + 本地已同步路径）
 * 供 API 与 Agent 工具共用，避免各处重复一套 mock。
 */

export type PathRecommendInput = {
  goal: string;
  currentLevel?: string;
  interests?: string[];
  timeAvailable?: number; // 每天可用分钟，默认 30
};

export type PathRecommendation = {
  id: string;
  title: string;
  reason: string;
  matchScore: number;
  estimatedDays: number;
  source?: "rule" | "synced";
};

export function generatePathRecommendations(
  params: PathRecommendInput
): PathRecommendation[] {
  const goal = (params.goal || "").trim();
  const currentLevel = params.currentLevel || "beginner";
  const interests = params.interests || [];
  const timeAvailable = Math.max(1, params.timeAvailable || 30);

  const recommendations: PathRecommendation[] = [];

  if (
    goal.toLowerCase().includes("前端") ||
    goal.toLowerCase().includes("frontend") ||
    interests.some((i) =>
      ["前端", "web", "html", "css", "javascript"].includes(i.toLowerCase())
    )
  ) {
    recommendations.push({
      id: "frontend-basics",
      title: "前端开发入门",
      reason: "适合初学者，涵盖 HTML、CSS 和 JavaScript 基础",
      matchScore: currentLevel === "beginner" ? 95 : 75,
      estimatedDays: Math.ceil(2400 / (timeAvailable * 60)),
      source: "rule",
    });
  }

  if (
    goal.toLowerCase().includes("python") ||
    goal.toLowerCase().includes("数据") ||
    interests.some((i) =>
      ["python", "数据分析", "机器学习"].includes(i.toLowerCase())
    )
  ) {
    recommendations.push({
      id: "python-basics",
      title: "Python 编程入门",
      reason: "Python 是数据科学和机器学习的首选语言",
      matchScore: 85,
      estimatedDays: Math.ceil(1800 / (timeAvailable * 60)),
      source: "rule",
    });
  }

  if (
    goal.toLowerCase().includes("算法") ||
    goal.toLowerCase().includes("数据结构") ||
    currentLevel === "intermediate" ||
    currentLevel === "advanced"
  ) {
    recommendations.push({
      id: "data-structures",
      title: "数据结构与算法",
      reason: "提升编程能力，为技术面试做准备",
      matchScore: currentLevel === "beginner" ? 60 : 90,
      estimatedDays: Math.ceil(3600 / (timeAvailable * 60)),
      source: "rule",
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      id: "frontend-basics",
      title: "前端开发入门",
      reason: "通用推荐：前端开发是最容易入门的方向",
      matchScore: 70,
      estimatedDays: Math.ceil(2400 / (timeAvailable * 60)),
      source: "rule",
    });
  }

  return recommendations.sort((a, b) => b.matchScore - a.matchScore);
}

/** 把本地已同步路径映射成推荐项（按主题关键词匹配） */
export function rankSyncedPathsAsRecommendations(
  paths: Array<{
    pathId: string;
    title: string;
    description?: string;
    progress?: number;
    tags?: string[];
    status?: string;
  }>,
  topic: string
): PathRecommendation[] {
  const q = topic.trim().toLowerCase();
  if (!q || paths.length === 0) return [];

  return paths
    .map((p) => {
      const hay = `${p.title} ${p.description || ""} ${(p.tags || []).join(" ")}`.toLowerCase();
      const hit = hay.includes(q) || q.split(/\s+/).some((t) => t && hay.includes(t));
      const progress = typeof p.progress === "number" ? p.progress : 0;
      return {
        id: p.pathId,
        title: p.title,
        reason: hit
          ? `与「${topic}」相关的已有路径（进度 ${Math.round(progress)}%）`
          : `本地已有路径（进度 ${Math.round(progress)}%）`,
        matchScore: hit ? 88 + Math.min(10, Math.round(progress / 10)) : 40 + Math.min(20, Math.round(progress / 5)),
        estimatedDays: 0,
        source: "synced" as const,
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5);
}
