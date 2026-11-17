/**
 * Agent 工具入口：默认使用真实实现（KB / 图谱 / 路径）
 * 旧版 mock 工具保留为 tools.mock.ts 参考，不再被 Agent 引用。
 */
export {
  searchKnowledgeBaseTool,
  queryKnowledgeGraphTool,
  generateExerciseTool,
  recommendLearningPathTool,
  explainConceptTool,
  socraticQuestionTool,
  checkUnderstandingTool,
  queryLearningProgressTool,
  getAllTools,
  getToolsDescription,
} from "./tools-real";
