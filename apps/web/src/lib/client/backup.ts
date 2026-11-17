/**
 * 单机备份：导出/导入浏览器侧关键 localStorage + 拉取服务端 db 摘要
 */

import {
  LOCAL_USER_STORAGE_KEY,
  ensureLocalUser,
  writeLocalUserToStorage,
  type LocalUser,
} from "@/lib/identity/local-user";

export const BACKUP_VERSION = 1;

/** 需要纳入备份的 localStorage 键前缀 / 精确键 */
const EXACT_KEYS = [
  LOCAL_USER_STORAGE_KEY,
  "edunexus_model_config",
  "edunexus_theme",
  "edunexus_kb_vaults",
  "edunexus_kb_current_vault",
  "edunexus_projects",
  "learning-notes",
  "edunexus_user_profiles",
  "edunexus_user_notes",
  "edunexus_user_projects",
  "edunexus_user_groups",
  "edunexus_privacy_settings",
  "edunexus_social_stats",
  "edunexus_follows",
  "edunexus_activities",
  "edunexus_milestones",
  "edunexus_learning_calendar",
];

const PREFIXES = [
  "edunexus_",
  "path_",
  "practice_",
  "goal_",
  "resource_",
  "qa_",
];

export type EduNexusBackup = {
  version: number;
  exportedAt: string;
  localUser: LocalUser | null;
  localStorage: Record<string, string>;
  serverDb?: unknown;
};

function collectLocalStorage(): Record<string, string> {
  const out: Record<string, string> = {};
  if (typeof window === "undefined") return out;

  const exact = new Set(EXACT_KEYS);
  for (let i = 0; i < window.localStorage.length; i += 1) {
    const key = window.localStorage.key(i);
    if (!key) continue;
    const matchExact = exact.has(key);
    const matchPrefix = PREFIXES.some((p) => key.startsWith(p));
    if (matchExact || matchPrefix) {
      const value = window.localStorage.getItem(key);
      if (value != null) out[key] = value;
    }
  }
  return out;
}

export async function buildBackupBundle(): Promise<EduNexusBackup> {
  const localUser = typeof window !== "undefined" ? ensureLocalUser() : null;
  let serverDb: unknown;
  try {
    const res = await fetch("/api/backup/export");
    if (res.ok) {
      const json = await res.json();
      // API 返回 { data: { db } }
      serverDb = json?.data?.db ?? json?.data ?? json;
    }
  } catch {
    serverDb = undefined;
  }

  return {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    localUser,
    localStorage: collectLocalStorage(),
    serverDb,
  };
}

export async function downloadBackupFile(): Promise<void> {
  const bundle = await buildBackupBundle();
  const blob = new Blob([JSON.stringify(bundle, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `edunexus-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export type RestoreOptions = {
  restoreLocalStorage?: boolean;
  restoreServerDb?: boolean;
};

export async function restoreBackupBundle(
  bundle: EduNexusBackup,
  options: RestoreOptions = {}
): Promise<{ localRestored: number; serverOk: boolean }> {
  const restoreLocal = options.restoreLocalStorage !== false;
  const restoreServer = options.restoreServerDb !== false;
  let localRestored = 0;
  let serverOk = false;

  if (restoreLocal && typeof window !== "undefined") {
    if (bundle.localUser?.userId) {
      writeLocalUserToStorage(bundle.localUser);
    }
    for (const [key, value] of Object.entries(bundle.localStorage || {})) {
      window.localStorage.setItem(key, value);
      localRestored += 1;
    }
  }

  if (restoreServer && bundle.serverDb) {
    try {
      const res = await fetch("/api/backup/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ db: bundle.serverDb }),
      });
      serverOk = res.ok;
    } catch {
      serverOk = false;
    }
  }

  return { localRestored, serverOk };
}

export function parseBackupFileText(text: string): EduNexusBackup {
  const parsed = JSON.parse(text) as EduNexusBackup;
  if (!parsed || typeof parsed !== "object") {
    throw new Error("备份文件格式无效");
  }
  if (parsed.version == null) {
    throw new Error("缺少 version 字段");
  }
  return parsed;
}
