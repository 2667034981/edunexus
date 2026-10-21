import OpenAI from "openai";

/**
 * 统一的 LLM 接入层。
 *
 * 支持豆包（火山方舟）、ModelScope、OpenAI、本地 Ollama 与离线 mock 五种模式。
 * 通过环境变量切换，业务代码不需要感知具体供应商：
 *
 *   EDUNEXUS_LLM_PROVIDER=doubao|modelscope|openai|ollama|mock
 *   DOUBAO_API_KEY / ARK_API_KEY      豆包（火山方舟）密钥
 *   DOUBAO_BASE_URL / ARK_BASE_URL    默认 https://ark.cn-beijing.volces.com/api/v3
 *   DOUBAO_MODEL / ARK_MODEL          模型 ID 或推理接入点 ID（ep-xxxx）
 *
 * 兼容层：解析完成后会把结果回填到 MODELSCOPE_* 变量上，使历史代码路径
 * （大量直接读取 MODELSCOPE_* 的位置）无需逐个改造即可工作。
 */

export type LLMProvider = "doubao" | "modelscope" | "openai" | "ollama" | "mock";

export interface LLMRuntimeConfig {
  provider: LLMProvider;
  apiKey?: string;
  baseURL: string;
  model: string;
  /** 是否由服务端环境变量显式指定（用于覆盖浏览器端传来的配置） */
  pinned: boolean;
}

const PRESETS: Record<Exclude<LLMProvider, "mock">, { baseURL: string; model: string }> = {
  doubao: {
    baseURL: "https://ark.cn-beijing.volces.com/api/v3",
    model: "doubao-seed-1-6-250615"
  },
  modelscope: {
    baseURL: "https://api-inference.modelscope.cn/v1",
    model: "Qwen/Qwen3-8B"
  },
  openai: {
    baseURL: "https://api.openai.com/v1",
    model: "gpt-4o-mini"
  },
  ollama: {
    baseURL: "http://localhost:11434/v1",
    model: "llama3.1"
  }
};

function pick(...values: Array<string | undefined | null>): string | undefined {
  for (const value of values) {
    if (typeof value === "string" && value.trim() !== "") {
      return value.trim();
    }
  }
  return undefined;
}

function normalizeProvider(raw?: string): LLMProvider {
  const value = (raw ?? "").toLowerCase();
  if (value === "doubao" || value === "ark" || value === "volcengine") return "doubao";
  if (value === "openai") return "openai";
  if (value === "ollama" || value === "local") return "ollama";
  if (value === "mock") return "mock";
  return "modelscope";
}

let backfilled = false;

function backfillLegacyEnv(config: LLMRuntimeConfig) {
  if (backfilled) return;
  if (config.provider === "mock" || !config.apiKey) return;

  if (!pick(process.env.MODELSCOPE_API_KEY)) {
    process.env.MODELSCOPE_API_KEY = config.apiKey;
  }
  if (!pick(process.env.MODELSCOPE_BASE_URL)) {
    process.env.MODELSCOPE_BASE_URL = config.baseURL;
  }
  if (!pick(process.env.MODELSCOPE_CHAT_MODEL)) {
    process.env.MODELSCOPE_CHAT_MODEL = config.model;
  }
  backfilled = true;
}

export function getLLMConfig(): LLMRuntimeConfig {
  const explicit = pick(process.env.EDUNEXUS_LLM_PROVIDER, process.env.LLM_PROVIDER);
  const provider = normalizeProvider(
    explicit ?? pick(process.env.NEXT_PUBLIC_AI_PROVIDER)
  );
  const pinned = Boolean(explicit);

  let config: LLMRuntimeConfig;

  switch (provider) {
    case "doubao": {
      const preset = PRESETS.doubao;
      config = {
        provider,
        pinned,
        apiKey: pick(process.env.DOUBAO_API_KEY, process.env.ARK_API_KEY),
        baseURL:
          pick(process.env.DOUBAO_BASE_URL, process.env.ARK_BASE_URL) ?? preset.baseURL,
        model:
          pick(
            process.env.DOUBAO_MODEL,
            process.env.ARK_MODEL,
            process.env.ARK_ENDPOINT_ID
          ) ?? preset.model
      };
      break;
    }
    case "openai": {
      const preset = PRESETS.openai;
      config = {
        provider,
        pinned,
        apiKey: pick(process.env.OPENAI_API_KEY),
        baseURL: pick(process.env.OPENAI_BASE_URL) ?? preset.baseURL,
        model: pick(process.env.OPENAI_MODEL) ?? preset.model
      };
      break;
    }
    case "ollama": {
      const preset = PRESETS.ollama;
      config = {
        provider,
        pinned,
        apiKey: pick(process.env.OLLAMA_API_KEY) ?? "ollama",
        baseURL: pick(process.env.OLLAMA_BASE_URL) ?? preset.baseURL,
        model: pick(process.env.OLLAMA_MODEL) ?? preset.model
      };
      break;
    }
    case "mock": {
      config = { provider, pinned, baseURL: "", model: "mock" };
      break;
    }
    default: {
      const preset = PRESETS.modelscope;
      config = {
        provider: "modelscope",
        pinned,
        apiKey: pick(process.env.MODELSCOPE_API_KEY),
        baseURL: pick(process.env.MODELSCOPE_BASE_URL) ?? preset.baseURL,
        model: pick(process.env.MODELSCOPE_CHAT_MODEL) ?? preset.model
      };
    }
  }

  backfillLegacyEnv(config);
  return config;
}

/** 服务端是否已具备可用的模型配置 */
export function isServerLLMReady(): boolean {
  const config = getLLMConfig();
  return config.provider !== "mock" && Boolean(config.apiKey);
}

/** 当前服务端配置的模型名（供历史代码替代硬编码的 Qwen/DeepSeek 默认值） */
export function getChatModel(): string {
  return getLLMConfig().model;
}

let cachedClient: { key: string; client: OpenAI } | null = null;

export function getLLMClient(): OpenAI {
  const config = getLLMConfig();

  if (config.provider === "mock") {
    throw new Error("当前为 mock 模式，未接入真实模型。");
  }
  if (!config.apiKey) {
    throw new Error(
      `缺少 ${config.provider} 的 API Key，请配置环境变量后重试。`
    );
  }

  const cacheKey = `${config.provider}|${config.baseURL}|${config.apiKey}`;
  if (cachedClient && cachedClient.key === cacheKey) {
    return cachedClient.client;
  }

  const client = new OpenAI({
    apiKey: config.apiKey,
    baseURL: config.baseURL
  });
  cachedClient = { key: cacheKey, client };
  return client;
}

export interface ChatOptions {
  temperature?: number;
  maxTokens?: number;
  system?: string;
}

/** 一次性对话补全，返回纯文本 */
export async function chatCompletion(
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>,
  options: ChatOptions = {}
): Promise<string> {
  const client = getLLMClient();
  const config = getLLMConfig();

  const payload = options.system
    ? [{ role: "system" as const, content: options.system }, ...messages]
    : messages;

  const response = await client.chat.completions.create({
    model: config.model,
    messages: payload,
    temperature: options.temperature ?? 0.6,
    max_tokens: options.maxTokens
  });

  return response.choices[0]?.message?.content ?? "";
}

// 模块加载时立即解析一次：确保依赖 MODELSCOPE_* 的历史代码在同一进程内
// 也能拿到豆包（或其他供应商）的真实配置，而不依赖调用顺序。
getLLMConfig();

