import { describe, expect, it } from "vitest";
import { POST as kbAIChat } from "./route";

describe("kb ai chat api", () => {
  it("should generate summary response", async () => {
    const response = await kbAIChat(
      new Request("http://localhost/api/kb/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentTitle: "测试文档",
          documentContent: "这是一个测试文档的内容。",
          userInput: "请为这篇文档生成摘要"
        })
      })
    );

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.data.response).toBeDefined();
    expect(data.data.response.length).toBeGreaterThan(0);
  });

  it("should handle expand content request", async () => {
    const response = await kbAIChat(
      new Request("http://localhost/api/kb/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentContent: "知识管理系统",
          userInput: "帮我扩展这部分内容"
        })
      })
    );

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.data.response).toContain("扩展");
  });

  it("should handle explain concept request", async () => {
    const response = await kbAIChat(
      new Request("http://localhost/api/kb/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectedText: "双链笔记",
          userInput: "解释一下双链笔记"
        })
      })
    );

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.data.response).toBeDefined();
  });

  it("should reject invalid request", async () => {
    const response = await kbAIChat(
      new Request("http://localhost/api/kb/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userInput: ""
        })
      })
    );

    expect(response.status).toBe(400);
  });
});
