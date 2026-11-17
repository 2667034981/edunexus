/**
 * 单机本地用户身份
 * 无登录服务器：浏览器内持久化一份稳定 userId，作为数据归属主键。
 */

export const LOCAL_USER_STORAGE_KEY = "edunexus_local_user";

export type LocalUser = {
  userId: string;
  displayName: string;
  createdAt: string;
  updatedAt: string;
};

const DEFAULT_DISPLAY_NAME = "本地学习者";

function nowIso() {
  return new Date().toISOString();
}

function createUserId() {
  // 稳定可读 id，避免依赖 crypto 在旧环境不可用
  const rand =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().replace(/-/g, "").slice(0, 12)
      : `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
  return `local_${rand}`;
}

export function createDefaultLocalUser(displayName = DEFAULT_DISPLAY_NAME): LocalUser {
  const ts = nowIso();
  return {
    userId: createUserId(),
    displayName,
    createdAt: ts,
    updatedAt: ts,
  };
}

export function readLocalUserFromStorage(): LocalUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LOCAL_USER_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<LocalUser>;
    if (!parsed.userId || typeof parsed.userId !== "string") return null;
    return {
      userId: parsed.userId,
      displayName:
        typeof parsed.displayName === "string" && parsed.displayName.trim()
          ? parsed.displayName.trim()
          : DEFAULT_DISPLAY_NAME,
      createdAt: parsed.createdAt || nowIso(),
      updatedAt: parsed.updatedAt || nowIso(),
    };
  } catch {
    return null;
  }
}

export function writeLocalUserToStorage(user: LocalUser): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LOCAL_USER_STORAGE_KEY, JSON.stringify(user));
}

/** 读取或首次创建本地用户 */
export function ensureLocalUser(): LocalUser {
  const existing = readLocalUserFromStorage();
  if (existing) return existing;
  const created = createDefaultLocalUser();
  writeLocalUserToStorage(created);
  return created;
}

export function getLocalUserId(): string {
  return ensureLocalUser().userId;
}

export function updateLocalUserDisplayName(displayName: string): LocalUser {
  const current = ensureLocalUser();
  const next: LocalUser = {
    ...current,
    displayName: displayName.trim() || DEFAULT_DISPLAY_NAME,
    updatedAt: nowIso(),
  };
  writeLocalUserToStorage(next);
  return next;
}

/** 服务端无浏览器时的回退 id（与历史 demo_user 兼容） */
export const SERVER_FALLBACK_USER_ID = "local_default";
