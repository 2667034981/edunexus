"use client";

import { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  Sparkles,
  X,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  FileText,
  Wand2,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

type AISuggestion = {
  id: string;
  type: "summary" | "expand" | "explain" | "improve";
  title: string;
  content: string;
};

type AIAssistantProps = {
  documentId?: string;
  documentTitle?: string;
  documentContent?: string;
  selectedText?: string;
  onInsertText?: (text: string) => void;
};

export function AIAssistant({
  documentId,
  documentTitle,
  documentContent,
  selectedText,
  onInsertText
}: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 生成快捷建议
  useEffect(() => {
    if (isOpen && documentContent) {
      const newSuggestions: AISuggestion[] = [
        {
          id: "summary",
          type: "summary",
          title: "生成摘要",
          content: "为这篇文档生成一个简洁的摘要"
        },
        {
          id: "expand",
          type: "expand",
          title: "扩展内容",
          content: "帮我扩展这部分内容，增加更多细节"
        }
      ];

      if (selectedText) {
        newSuggestions.push({
          id: "explain",
          type: "explain",
          title: "解释概念",
          content: `解释一下"${selectedText.slice(0, 30)}..."`
        });
      }

      newSuggestions.push({
        id: "improve",
        type: "improve",
        title: "改进写作",
        content: "帮我改进这段文字的表达"
      });

      setSuggestions(newSuggestions);
    }
  }, [isOpen, documentContent, selectedText]);

  // 发送消息到 AI
  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || input.trim();
    if (!textToSend || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: textToSend,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/kb/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId,
          documentTitle,
          documentContent,
          selectedText,
          userInput: textToSend,
          conversationHistory: messages.slice(-6)
        })
      });

      if (!response.ok) {
        throw new Error("AI 响应失败");
      }

      const data = await response.json();
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.data.response,
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "抱歉，AI 助手暂时无法响应。请稍后再试。",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // 处理快捷建议点击
  const handleSuggestionClick = (suggestion: AISuggestion) => {
    handleSendMessage(suggestion.content);
  };

  // 插入文本到编辑器
  const handleInsert = (text: string) => {
    if (onInsertText) {
      onInsertText(text);
    }
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case "summary":
        return <FileText className="w-4 h-4" />;
      case "expand":
        return <Wand2 className="w-4 h-4" />;
      case "explain":
        return <Lightbulb className="w-4 h-4" />;
      case "improve":
        return <Sparkles className="w-4 h-4" />;
      default:
        return <Bot className="w-4 h-4" />;
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg z-50"
        size="icon"
      >
        <Sparkles className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <Card
      className={`fixed bottom-6 right-6 w-96 shadow-2xl border-purple-200 z-50 transition-all ${
        isMinimized ? "h-16" : "h-[600px]"
      }`}
    >
      <CardHeader className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <CardTitle className="text-base font-semibold text-purple-900">
              AI 写作助手
            </CardTitle>
          </div>
          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-8 w-8 text-purple-600 hover:text-purple-900 hover:bg-purple-100"
            >
              {isMinimized ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 text-purple-600 hover:text-purple-900 hover:bg-purple-100"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="p-0 flex flex-col h-[calc(600px-4rem)]">
          {/* 快捷建议 */}
          {messages.length === 0 && suggestions.length > 0 && (
            <div className="p-4 border-b border-purple-100 bg-purple-50/30">
              <p className="text-xs text-purple-700 mb-3 font-medium">
                快捷操作
              </p>
              <div className="grid grid-cols-2 gap-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="flex items-center gap-2 p-2 rounded-lg border border-purple-200 bg-white hover:bg-purple-50 hover:border-purple-300 transition-colors text-left"
                  >
                    <div className="text-purple-600">
                      {getSuggestionIcon(suggestion.type)}
                    </div>
                    <span className="text-xs text-purple-900 font-medium">
                      {suggestion.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 消息列表 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-purple-500" />
                </div>
                <p className="text-sm text-purple-900 font-medium mb-2">
                  AI 助手已就绪
                </p>
                <p className="text-xs text-purple-600 max-w-xs">
                  我可以帮你生成摘要、扩展内容、解释概念或改进写作
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] rounded-lg p-3 ${
                      message.role === "user"
                        ? "bg-purple-500 text-white"
                        : "bg-purple-50 text-purple-900 border border-purple-200"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </p>
                    {message.role === "assistant" && onInsertText && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleInsert(message.content)}
                        className="mt-2 h-7 text-xs text-purple-700 hover:text-purple-900 hover:bg-purple-100"
                      >
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        插入到文档
                      </Button>
                    )}
                  </div>
                  {message.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-purple-900">
                        我
                      </span>
                    </div>
                  )}
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <Loader2 className="w-4 h-4 text-purple-500 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 输入框 */}
          <div className="p-4 border-t border-purple-200 bg-white">
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="输入你的问题或需求..."
                className="min-h-[60px] max-h-[120px] resize-none border-purple-200 focus:border-purple-400 text-sm"
                disabled={isLoading}
              />
              <Button
                onClick={() => handleSendMessage()}
                disabled={!input.trim() || isLoading}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 h-[60px] px-4"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            {documentTitle && (
              <div className="mt-2 flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="text-xs bg-purple-50 text-purple-700 border-purple-200"
                >
                  <FileText className="w-3 h-3 mr-1" />
                  {documentTitle}
                </Badge>
                {selectedText && (
                  <Badge
                    variant="outline"
                    className="text-xs bg-pink-50 text-pink-700 border-pink-200"
                  >
                    已选择文本
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}

