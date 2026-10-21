import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getLLMConfig } from "@/lib/server/llm";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { content, title, config } = await req.json();

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    // 服务端统一配置优先（豆包 / ModelScope 等），其次才用浏览器端传入的配置
    const serverLLM = getLLMConfig();
    const apiKey = serverLLM.pinned
      ? serverLLM.apiKey
      : config?.apiKey || serverLLM.apiKey;
    const baseURL = serverLLM.pinned
      ? serverLLM.baseURL
      : config?.apiEndpoint || serverLLM.baseURL;
    const model = serverLLM.pinned
      ? serverLLM.model
      : config?.model || serverLLM.model;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API Key 未配置，请在配置中心设置模型 API Key" },
        { status: 400 }
      );
    }

    // 创建 OpenAI 兼容客户端（豆包 / ModelScope 均适用）
    const client = new OpenAI({
      apiKey,
      baseURL,
    });

    const prompt = `请为以下文档生成一个简洁的摘要（200字以内）：

文档标题：${title}
文档内容：
${content.substring(0, 3000)}

摘要要求：
1. 概括文档的核心内容和主要观点
2. 使用简洁清晰的语言
3. 突出重点信息
4. 不超过200字

只返回摘要内容，不要其他说明。`;

    const response = await client.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: "你是一个专业的文档摘要助手，擅长提取核心要点。"
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: config?.temperature || 0.5,
    });

    const summary = response.choices[0]?.message?.content?.trim() || "";

    return NextResponse.json({ summary });
  } catch (error: any) {
    console.error("Error generating summary:", error);

    // 提取更详细的错误信息
    let errorMessage = "生成摘要失败";
    if (error?.response?.data) {
      errorMessage = JSON.stringify(error.response.data);
    } else if (error?.message) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
