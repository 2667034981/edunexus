import {
  normalizePathFocusBatchPayload,
  type PathFocusPayload
} from "@/lib/client/path-focus-bridge";

export const GRAPH_REPLAY_PUSH_HISTORY_STORAGE_KEY = "edunexus_graph_replay_push_history";
export const GRAPH_REPLAY_PUSH_HISTORY_LIMIT = 12;

export type ReplayPushTarget = "path" | "workspace";
export type ReplayPushSource = "single_frame" | "batch_queue" | "history_repush";
export type ReplayPushHistorySort = "latest" | "count_desc" | "count_asc";

export type ReplayPushHistoryEntry = {
  id: string;
  batchId: string;
  target: ReplayPushTarget;
  source: ReplayPushSource;
  at: string;
  count: number;
  mode?: PathFocusPayload["replayMode"];
  primaryNodeLabel: string;
  bridgePartnerLabel?: string;
  queue: PathFocusPayload[];
};

function parseTimestamp(value: string) {
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function resolveReplayPushSourceLabel(source: ReplayPushSource) {
  if (source === "single_frame") {
    return "当前帧推送";
  }
  if (source === "batch_queue") {
    return "批量队列推送";
  }
  return "历史复推";
}

export function resolveReplayPushTargetLabel(target: ReplayPushTarget) {
  return target === "path" ? "路径" : "工作区";
}

export function normalizeReplayPushHistoryPayload(
  payload: unknown,
  limit = GRAPH_REPLAY_PUSH_HISTORY_LIMIT
) {
  if (!Array.isArray(payload)) {
    return [];
  }
  return payload
    .filter((item): item is ReplayPushHistoryEntry => {
      if (!item || typeof item !== "object") {
        return false;
      }
      const value = item as ReplayPushHistoryEntry;
      return (
        typeof value.id === "string" &&
        typeof value.batchId === "string" &&
        (value.target === "path" || value.target === "workspace") &&
        (value.source === "single_frame" ||
          value.source === "batch_queue" ||
          value.source === "history_repush") &&
        typeof value.at === "string" &&
        typeof value.count === "number" &&
        Array.isArray(value.queue)
      );
    })
    .map((item) => ({
      ...item,
      queue: normalizePathFocusBatchPayload(item.queue, 12),
      count:
        Number.isFinite(item.count) && item.count > 0
          ? Math.max(1, Math.round(item.count))
          : 1,
      mode: item.mode === "focus" || item.mode === "all" ? item.mode : undefined
    }))
    .filter((item) => item.queue.length > 0)
    .slice(0, Math.max(1, limit));
}

export function readReplayPushHistoryFromStorage(
  readItem: (key: string) => string | null,
  limit = GRAPH_REPLAY_PUSH_HISTORY_LIMIT
) {
  const raw = readItem(GRAPH_REPLAY_PUSH_HISTORY_STORAGE_KEY);
  if (!raw) {
    return [];
  }
  try {
    return normalizeReplayPushHistoryPayload(JSON.parse(raw) as unknown, limit);
  } catch {
    return [];
  }
}

export function sortReplayPushHistory(
  entries: ReplayPushHistoryEntry[],
  sortBy: ReplayPushHistorySort
) {
  const copied = [...entries];
  copied.sort((a, b) => {
    if (sortBy === "count_desc") {
      if (b.count !== a.count) {
        return b.count - a.count;
      }
      return parseTimestamp(b.at) - parseTimestamp(a.at);
    }
    if (sortBy === "count_asc") {
      if (a.count !== b.count) {
        return a.count - b.count;
      }
      return parseTimestamp(b.at) - parseTimestamp(a.at);
    }
    return parseTimestamp(b.at) - parseTimestamp(a.at);
  });
  return copied;
}

