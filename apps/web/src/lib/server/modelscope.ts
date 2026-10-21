import type OpenAI from "openai";
import { chatCompletion, getChatModel, getLLMClient } from "./llm";

/**
 * 兼容层：历史代码统一通过这两个入口访问模型。
 * 实际供应商由 lib/server/llm.ts 根据环境变量解析（豆包 / ModelScope / OpenAI / Ollama）。
 */

export function getModelscopeClient(): OpenAI {
  return getLLMClient();
}

export function getModelscopeModel(): string {
  return getChatModel();
}

export async function chatWithModelscope(prompt: string) {
  return chatCompletion([{ role: "user", content: prompt }], {
    temperature: 0.3,
    system: "你是 EduNexus 学习引导助手。请优先引导而非直接给答案。"
  });
}
