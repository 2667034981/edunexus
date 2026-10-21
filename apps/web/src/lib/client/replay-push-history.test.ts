import { describe, expect, it } from "vitest";
import {
  GRAPH_REPLAY_PUSH_HISTORY_STORAGE_KEY,
  normalizeReplayPushHistoryPayload,
  readReplayPushHistoryFromStorage,
  resolveReplayPushSourceLabel,
  resolveReplayPushTargetLabel,
  sortReplayPushHistory
} from "@/lib/client/replay-push-history";

describe("replay-push-history", () => {
  it("normalizes replay push history payload", () => {
    const result = normalizeReplayPushHistoryPayload([
      {
        id: "h1",
        batchId: "batch_01",
        target: "path",
        source: "batch_queue",
        at: "2026-03-03T08:00:00.000Z",
        count: 3,
        mode: "focus",
        primaryNodeLabel: "函数",
        bridgePartnerLabel: "数列",
        queue: [
          {
            nodeId: "n1",
            nodeLabel: "函数",
            domain: "math",
            mastery: 0.43,
            risk: 0.57,
            relatedNodes: ["数列"],
            at: "2026-03-03T08:00:00.000Z"
          }
        ]
      },
      {
        id: "bad",
        target: "path"
      }
    ]);
    expect(result).toHaveLength(1);
    expect(result[0]?.batchId).toBe("batch_01");
    expect(result[0]?.queue).toHaveLength(1);
  });

  it("reads history from storage adapter", () => {
    const storage = new Map<string, string>();
    storage.set(
      GRAPH_REPLAY_PUSH_HISTORY_STORAGE_KEY,
      JSON.stringify([
        {
          id: "h1",
          batchId: "batch_01",
          target: "workspace",
          source: "single_frame",
          at: "2026-03-03T08:10:00.000Z",
          count: 1,
          primaryNodeLabel: "数列",
          queue: [
            {
              nodeId: "n2",
              nodeLabel: "数列",
              domain: "math",
              mastery: 0.5,
              risk: 0.5,
              relatedNodes: [],
              at: "2026-03-03T08:10:00.000Z"
            }
          ]
        }
      ])
    );
    const result = readReplayPushHistoryFromStorage((key) => storage.get(key) ?? null);
    expect(result).toHaveLength(1);
    expect(result[0]?.target).toBe("workspace");
  });

  it("sorts history with latest and count strategies", () => {
    const entries = normalizeReplayPushHistoryPayload([
      {
        id: "a",
        batchId: "batch_a",
        target: "path",
        source: "batch_queue",
        at: "2026-03-03T08:00:00.000Z",
        count: 2,
        primaryNodeLabel: "函数",
        queue: [
          {
            nodeId: "n1",
            nodeLabel: "函数",
            domain: "math",
            mastery: 0.4,
            risk: 0.6,
            relatedNodes: [],
            at: "2026-03-03T08:00:00.000Z"
          }
        ]
      },
      {
        id: "b",
        batchId: "batch_b",
        target: "workspace",
        source: "single_frame",
        at: "2026-03-03T09:00:00.000Z",
        count: 1,
        primaryNodeLabel: "导数",
        queue: [
          {
            nodeId: "n2",
            nodeLabel: "导数",
            domain: "math",
            mastery: 0.42,
            risk: 0.58,
            relatedNodes: [],
            at: "2026-03-03T09:00:00.000Z"
          }
        ]
      },
      {
        id: "c",
        batchId: "batch_c",
        target: "path",
        source: "history_repush",
        at: "2026-03-03T07:00:00.000Z",
        count: 4,
        primaryNodeLabel: "概率",
        queue: [
          {
            nodeId: "n3",
            nodeLabel: "概率",
            domain: "math",
            mastery: 0.38,
            risk: 0.62,
            relatedNodes: [],
            at: "2026-03-03T07:00:00.000Z"
          }
        ]
      }
    ]);
    const latest = sortReplayPushHistory(entries, "latest");
    expect(latest[0]?.batchId).toBe("batch_b");
    const countDesc = sortReplayPushHistory(entries, "count_desc");
    expect(countDesc[0]?.batchId).toBe("batch_c");
    const countAsc = sortReplayPushHistory(entries, "count_asc");
    expect(countAsc[0]?.batchId).toBe("batch_b");
  });

  it("provides source and target labels", () => {
    expect(resolveReplayPushSourceLabel("single_frame")).toContain("当前帧");
    expect(resolveReplayPushTargetLabel("path")).toBe("路径");
  });
});

